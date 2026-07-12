import { useState, useCallback } from 'react';
import { GlimmerButton, GlassPanel, GuiFrame } from '../components';

type TavernIntroProps = {
  onEnterCity: () => void;
  onOpenDictionary: () => void;
};

/** 酒馆老板开场对话，以四个图片占位为节奏点 */
const DIALOGUE_SEGMENTS = [
  {
    imageSlot: 'wiping_glass' as const,
    imageHint: '老板擦杯子',
    speaker: '',
    lines: [
      '（老闆頭也不抬，繼續擦著杯子，聲音不輕不重）',
      '',
      '「外面還在下吧？坐。這城市哪都濕漉漉的，就這裡還能把衣服晾乾。」',
      '',
      '（他推過來一杯溫熱的飲品，不是酒，是某種草藥茶）',
      '',
      '「第一次來微光城市的人，總是先聞到鐵鏽味。習慣了就好。或者說，習慣不了也沒關係。」',
    ],
  },
  {
    imageSlot: 'look_up' as const,
    imageHint: '老板抬头看玩家',
    speaker: '',
    lines: [
      '（他終於抬頭看你一眼，眼袋很深，但目光意外地柔和）',
      '',
      '「你這雙眼睛我看過。不是來躲雨的，是來聽別人下雨的。」',
      '',
      '「你是修復師對吧？能聽見雨聲裡那些……不太對勁的東西。」',
      '',
      '（他低頭繼續擦杯子）',
      '',
      '「這城裡有很多人，心裡在下一場停不下來的雨。你能幫他們。或者至少……陪他們淋一會兒。」',
    ],
  },
  {
    imageSlot: 'give_dictionary' as const,
    imageHint: '老板给情绪词典',
    speaker: '',
    lines: [
      '（他指向窗外模糊的街燈）',
      '',
      '「街上那些發光的小東西，不是垃圾。是他們丟掉的自己。碰一下，你就能聽懂一點他們的雨聲。」',
      '',
      '（他從吧檯下面摸出一本舊書，封面被磨得發白，推到你面前）',
      '',
      '「給你。現在裡面什麼都沒有。別急著寫，它自己會知道什麼時候該寫什麼。我也沒搞懂原理，反正……你先帶著。」',
      '',
      '（他輕輕敲了敲吧檯上那本舊書）',
      '',
      '「這本詞典，本來空白的。你每聽懂一個人，它就會多寫一行。不是我給你寫，是它自己。」',
      '',
      '「有些人會讓你進去——不是進他家門，是進他心裡。裡面不一定好看，但你是修復師，你應該知道。」',
      '',
      '（停頓。雨聲很大。）',
      '',
      '「哦對了。如果弄砸了，那個人的影子會留在雨裡。不是鬼，更像是……你心裡的回音。別怕，每一個修復師都得學會跟這種回音相處。」',
    ],
  },
  {
    imageSlot: 'look_serious' as const,
    imageHint: '老板抬头认真看玩家',
    speaker: '',
    lines: [
      '（他放下杯子，第一次認真地看你）',
      '',
      '「你記住一件事。你不是來讓別人不痛的。痛是那些人在這個世界裡最後一件屬於自己的東西。你是來讓他們知道——」',
      '',
      '（他的聲音變得更輕）',
      '',
      '「——痛著也沒關係。」',
      '',
      '（然後他又開始擦杯子了，好像剛才什麼都沒說）',
      '',
      '「能找到那個報攤也算你有本事。沒被雨泡爛之前，那裡賣過地圖。現在嘛……地圖沒用了，路得你自己在雨裡摸。」',
    ],
  },
];

type ImageSlot = 'wiping_glass' | 'look_up' | 'give_dictionary' | 'look_serious';

/** 单个图片占位组件 */
function ImagePlaceholder({ slot, hint }: { slot: ImageSlot; hint: string }) {
  return (
    <div
      data-image-slot={slot}
      style={{
        width: '100%',
        maxWidth: 480,
        minHeight: 200,
        margin: '16px auto',
        borderRadius: 14,
        border: '2px dashed rgba(214,163,94,0.35)',
        background: 'rgba(214,163,94,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
      }}
    >
      {/* 图片标签 */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 14,
        color: '#d6a35e',
        fontSize: 11,
        letterSpacing: 1,
        background: 'rgba(0,0,0,0.5)',
        padding: '2px 8px',
        borderRadius: 4,
      }}>
        📷 {hint}
      </div>

      {/* 占位图标 */}
      <div style={{
        fontSize: 48,
        opacity: 0.35,
        marginBottom: 10,
        filter: 'grayscale(0.5)',
      }}>
        {slot === 'wiping_glass' ? '🍺' : slot === 'look_up' ? '👀' : slot === 'give_dictionary' ? '📖' : '💭'}
      </div>

      <div style={{
        color: 'rgba(214,163,94,0.55)',
        fontSize: 13,
        letterSpacing: 1,
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        [ 此處插入圖片：{hint} ]
      </div>

      <div style={{
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        marginTop: 8,
        fontFamily: 'monospace',
      }}>
        slot=&quot;{slot}&quot;
      </div>
    </div>
  );
}

export default function TavernIntro({ onEnterCity, onOpenDictionary }: TavernIntroProps) {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const isLastSegment = currentSegment >= DIALOGUE_SEGMENTS.length;

  const handleContinue = useCallback(() => {
    if (currentSegment < DIALOGUE_SEGMENTS.length) {
      setCurrentSegment(prev => prev + 1);
    }
    // 所有段落展示完毕后的下一次点击 → 显示词典解锁弹窗
    if (currentSegment >= DIALOGUE_SEGMENTS.length) {
      setShowDictionaryModal(true);
    }
  }, [currentSegment]);

  const handleEnterCity = useCallback(() => {
    onEnterCity();
  }, [onEnterCity]);

  const visibleSegments = DIALOGUE_SEGMENTS.slice(0, currentSegment);

  return (
    <GuiFrame tone="tavern">
      {/* 背景雨丝效果 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 22 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 41 + 7) % 100}%`,
              top: `${-30 - (i * 17) % 60}px`,
              width: 1,
              height: 80 + (i * 11) % 70,
              background: 'linear-gradient(180deg, transparent, rgba(180,200,220,0.2), transparent)',
              animation: `tavern-rain ${1.2 + (i % 3) * 0.4}s linear ${(i * 0.3) % 2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes tavern-rain {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.2; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes tavern-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tavern-glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(214,163,94,0.12); }
          50% { box-shadow: 0 0 50px rgba(214,163,94,0.22); }
        }
      `}</style>

      {/* 主内容区 */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '4vh 6vw',
        overflow: 'hidden',
      }}>
        {/* 顶部标题 */}
        <div style={{
          textAlign: 'center',
          paddingBottom: 16,
          borderBottom: '1px solid rgba(214,163,94,0.12)',
          flexShrink: 0,
        }}>
          <div style={{ color: '#d6a35e', letterSpacing: 5, fontSize: 12, marginBottom: 6 }}>
            潛意識酒館
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 3 }}>
            序章 · 雨還沒有停
          </div>
        </div>

        {/* 对话滚动区域 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {visibleSegments.map((seg, idx) => (
            <div
              key={idx}
              style={{
                width: '100%',
                maxWidth: 720,
                animation: 'tavern-fade-in 0.7s ease-out both',
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {/* 图片占位 */}
              <ImagePlaceholder slot={seg.imageSlot} hint={seg.imageHint} />

              {/* 对话文字 */}
              <GlassPanel
                variant="warm"
                contentStyle={{
                  color: '#d9c4a6',
                  lineHeight: 2.1,
                  fontSize: 15,
                  whiteSpace: 'pre-line',
                  padding: '24px 28px',
                  fontStyle: seg.lines.some(l => l.startsWith('（')) ? undefined : 'normal',
                }}
                style={{ marginTop: idx === 0 ? 0 : 0 }}
              >
                {seg.lines.map((line, li) => {
                  const isAction = line.startsWith('（') && line.endsWith('）');
                  const isBossLine = line.startsWith('「') && line.endsWith('」');
                  return (
                    <div
                      key={li}
                      style={{
                        color: isAction ? '#a09078' : isBossLine ? '#e8d5b8' : '#c8b898',
                        fontSize: isAction ? 13 : isBossLine ? 15 : 14,
                        fontStyle: isAction ? 'italic' : 'normal',
                        marginTop: line === '' ? 8 : 0,
                        marginBottom: line === '' ? 4 : 0,
                      }}
                    >
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </GlassPanel>
            </div>
          ))}

          {/* 当前段落提示（如果还有未展示的内容） */}
          {!isLastSegment && (
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <GlimmerButton tone="primary" onClick={handleContinue}>
                繼續聆聽
              </GlimmerButton>
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                老闆還想說點什麼……
              </div>
            </div>
          )}

          {/* 全部展示完毕，引导进入城市 */}
          {isLastSegment && (
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 4 }}>
                老闆放下杯子，不再說話。酒館裡只剩下雨聲。
              </div>
              <GlimmerButton tone="primary" onClick={handleContinue}>
                帶著提燈，進入城市
              </GlimmerButton>
            </div>
          )}
        </div>
      </div>

      {/* 情绪词典解锁提示弹窗 */}
      {showDictionaryModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            maxWidth: 560,
            width: '100%',
            animation: 'tavern-fade-in 0.6s ease-out',
          }}>
            <GlassPanel
              title="情緒詞典 · 已解鎖"
              subtitle="Emotion Dictionary Unlocked"
              variant="warm"
              contentStyle={{
                color: '#d9c4a6',
                lineHeight: 1.9,
                fontSize: 14,
                padding: '24px 28px',
              }}
            >
              <div style={{ color: '#f4efe7', fontSize: 16, marginBottom: 16, fontWeight: 600 }}>
                一本空白的舊書正在你的背包裡微微發光。
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: '0 0 8px' }}>
                  情緒詞典會隨著你見證 NPC 的故事而自動書寫。每條記錄包含：
                </p>
                <ul style={{ margin: '8px 0', paddingLeft: 20, color: '#c8b898', lineHeight: 2 }}>
                  <li><strong style={{ color: '#e8d5b8' }}>情緒名稱</strong> — 你從他們身上讀懂的情感</li>
                  <li><strong style={{ color: '#e8d5b8' }}>感官描述</strong> — 情緒在身體與環境中的具象痕跡</li>
                  <li><strong style={{ color: '#e8d5b8' }}>NPC 最後告白</strong> — 他們在治癒後說出的心聲</li>
                  <li><strong style={{ color: '#e8d5b8' }}>玩家註記</strong> — 你留下的個人感悟</li>
                  <li><strong style={{ color: '#e8d5b8' }}>公益小卡</strong> — 現實心理學的專業提醒</li>
                </ul>
              </div>

              <div style={{
                padding: '14px 16px',
                borderRadius: 8,
                background: 'rgba(214,163,94,0.1)',
                border: '1px solid rgba(214,163,94,0.15)',
                color: '#d0a050',
                fontSize: 13,
                marginBottom: 20,
              }}>
                <strong>提示：</strong>面對新 NPC 時翻閱詞典，可能獲得新的對話選項。每解鎖五個詞條，詞典會給予簡短評語。
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <GlimmerButton tone="primary" onClick={handleEnterCity}>
                  帶著提燈，進入城市
                </GlimmerButton>
                <GlimmerButton onClick={() => {
                  setShowDictionaryModal(false);
                  onOpenDictionary();
                }}>
                  翻開詞典看看
                </GlimmerButton>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}


    </GuiFrame>
  );
}
