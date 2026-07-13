import { useState, useCallback } from 'react';
import { useGameStore } from './store/gameStore';
import { useDevtoolsHotkeys, isPlaytestEnabled } from './hooks/useDevtoolsHotkeys';
import { useDevtoolsStore } from './store/devtoolsStore';
import ErrorBoundary from './components/ErrorBoundary';
import DevtoolsPanel from './devtools/DevtoolsPanel';
import { getAllPsychLayers } from './data/psychologicalWorlds/index';
import type { NpcId } from './data/verticalSlice';
import type { LocationId } from './data/locations';
import {
  AftermathReport,
  NpcInnerWorld,
  ChapterSelectorModal,
  EmotionDictionaryPage,
  OuterWorldConversation,
  OuterWorldExplorer,
  SelfReconciliationPortal,
  SubconsciousTavern,
  TavernIntro,
  TitlePortal,
} from './ui';

type Screen = 'title' | 'tavernIntro' | 'city' | 'tavern' | 'conversation' | 'innerWorld' | 'dictionary' | 'aftermath' | 'reconciliation';

function getNpcIdForLocation(locationId: LocationId): NpcId {
  if (locationId === 'skybridge') return 'bridge_artist';
  if (locationId === 'comedy_club_entrance' || locationId === 'comedy_club_backstage' || locationId === 'hospital_ward') return 'rena';
  return 'bridge_artist';
}

export default function App() {
  const save = useGameStore(state => state.save);
  const collectClue = useGameStore(state => state.collectClue);
  const setCurrentLocation = useGameStore(state => state.setCurrentLocation);
  const applyBackendNpcState = useGameStore(state => state.applyBackendNpcState);
  const completeNpcSuccess = useGameStore(state => state.completeNpcSuccess);

  const resetSave = useGameStore(state => state.resetSave);
  const setInnerWorldDepth = useGameStore(state => state.setInnerWorldDepth);
  const advancePsychLayer = useGameStore(state => state.advancePsychLayer);
  const forceUnlockInnerWorld = useGameStore(state => state.forceUnlockInnerWorld);
  const addFlagToNpc = useGameStore(state => state.addFlagToNpc);
  const setPlayerPos = useGameStore(state => state.setPlayerPos);
  const markPlotViewed = useGameStore(state => state.markPlotViewed);

  const [screen, setScreen] = useState<Screen>('title');
  const [returnScreen, setReturnScreen] = useState<Screen>('city');
  const [arcFailureActive, setArcFailureActive] = useState(false);
  const [currentNpcId, setCurrentNpcId] = useState<NpcId>('bridge_artist');
  const [devtoolsNpcId, setDevtoolsNpcId] = useState<NpcId>('bridge_artist');

  const currentNpc = save.npcs[currentNpcId];

  // ---- Devtools callbacks ----
  // F7 / F9 / S+F9 等熱鍵針對「Devtools Panel 中選中的角色」執行，
  // 與畫面上主要互動的 NPC 解耦，方便在測試時靈活切換檢查對象。
  const onForceUnlock = useCallback(() => {
    forceUnlockInnerWorld(devtoolsNpcId);
  }, [forceUnlockInnerWorld, devtoolsNpcId]);

  const onEnterInnerWorld = useCallback(() => {
    setCurrentNpcId(devtoolsNpcId);
    setReturnScreen(screen === 'innerWorld' ? 'city' : screen);
    setScreen('innerWorld');
  }, [screen, devtoolsNpcId]);

  const onSelectChapter = useCallback((depth: number) => {
    setCurrentNpcId(devtoolsNpcId);
    setInnerWorldDepth(depth - 1, devtoolsNpcId);
    setReturnScreen(screen === 'innerWorld' ? 'city' : screen);
    setScreen('innerWorld');
  }, [screen, setInnerWorldDepth, devtoolsNpcId]);

  // ---- Devtools: hotkeys + QA panel ----
  const { active: devtoolsActive, demoMode } = useDevtoolsHotkeys({
    onForceUnlock,
    onEnterInnerWorld,
    onSelectChapter,
  });
  const chapterSelectorOpen = useDevtoolsStore((s) => s.chapterSelectorOpen);

  const openScreenWithReturn = (nextScreen: Screen) => {
    setReturnScreen(screen);
    setScreen(nextScreen);
  };

  const resetAndReturnTitle = async () => {
    // 在清档前检查：三个 NPC 是否全部达成 success 结局
    const { bridge_artist, aoi, rena } = save.npcs;
    const allNpcsCompleted =
      bridge_artist?.ending === 'success' &&
      aoi?.ending === 'success' &&
      rena?.ending === 'success';

    await resetSave();
    // resetSave 已創建新存檔，hasViewPlot 自動為 false

    setReturnScreen('city');
    setScreen('title');
  };

  const content = (() => {
    if (screen === 'title') {
      return (
        <TitlePortal
          onStart={() => {
            if (save.hasViewPlot) {
              setScreen('city');
            } else {
              setScreen('tavernIntro');
            }
          }}
          onOpenTavern={() => openScreenWithReturn('tavern')}
          onOpenDictionary={() => openScreenWithReturn('dictionary')}
          onOpenReport={() => openScreenWithReturn('aftermath')}
        />
      );
    }

    if (screen === 'tavernIntro') {
      return (
        <TavernIntro
          onEnterCity={() => setScreen('city')}
          onOpenDictionary={() => { setReturnScreen('city'); setScreen('dictionary'); }}
          onViewPlot={markPlotViewed}
        />
      );
    }

    if (screen === 'tavern') {
      return (
        <SubconsciousTavern
          save={save}
          onBack={() => setScreen(returnScreen)}
          onEnterCity={() => setScreen('city')}
          onOpenReport={() => openScreenWithReturn('aftermath')}
        />
      );
    }

    if (screen === 'conversation') {
      const maxLayer = getAllPsychLayers(currentNpcId).length;
      const layerNumbers = Array.from({ length: maxLayer }, (_, i) => i + 1);
      return (
        <OuterWorldConversation
          inventory={save.collectedClues}
          innerWorldDepth={currentNpc.innerWorldDepth}
          npcState={currentNpc}
          npcId={currentNpcId}
          onClose={() => {
            const layers = currentNpc.innerWorld?.layers;
            const allLayersComplete = layers && layerNumbers.every(l => layers[l]?.completed);
            if (allLayersComplete && currentNpc.ending === 'none') {
              completeNpcSuccess(currentNpcId);
              setScreen('aftermath');
            } else {
              setScreen('city');
            }
          }}
          onBackendNpcStateApplied={(state) => applyBackendNpcState(currentNpcId, state)}
          onEnterInnerWorld={() => setScreen('innerWorld')}
          onEndingTriggered={() => setScreen('aftermath')}
        />
      );
    }

    if (screen === 'innerWorld') {
      return (
        <NpcInnerWorld
          npcId={currentNpcId}
          arcFailure={arcFailureActive}
          onOpenReport={() => {
            setArcFailureActive(false);
            openScreenWithReturn('aftermath');
          }}
          onReturnToSurface={(depth) => {
            setInnerWorldDepth(depth, currentNpcId);
            setScreen('conversation');
          }}
          onAdvanceLayer={(layer) => advancePsychLayer(layer, currentNpcId)}
        />
      );
    }

    if (screen === 'dictionary') {
      return <EmotionDictionaryPage onBack={() => setScreen(returnScreen)} />;
    }

    if (screen === 'aftermath') {
      return (
        <AftermathReport
          save={save}
          npcId={currentNpcId}
          onBack={() => setScreen('city')}
          onOpenReconciliation={() => setScreen('reconciliation')}
        />
      );
    }

    if (screen === 'reconciliation') {
      return (
        <SelfReconciliationPortal
          save={save}
          onBack={() => setScreen('city')}
          onRestart={resetAndReturnTitle}
        />
      );
    }

    return (
      <OuterWorldExplorer
        save={save}
        collectClue={collectClue}
        setCurrentLocation={setCurrentLocation}
        resetSave={resetAndReturnTitle}
        onOpenConversation={() => setScreen('conversation')}
        onOpenDictionary={() => openScreenWithReturn('dictionary')}
        onOpenTavern={() => openScreenWithReturn('tavern')}
        onOpenReport={() => openScreenWithReturn('aftermath')}
        onEnterInnerWorld={() => {
          setCurrentNpcId(getNpcIdForLocation(save.currentLocation));
          setScreen('innerWorld');
        }}
        addFlagToNpc={addFlagToNpc}
        onOpenArcFailure={() => {
          setArcFailureActive(true);
          setScreen('innerWorld');
        }}
        onSwitchNpc={setCurrentNpcId}
        setPlayerPos={setPlayerPos}
      />
    );
  })();

  return (
    <ErrorBoundary>
      {content}

      {/* Devtools QA Panel (整合版) */}
      {isPlaytestEnabled() && devtoolsActive && !demoMode && (
        <DevtoolsPanel
          currentScreen={screen}
          selectedNpcId={devtoolsNpcId}
          onSelectNpcId={setDevtoolsNpcId}
        />
      )}

      {/* Chapter Selector Modal (Shift+F9) */}
      {chapterSelectorOpen && (
        <ChapterSelectorModal onSelectChapter={onSelectChapter} />
      )}

      {/* Demo Mode indicator (subtle) */}
      {demoMode && (
        <div style={{
          position: 'fixed',
          bottom: 8,
          right: 8,
          zIndex: 100000,
          padding: '4px 10px',
          borderRadius: 4,
          background: 'rgba(255,152,0,0.25)',
          color: '#ff9800',
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          backdropFilter: 'blur(4px)',
          pointerEvents: 'none',
        }}>
          🎬 DEMO MODE · F10 to exit
        </div>
      )}
    </ErrorBoundary>
  );
}
