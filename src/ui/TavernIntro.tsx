import { useState, useCallback, useMemo } from 'react';
import { GlimmerButton, GlassPanel } from '../components';

// ── 全屏图片 imports ──
import wipingGlassImg from '../../images/gameOpenDislogue/wipingGlass.png';
import serveDrinkImg from '../../images/gameOpenDislogue/serveDrink.png';
import lookUpImg from '../../images/gameOpenDislogue/lookUp.png';
import giveDictionaryImg from '../../images/gameOpenDislogue/giveDictionary.png';
import lookSeriousImg from '../../images/gameOpenDislogue/lookSerious.png';

type TavernIntroProps = {
  onEnterCity: () => void;
  onOpenDictionary: () => void;
};

/* ─────── 七张全屏图片 slot ─────── */
type ImageSlot =
  | 'wiping_glass'    // 1. 老板擦杯子
  | 'serve_drink'     // 2. 老板递饮品
  | 'look_up'         // 3. 老板抬头看玩家
  | 'wipe_again'      // 4. 老板继续擦杯子（段2 & 段4复用 → wipingGlass）
  | 'give_dictionary' // 5. 老板给情绪词典
  | 'look_serious';   // 6. 老板抬头认真看玩家

/* ─────── 每句对白可携带一张背景图，不携带则沿用上一张 ─────── */
type Beat = {
  text: string;
  image?: { slot: ImageSlot; hint: string };
};

/** slot → 实际图片 URL */
const IMAGE_SRC: Record<ImageSlot, string> = {
  wiping_glass:    wipingGlassImg,
  serve_drink:     serveDrinkImg,
  look_up:         lookUpImg,
  wipe_again:      wipingGlassImg,   // 复用擦杯子图
  give_dictionary: giveDictionaryImg,
  look_serious:    lookSeriousImg,
};

/** 全部对白 — 打平为单条 beat 序列，图片只在 action 句出现时切换 */
const BEATS: Beat[] = [
  // ═══ 段1：擦杯子 ═══
  { text: '老闆頭也不抬，繼續擦著杯子，聲音不輕不重。', image: { slot: 'wiping_glass', hint: '老板擦杯子' } },
  { text: '「外面還在下吧？坐。這城市哪都濕漉漉的，就這裡還能把衣服晾乾。」' },
  // ★ 新增图片
  { text: '他推過來一杯溫熱的飲品，不是酒，是某種草藥茶。', image: { slot: 'serve_drink', hint: '老板递饮品' } },
  { text: '「第一次來微光城市的人，總是先聞到鐵鏽味。習慣了就好。或者說，習慣不了也沒關係。」' },

  // ═══ 段2：抬头看 ═══
  { text: '他終於抬頭看你一眼，眼袋很深，但目光意外地柔和。', image: { slot: 'look_up', hint: '老板抬头看玩家' } },
  { text: '「你這雙眼睛我看過。不是來躲雨的，是來聽別人下雨的。」' },
  { text: '「你是修復師對吧？能聽見雨聲裡那些……不太對勁的東西。」' },
  // ★ 新增图片
  { text: '他低頭繼續擦杯子。', image: { slot: 'wipe_again', hint: '老板继续擦杯子' } },
  { text: '「這城裡有很多人，心裡在下一場停不下來的雨。你能幫他們。或者至少……陪他們淋一會兒。」' },

  // ═══ 段3：给词典 ═══
  { text: '他指向窗外模糊的街燈。', image: { slot: 'give_dictionary', hint: '老板给情绪词典' } },
  { text: '「街上那些發光的小東西，不是垃圾。是他們丟掉的自己。碰一下，你就能聽懂一點他們的雨聲。」' },
  { text: '他從吧檯下面摸出一本舊書，封面被磨得發白，推到你面前。' },
  { text: '「給你。現在裡面什麼都沒有。別急著寫，它自己會知道什麼時候該寫什麼。我也沒搞懂原理，反正……你先帶著。」' },
  { text: '他輕輕敲了敲吧檯上那本舊書。' },
  { text: '「這本詞典，本來空白的。你每聽懂一個人，它就會多寫一行。不是我給你寫，是它自己。」' },
  { text: '「有些人會讓你進去——不是進他家門，是進他心裡。裡面不一定好看，但你是修復師，你應該知道。」' },
  { text: '停頓。雨聲很大。' },
  { text: '「哦對了。如果弄砸了，那個人的影子會留在雨裡。不是鬼，更像是……你心裡的回音。別怕，每一個修復師都得學會跟這種回音相處。」' },

  // ═══ 段4：认真看 ═══
  { text: '他放下杯子，第一次認真地看你。', image: { slot: 'look_serious', hint: '老板抬头认真看玩家' } },
  { text: '「你記住一件事。你不是來讓別人不痛的。痛是那些人在這個世界裡最後一件屬於自己的東西。你是來讓他們知道——」' },
  { text: '他的聲音變得更輕。' },
  { text: '「——痛著也沒關係。」' },
  // ★ 新增图片
  { text: '然後他又開始擦杯子了，好像剛才什麼都沒說。', image: { slot: 'wipe_again', hint: '老板继续擦杯子' } },
  { text: '「能找到那個報攤也算你有本事。沒被雨泡爛之前，那裡賣過地圖。現在嘛……地圖沒用了，路得你自己在雨裡摸。」' },
];

/* ─────── 全屏图片 ─────── */
function FullscreenImage({ slot }: { slot: ImageSlot }) {
  return (
    <div
      data-image-slot={slot}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: '#080504',
      }}
    >
      <img
        src={IMAGE_SRC[slot]}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
}

/* ─────── 对话覆盖层（占画面下 ~1/3） ─────── */
function DialogueOverlay({ beat, onNext }: { beat: Beat; onNext: () => void }) {
  const isBossLine = beat.text.startsWith('「') && beat.text.endsWith('」');
  const isAction = !isBossLine;

  return (
    <div
      onClick={onNext}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 28%, transparent 55%)',
      }}
    >
      <div
        style={{
          padding: '6vh 8vw 8vh',
          animation: 'tavern-fade-in 0.45s ease-out',
          maxWidth: 860,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            color: isAction ? '#a09078' : '#e8d5b8',
            fontSize: isAction ? 15 : 20,
            fontStyle: isAction ? 'italic' : 'normal',
            lineHeight: 1.75,
            letterSpacing: isBossLine ? 0.5 : 0,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          {beat.text}
        </div>

        <div
          style={{
            marginTop: 28,
            color: 'rgba(255,255,255,0.3)',
            fontSize: 12,
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(214,163,94,0.5)',
              animation: 'tavern-blink 1.4s ease-in-out infinite',
            }}
          />
          點擊繼續
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ */

export default function TavernIntro({ onEnterCity, onOpenDictionary }: TavernIntroProps) {
  const [idx, setIdx] = useState(0);
  const [showDict, setShowDict] = useState(false);

  // 当前有效图片 slot：向前扫描最近的 beat 里带 image 的
  const currentSlot = useMemo<ImageSlot>(() => {
    for (let i = idx; i >= 0; i--) {
      if (BEATS[i].image) return BEATS[i].image!.slot;
    }
    return 'wiping_glass'; // fallback
  }, [idx]);

  const current = BEATS[idx];

  const handleNext = useCallback(() => {
    if (idx < BEATS.length - 1) {
      setIdx(prev => prev + 1);
    } else {
      setShowDict(true);
    }
  }, [idx]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ([' ', 'Enter', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (!showDict) handleNext();
      }
    },
    [handleNext, showDict],
  );

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#080504',
        outline: 'none',
      }}
    >
      <style>{`
        @keyframes tavern-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tavern-blink {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* 全屏图片 */}
      <FullscreenImage slot={currentSlot} />

      {/* 对话覆盖层 */}
      <DialogueOverlay beat={current} onNext={handleNext} />

      {/* 情绪词典解锁弹窗 */}
      {showDict && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            style={{
              maxWidth: 560,
              width: '100%',
              animation: 'tavern-fade-in 0.5s ease-out',
              margin: '0 24px',
            }}
          >
            <GlassPanel
              title="情緒詞典 · 已解鎖"
              subtitle="Emotion Dictionary Unlocked"
              variant="warm"
              contentStyle={{
                color: '#d9c4a6',
                lineHeight: 1.85,
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

              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 8,
                  background: 'rgba(214,163,94,0.1)',
                  border: '1px solid rgba(214,163,94,0.15)',
                  color: '#d0a050',
                  fontSize: 13,
                  marginBottom: 20,
                }}
              >
                <strong>提示：</strong>面對新 NPC 時翻閱詞典，可能獲得新的對話選項。每解鎖五個詞條，詞典會給予簡短評語。
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <GlimmerButton tone="primary" onClick={onEnterCity}>
                  帶著提燈，進入城市
                </GlimmerButton>
                <GlimmerButton
                  onClick={() => {
                    setShowDict(false);
                    onOpenDictionary();
                  }}
                >
                  翻開詞典看看
                </GlimmerButton>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}
    </div>
  );
}
