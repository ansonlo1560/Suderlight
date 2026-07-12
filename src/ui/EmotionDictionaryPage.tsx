import { useEffect, useState, useMemo } from 'react';
import { GlimmerButton, GlassPanel, GuiFrame } from '../components';
import { getNpcIdForClue, type NpcId } from '../data/verticalSlice';

type DictEntryRaw = {
  id: string;
  name: string;
  description: string;
  relatedClues: string[];
  unlockCondition: string;
  realitySupport?: string;
};

type DictEntry = DictEntryRaw & {
  unlocked: boolean;
};

type EmotionDictionaryPageProps = {
  onBack: () => void;
};

const SAVE_KEY = 'glimmer_city_vertical_slice_save_v1';

const NPC_TABS: { id: NpcId; name: string }[] = [
  { id: 'bridge_artist', name: '天橋畫家' },
  { id: 'aoi', name: '小葵' },
  { id: 'rena', name: '蕾娜' },
];

function getCollectedClues(): string[] {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return [];
    const save = JSON.parse(raw);
    return Array.isArray(save.collectedClues) ? save.collectedClues : [];
  } catch {
    return [];
  }
}

function isEntryUnlocked(entry: { relatedClues?: string[]; unlockCondition?: string }, collectedClues: string[]) {
  const related = Array.isArray(entry.relatedClues) ? entry.relatedClues : [];
  const condition = entry.unlockCondition;
  return collectedClues.some(c => related.includes(c) || c === condition);
}

export default function EmotionDictionaryPage({ onBack }: EmotionDictionaryPageProps) {
  const [rawEntries, setRawEntries] = useState<DictEntryRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedNpcId, setSelectedNpcId] = useState<NpcId>('bridge_artist');

  useEffect(() => {
    fetch('/api/dictionary')
      .then(res => res.json())
      .then(data => {
        setRawEntries(Array.isArray(data.entries) ? data.entries : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔧 Bug fix: read collectedClues from localStorage on EVERY render,
  // so the unlock status is always up to date even when returning to this page
  const collectedClues = getCollectedClues();

  const entries: DictEntry[] = useMemo(() => {
    return rawEntries.map(entry => ({
      ...entry,
      unlocked: isEntryUnlocked(entry, collectedClues),
    }));
  }, [rawEntries, collectedClues]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const firstClue = entry.relatedClues?.[0] || entry.unlockCondition;
      if (!firstClue) return false;
      return getNpcIdForClue(firstClue as any) === selectedNpcId;
    });
  }, [entries, selectedNpcId]);

  const unlockedEntries = filteredEntries.filter(entry => entry.unlocked);
  const selected = entries.find(entry => entry.id === selectedId) ?? (unlockedEntries.length > 0 ? unlockedEntries[0] : null);
  const lockedCount = filteredEntries.length - unlockedEntries.length;

  return (
    <GuiFrame tone="paper">
      <style>{`
        .dictionary-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .dictionary-scroll::-webkit-scrollbar-track {
          background: rgba(95,61,32,0.05);
          border-radius: 3px;
        }
        .dictionary-scroll::-webkit-scrollbar-thumb {
          background: rgba(95,61,32,0.2);
          border-radius: 3px;
        }
        .dictionary-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(95,61,32,0.3);
        }
      `}</style>
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <GlassPanel title="情緒詞典" subtitle="Emotion Dictionary" variant="paper" style={{ maxWidth: 960, width: '100%' }} contentStyle={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '72vh', padding: '20px 24px' }}>

          {/* NPC Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {NPC_TABS.map(tab => {
              const isActive = selectedNpcId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedNpcId(tab.id);
                    setSelectedId(null);
                  }}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 999,
                    border: '2px solid rgba(95,61,32,0.2)',
                    background: isActive ? 'rgba(35,29,24,0.86)' : 'rgba(30,30,30,0)',
                    color: isActive ? '#ffffffff' : '#1a1a1a',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 0 12px rgba(35,29,24,0.86)66' : 'none',
                  }}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Main content: two-column layout inside one panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, flex: 1, minHeight: 0 }}>
            
            {/* Left column: entry list */}
            <div className="dictionary-scroll" style={{ overflowY: 'auto', display: 'grid', gap: 10, paddingRight: 6, alignContent: 'start' }}>
              {loading && <div style={{ color: '#6b5137', padding: 16 }}>載入中...</div>}
              {!loading && unlockedEntries.length === 0 && (
                <div style={{ color: '#6b5137', padding: 16, fontSize: 14, fontStyle: 'italic', textAlign: 'center', opacity: 0.7 }}>
                  尚未解鎖關於此角色的任何理解。
                </div>
              )}
              {!loading && unlockedEntries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: selected?.id === entry.id ? '1px solid rgba(95,61,32,0.72)' : '1px solid rgba(95,61,32,0.2)',
                    background: selected?.id === entry.id ? 'rgba(95,61,32,0.14)' : 'rgba(255,255,255,0.18)',
                    color: '#241b14',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{entry.name}</div>
                  <div style={{ color: '#765d42', fontSize: 12, marginTop: 4 }}>相關線索：點擊查看</div>
                </button>
              ))}
              {lockedCount > 0 && <div style={{ color: '#775f45', fontSize: 13, textAlign: 'center', paddingTop: 8, paddingBottom: 16 }}>尚有 {lockedCount} 個未解鎖的理解等待發現</div>}
            </div>

            {/* Right column: description + reality support */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
              {/* Description card */}
              <div style={{ borderRadius: 16, padding: 24, background: 'rgba(35,29,24,0.86)', color: '#f4efe7', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div style={{ color: '#d6a35e', letterSpacing: 3, fontSize: 12 }}>心理手記</div>
                <h3 style={{ margin: '18px 0 10px' }}>{selected?.name ?? '未選擇詞條'}</h3>
                <div className="dictionary-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
                  <p style={{ color: '#d0c6ba', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                    {selected?.description ?? '詞條尚未被雨水顯影。請在城市中找到更多記憶錨點。'}
                  </p>
                </div>
              </div>

              {/* Reality support card */}
              <div style={{ borderRadius: 16, padding: 24, background: 'linear-gradient(180deg, rgba(255,246,216,0.92), rgba(221,237,213,0.9))', color: '#293226', border: '1px solid rgba(80,108,76,0.2)', display: 'flex', flexDirection: 'column', flex: '0 0 auto', maxHeight: '45%' }}>
                <div style={{ color: '#678c5a', letterSpacing: 3, fontSize: 12 }}>現實支持提醒</div>
                <h3 style={{ margin: '18px 0 10px' }}>現實支持提醒</h3>
                <div className="dictionary-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
                  {selected?.realitySupport ? (
                    <p style={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                      {selected.realitySupport}
                    </p>
                  ) : (
                    <p style={{ color: '#6b7b65', lineHeight: 1.9, fontStyle: 'italic' }}>
                      選擇一個已解鎖的詞條以查看對應的現實支持提醒。
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: generic support reminder + back button */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(95,61,32,0.1)' }}>
            <p style={{ color: '#8b7355', fontSize: 13, lineHeight: 1.8, textAlign: 'center', margin: '0 0 16px 0' }}>
              如果你在現實中遇到類似困境，請優先尋找可信任的人、校園心理中心、社工或專業諮詢協助。當出現立即危險，請聯絡當地緊急服務。
              遊戲中的傾聽練習，重點不是「說服對方好起來」，而是承認感受存在，並陪對方回到安全處境。
            </p>
            <GlimmerButton tone="ghost" onClick={onBack} fullWidth>返回</GlimmerButton>
          </div>
        </GlassPanel>
      </div>
    </GuiFrame>
  );
}
