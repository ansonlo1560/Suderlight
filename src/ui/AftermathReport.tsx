import { useState } from 'react';
import { GlimmerButton, GlassPanel, GuiFrame } from '../components';
import type { GameSave } from '../systems/saveSystem';
import type { NpcId } from '../data/verticalSlice';
import { bridgeArtistAftermath } from '../data/npcs/bridgePainter';
import { renaAftermath } from '../data/npcs/rena';
import { aoiAftermath } from '../data/npcs/aoi';

type AftermathReportProps = {
  save: GameSave;
  onBack: () => void;
  onOpenReconciliation: () => void;
  npcId?: NpcId;
};

function getAftermathContent(npcId: NpcId) {
  if (npcId === 'bridge_artist') return bridgeArtistAftermath;
  if (npcId === 'rena') return renaAftermath;
  if (npcId === 'aoi') return aoiAftermath;
  return bridgeArtistAftermath;
}

const NPC_ENTRIES: { npcId: NpcId; label: string }[] = [
  { npcId: 'bridge_artist', label: '天橋畫家' },
  { npcId: 'aoi', label: '學童小葵' },
  { npcId: 'rena', label: '喜劇演員蕾娜' },
];

/** 根據 save 選擇預設活躍 tab：成功 > 失敗 > 第一個 */
function getDefaultTab(save: GameSave): NpcId {
  for (const e of NPC_ENTRIES) {
    if (save.npcs[e.npcId]?.ending === 'success') return e.npcId;
  }
  for (const e of NPC_ENTRIES) {
    if (save.npcs[e.npcId]?.ending === 'failed') return e.npcId;
  }
  return NPC_ENTRIES[0].npcId;
}

export default function AftermathReport({ save, onBack, onOpenReconciliation }: AftermathReportProps) {
  const [activeNpcId, setActiveNpcId] = useState<NpcId>(() => getDefaultTab(save));
  const allCompleted = NPC_ENTRIES.every(e => save.npcs[e.npcId]?.ending !== 'none');
  const activeNpc = save.npcs[activeNpcId];
  const aftermath = getAftermathContent(activeNpcId);
  const isUnlocked = activeNpc?.ending !== 'none';
  const isSuccess = activeNpc?.ending === 'success';
  const lt = (aftermath.labels as any).labelTexts;

  return (
    <GuiFrame tone="paper">
      <div style={{ position: 'relative', zIndex: 2, height: '100%', overflowY: 'auto', padding: '4vh 6vw' }}>
        <GlassPanel title="心靈餘波匯報" subtitle="Aftermath Report" variant="paper" style={{ maxWidth: 980, margin: '0 auto' }}>

          {/* Tab 按鈕列 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {NPC_ENTRIES.map((entry) => {
              const isActive = entry.npcId === activeNpcId;
              const npc = save.npcs[entry.npcId];
              const done = npc?.ending !== 'none';
              const dotColor = npc?.ending === 'success' ? '#6aaf6a' : npc?.ending === 'failed' ? '#d97a5a' : '#c0b090';
              return (
                <button
                  key={entry.npcId}
                  onClick={() => setActiveNpcId(entry.npcId)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: isActive ? '2px solid rgba(70,48,30,0.32)' : '1px solid rgba(70,48,30,0.12)',
                    background: isActive ? 'rgba(70,48,30,0.08)' : 'rgba(70,48,30,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: '#3a2c20',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: dotColor,
                    display: 'inline-block',
                  }} />
                  {entry.label}
                </button>
              );
            })}
          </div>

          {/* 選中 NPC 的彙報內容 */}
          {isUnlocked ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <h3 style={{ margin: 0, color: '#3a2c20' }}>{aftermath.title}</h3>
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: isSuccess ? 'rgba(80,180,120,0.16)' : 'rgba(200,100,80,0.14)',
                  color: isSuccess ? '#3a7a4a' : '#9a4a3a',
                  border: `1px solid ${isSuccess ? 'rgba(80,180,120,0.3)' : 'rgba(200,100,80,0.25)'}`,
                }}>
                  {isSuccess ? '✦ 成功' : '✧ 失敗'}
                </span>
              </div>

              <section>
                {isSuccess ? (
                  <>
                    <p style={{ lineHeight: 1.85, color: '#463525', margin: 0 }}>
                      {activeNpc.innerWorldDepth >= 3
                        ? aftermath.paragraphs.successDepth3
                        : activeNpc.innerWorldDepth >= 2
                          ? aftermath.paragraphs.successDepth2
                          : aftermath.paragraphs.successDepth1}
                    </p>
                    {activeNpc.innerWorldDepth > 0 && (
                      <p style={{ lineHeight: 1.85, color: '#463525', marginTop: 14 }}>
                        {activeNpc.innerWorldDepth >= 3
                          ? aftermath.paragraphs.innerDepth3
                          : activeNpc.innerWorldDepth >= 2
                            ? aftermath.paragraphs.innerDepth2
                            : aftermath.paragraphs.innerDepth1}
                      </p>
                    )}
                  </>
                ) : (
                  <p style={{ lineHeight: 1.85, color: '#463525', margin: 0 }}>
                    {aftermath.paragraphs.failed}
                  </p>
                )}
              </section>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {(() => {
                  const cards: [string, string][] = [
                    [
                      aftermath.labels.cliffHand,
                      lt?.cliffHand_high ?? (activeNpc.trust >= 50 ? '你沒有急著拉扯。' : '你仍在尋找合適的距離。'),
                    ],
                    [
                      aftermath.labels.backTurned,
                      activeNpc.ending === 'failed'
                        ? (lt?.backTurned_failed ?? '他被留在了那場雨裡。')
                        : (lt?.backTurned_other ?? '背影尚未完全凝固。'),
                    ],
                    [
                      aftermath.labels.lastSmile,
                      activeNpc.ending === 'success'
                        ? (lt?.lastSmile_success ?? '他聽見了雨聲。')
                        : (lt?.lastSmile_other ?? '尚未顯影。'),
                    ],
                  ];
                  if (lt) {
                    cards[0][1] = activeNpc.trust >= 50 ? lt.cliffHand_high : lt.cliffHand_low;
                  }
                  return cards;
                })().map(([title, content]) => (
                  <div key={title} style={{ flex: 1, minHeight: 64, borderRadius: 12, padding: 12, background: 'linear-gradient(145deg, rgba(42,36,30,0.9), rgba(12,10,8,0.94))', color: '#d9c8ad', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)' }}>
                    <div style={{ color: '#d6a35e', fontSize: 12, fontWeight: 600 }}>{title}</div>
                    <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.65 }}>{content}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', color: '#3a2c20', lineHeight: 1.75, fontSize: 13 }}>
                {aftermath.conclusion}
              </div>
            </>
          ) : (
            <div style={{
              padding: '40px 20px', textAlign: 'center', color: '#8a7a6a', borderRadius: 12,
              background: 'rgba(160,140,120,0.06)', border: '1px dashed rgba(160,140,120,0.2)',
              fontSize: 14, lineHeight: 1.8,
            }}>
              此靈魂軌跡尚未解鎖。<br />
              完成該 NPC 的修復旅程後，即可查看完整的餘波匯報。
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 22 }}>
            <GlimmerButton tone="primary" onClick={onBack}>回到城市</GlimmerButton>
            {allCompleted && (
              <GlimmerButton onClick={onOpenReconciliation}>進入自我和解</GlimmerButton>
            )}
            {!allCompleted && (
              <div style={{ color: '#5a4a2a', fontSize: 12, fontStyle: 'italic', alignSelf: 'center' }}>
                三位 NPC 的旅程全部結束後，即可進入自我和解（已完成 {NPC_ENTRIES.filter(e => save.npcs[e.npcId]?.ending !== 'none').length}/3）。
              </div>
            )}
          </div>
        </GlassPanel>
      </div>
    </GuiFrame>
  );
}
