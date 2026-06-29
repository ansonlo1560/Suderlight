// ============================================================
// 小葵心理世界定義 — 骨架
// 三層結構：原生家庭 → 創傷事件 → 核心自我/接納
// ============================================================

import type { PsychLayerData, PsychLayerId } from '../bridgePainter/index';

export type AoiPsychLayerId =
  | 'broken_home'
  | 'dance_recital_disaster'
  | 'silent_swing';

// ---- 第一層：原生家庭 ----

const layer1: PsychLayerData = {
  layerId: 'broken_home',
  layerNumber: 1,
  layerName: '經常吵架的單位',
  symbol: '🏠',
  atmosphere: '牆上的全家福照片與冷戰的餐桌形成鮮明對比',
  sceneDescription: '一個普通的家庭單位。牆上掛著一家三口幸福的照片，但客廳裡彌漫著無聲的緊張。小葵坐在角落，看著父母，再看著牆上的照片。',
  emotionalForeword: '這是小葵每天生活的背景。她學會了根據腳步聲和關門力道調整呼吸。',
  playerUnderstanding: '她的原生家庭。父母不斷冷戰和吵架，但她必須維持表面的平靜。',
  interactables: [
    {
      id: 'family_photo',
      name: '全家福照片',
      icon: '🖼️',
      pos: { x: 0.5, y: 0.34 },
      understandingReward: 8,
      surfaceInfo: '牆上掛著一張照片：爸爸、媽媽和小葵，三個人都笑得很開心。',
      deepMessage: '照片裡的笑容是真的。但照片不會說話，也不會吵架。小葵有時會盯著照片很久，好像在確認那個曾經存在過。',
      insight: '家庭照片記錄的是快樂的瞬間，但瞬間不能代替日常。',
      reflectionChoices: [
        { text: '這個家曾經也有過快樂的時候。', insight: false },
        { text: '照片裡的笑容，和現在的沉默，都是真的。', insight: true },
      ],
    },
    {
      id: 'corner_aoi',
      name: '角落的小葵',
      icon: '👧',
      pos: { x: 0.14, y: 0.58 },
      understandingReward: 10,
      surfaceInfo: '一個小女孩坐在角落，緊抱著膝蓋，眼睛來回看著父母。',
      deepMessage: '她的身體縮得很小，像是在試圖讓自己消失。每當父母的聲音提高一點，她的肩膀就會抖一下。',
      insight: '她不是不想說話，是怕說錯話會讓事情更糟。',
      reflectionChoices: [
        { text: '她不需要消失。她在這裡，就已經夠了。', insight: true },
        { text: '角落是一個暫時安全的地方。', insight: false },
      ],
    },
    {
      id: 'arguing_parents',
      name: '爭吵的父母',
      icon: '💢',
      pos: { x: 0.86, y: 0.18 },
      understandingReward: 7,
      surfaceInfo: '父母的剪影在燈光下搖晃。他們的聲音被壓低，但憤怒穿透了牆壁。',
      deepMessage: '他們不是壞人。只是兩個人在一起時，會變成另一種樣子。小葵知道這一點，所以她從不選邊站。',
      insight: '父母的爭吵不是小葵的錯，但小葵把它當成了自己的責任。',
      reflectionChoices: [
        { text: '他們的爭吵，不是因為你不夠好。', insight: false },
        { text: '兩個大人的問題，不應該由孩子來承擔。', insight: true },
      ],
    },
    {
      id: 'slammed_door',
      name: '摔門聲',
      icon: '🚪',
      pos: { x: 0.22, y: 0.82 },
      understandingReward: 7,
      surfaceInfo: '一聲巨響。門被用力關上，牆上的照片微微晃動。',
      deepMessage: '那聲音像是一個句號。每次摔門之後，家裡就會安靜很久。小葵會數自己的呼吸，直到數到一百，確認不會再有聲音。',
      insight: '摔門聲是結束，但也是下一場緊張的開始。',
      reflectionChoices: [
        { text: '那個聲音很嚇人。但你可以不用數呼吸了。', insight: true },
        { text: '門關上了，但這不代表世界結束了。', insight: false },
      ],
    },
    {
      id: 'cold_dinner_table',
      name: '冷戰的餐桌',
      icon: '🍽️',
      pos: { x: 0.82, y: 0.82 },
      understandingReward: 8,
      surfaceInfo: '餐桌上有三副碗筷。沒有人動筷子。空氣像凝固的油脂。',
      deepMessage: '小葵曾經試過說學校的事來打破沉默。但爸爸和媽媽都只是點頭，然後繼續吃飯。現在她不再試了。',
      insight: '一個孩子試過用分享來修復家庭，但發現自己做不到。',
      reflectionChoices: [
        { text: '你試過了。這已經很勇敢了。', insight: true },
        { text: '沉默的餐桌不是你的錯。', insight: false },
      ],
    },
  ],
  nextLayerThreshold: 30,
  colorScheme: {
    bg: '#2a2520',
    text: '#e8e0d5',
    accent: '#c9a96e',
    dim: 'rgba(200, 180, 160, 0.15)',
    sub: '#a09080',
    cellEmpty: 'rgba(200, 180, 160, 0.12)',
    cellNorm: 'rgba(200, 180, 160, 0.08)',
    cellDisc: 'rgba(200, 180, 160, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(201,169,110,0.16), rgba(140,110,60,0.1))',
    border: 'rgba(201,169,110,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(42,37,32,0.5), rgba(20,18,15,0.85))',
  },
  maxUnderstanding: 40,
};

// ---- 第二層：舞蹈發表會的爭吵 ----

const layer2: PsychLayerData = {
  layerId: 'dance_recital_disaster',
  layerNumber: 2,
  layerName: '舞蹈表演的爭吵',
  symbol: '👗',
  atmosphere: '舞台的聚光燈下，父母的爭吵像一道裂縫撕裂了所有的期待',
  sceneDescription: '這是一個舞蹈發表會。小葵穿著紅舞鞋站在舞台上，但觀眾席中傳來了父母的爭吵聲。她的舞步開始脫節，從此再也沒有去舞蹈班上課。',
  emotionalForeword: '這是小葵創傷的核心事件。快樂變成了罪惡，跳舞變成了導火線。',
  playerUnderstanding: '小葵的壓力來源。她放棄了最愛的舞蹈，因為快樂會引發爭吵。',
  interactables: [
    {
      id: 'stage_spotlight',
      name: '舞台聚光燈',
      icon: '🔦',
      pos: { x: 0.22, y: 0.35 },
      understandingReward: 8,
      surfaceInfo: '一束強光打在舞台中央。光很亮，亮到讓人看不見觀眾席。',
      deepMessage: '小葵曾經喜歡這束光。它讓她覺得自己是主角。但現在，這束光只讓她覺得自己被暴露在所有爭吵面前。',
      insight: '舞台的光既是榮耀也是審判。',
      reflectionChoices: [
        { text: '那束光曾經讓你覺得被看見。', insight: false },
        { text: '你不需要為了讓光繼續亮著，而一直跳舞。', insight: true },
      ],
    },
    {
      id: 'audience_seats',
      name: '觀眾席',
      icon: '👥',
      pos: { x: 0.72, y: 0.25 },
      understandingReward: 7,
      surfaceInfo: '觀眾席上有很多人。他們本來應該在看跳舞。',
      deepMessage: '觀眾席中有些人轉過頭，看向爭吵的聲音。小葵看到了他們的表情——困惑、同情、甚至不耐煩。她知道，從這一刻開始，「跳舞」和「丟臉」會永遠連在一起。',
      insight: '在所有人面前發生的爭吵，讓羞恥感變成了公共的。',
      reflectionChoices: [
        { text: '那些觀眾看到的不是你的錯。', insight: false },
        { text: '丟臉的是爭吵，不是你的舞。', insight: true },
      ],
    },
    {
      id: 'parents_arguing_silhouette',
      name: '爭吵的父母剪影',
      icon: '💔',
      pos: { x: 0.16, y: 0.65 },
      understandingReward: 10,
      surfaceInfo: '觀眾席中，兩個人站了起來。他們的剪影在舞台燈光下被拉得很長。',
      deepMessage: '他們為什麼要在這裡吵架？這是我的發表會。這是我的一天。\n小葵沒有說出口。她只是繼續跳，但舞步已經亂了。',
      insight: '孩子的重要時刻，被成人的衝突徹底摧毀。',
      reflectionChoices: [
        { text: '這一天本來應該是屬於你的。', insight: true },
        { text: '他們的爭吵奪走了你的舞台。這不公平。', insight: false },
      ],
    },
    {
      id: 'faltering_dance_steps',
      name: '脫節的舞步',
      icon: '💃',
      pos: { x: 0.84, y: 0.72 },
      understandingReward: 9,
      surfaceInfo: '舞步記號在地板上，但有些地方亂了。像是一支沒有完成的曲子。',
      deepMessage: '小葵的腳還記得動作，但心已經跑掉了。她一直在想：他們在吵什麼？是我跳錯了嗎？還是我不應該跳舞？',
      insight: '當創傷在重要時刻發生，那個時刻會被永遠污染。',
      reflectionChoices: [
        { text: '你沒有跳錯。舞是對的，錯的是時機。', insight: false },
        { text: '你的腳還記得。心也會慢慢記回來。', insight: true },
      ],
    },
    {
      id: 'red_dance_shoes_scene',
      name: '紅舞鞋',
      icon: '👠',
      pos: { x: 0.50, y: 0.80 },
      understandingReward: 10,
      surfaceInfo: '一雙紅色的舞鞋被丟在舞台角落。鞋帶鬆開，像一雙被遺棄的手。',
      deepMessage: '小葵再也沒有穿過這雙鞋。她把它藏在衣櫃最裡面，以為看不見就不會難過。但偶爾打開衣櫃，紅色還是會跳出來。',
      insight: '放棄的不是舞鞋，是允許自己快樂的權利。',
      reflectionChoices: [
        { text: '紅色很漂亮。你不需要為了它道歉。', insight: true },
        { text: '鞋還在。想穿的時候，可以重新繫鞋帶。', insight: false },
      ],
    },
  ],
  nextLayerThreshold: 70,
  colorScheme: {
    bg: '#3a2028',
    text: '#f0e0e5',
    accent: '#e76f8b',
    dim: 'rgba(230, 150, 170, 0.15)',
    sub: '#c090a0',
    cellEmpty: 'rgba(230, 150, 170, 0.12)',
    cellNorm: 'rgba(230, 150, 170, 0.08)',
    cellDisc: 'rgba(230, 150, 170, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(231,111,139,0.16), rgba(160,70,100,0.1))',
    border: 'rgba(231,111,139,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(58,32,40,0.5), rgba(25,15,20,0.85))',
  },
  maxUnderstanding: 44,
};

// ---- 第三層：靜止的鞦韆 ----

const layer3: PsychLayerData = {
  layerId: 'silent_swing',
  layerNumber: 3,
  layerName: '靜止的鞦韆',
  symbol: '🎠',
  atmosphere: '沒有大人，沒有爭吵聲，只有安靜。但小葵不坐上鞦韆。',
  sceneDescription: '舞蹈會後，小葵回到公園，把那雙鞋子丟在公園裡人煙稀少的地方。回到那個鞦韆，那架鞦韆靜止不動，旁邊放著一個書包。沒有大人，沒有爭吵聲，很安靜，但小葵不坐上鞦韆。',
  emotionalForeword: '這是小葵的核心自我。她終於來到一個沒有爭吵的地方，但她已經忘記了如何允許自己快樂。',
  playerUnderstanding: '沾滿泥土的紅舞鞋（放棄的快樂）、錄音筆（無法逃脫的爭吵記錄） → 問題不是父母不合，而是她將整個家庭的情感平衡當成了自己的責任。透過對話理解：她只是一個孩子，有權享受沉默，有權不做任何事。',
  interactables: [
    {
      id: 'static_swing',
      name: '靜止的鞦韆',
      icon: '🎠',
      pos: { x: 0.50, y: 0.44 },
      understandingReward: 10,
      surfaceInfo: '一架鞦韆靜止不動。鏈條上沒有使用痕跡。',
      deepMessage: '小葵站在鞦韆旁邊，但沒有坐上去。她已經忘記了鞦韆是來玩的。她只記得，如果她太快樂，家裡就會出事。',
      insight: '鞦韆不只是玩具，是「允許自己無所事事」的象徵。',
      reflectionChoices: [
        { text: '你可以坐上去。不需要晃動。', insight: true },
        { text: '鞦韆不會要求你表現好。', insight: false },
      ],
    },
    {
      id: 'school_bag',
      name: '書包',
      icon: '🎒',
      pos: { x: 0.24, y: 0.22 },
      understandingReward: 7,
      surfaceInfo: '一個小書包放在鞦韆旁邊。裡面有課本和一本圖畫書。',
      deepMessage: '書包是小葵的「正常」偽裝。她會準時上學、準時寫功課、準時回家。沒有人知道她在公園裡坐多久。',
      insight: '孩子用「正常」來保護自己，但正常不等於沒事。',
      reflectionChoices: [
        { text: '書包裡的課本不是你的全部。', insight: false },
        { text: '你可以帶著書包，也可以放下它。', insight: true },
      ],
    },
    {
      id: 'muddy_shoes',
      name: '沾滿泥土的紅舞鞋',
      icon: '👠',
      pos: { x: 0.76, y: 0.22 },
      understandingReward: 10,
      surfaceInfo: '一雙紅舞鞋被丟在草叢裡，鞋面上沾滿乾掉的泥土。',
      deepMessage: '小葵把舞鞋帶到公園，然後丟掉了。她以為這樣就不會再難過。但現在她站在鞦韆旁邊，看著那雙鞋，不知道該不該撿回來。',
      insight: '放棄快樂不能阻止爭吵。它只是讓孩子變得更孤單。',
      reflectionChoices: [
        { text: '那雙鞋很漂亮。你可以把它撿回來。', insight: true },
        { text: '丟掉鞋不能讓家變好。但這不是你的錯。', insight: false },
      ],
    },
    {
      id: 'recording_pen_scene',
      name: '錄音筆',
      icon: '🎙️',
      pos: { x: 0.78, y: 0.68 },
      understandingReward: 10,
      surfaceInfo: '一支錄音筆躺在鞦韆座椅上。裡面有聲音，但小葵沒有按下播放鍵。',
      deepMessage: '小葵已經不需要再聽了。她知道爭吵的內容永遠不會改變。她只是把錄音筆帶在身上，像一個她不願意打開的護身符。',
      insight: '反覆聆聽創傷，是一種試圖控制不可控之物的掙扎。',
      reflectionChoices: [
        { text: '你不需要再聽了。你已經聽得夠多了。', insight: true },
        { text: '錄音筆可以關掉。爭吵不是你的責任。', insight: false },
      ],
    },
  ],
  nextLayerThreshold: 100,
  colorScheme: {
    bg: '#1a2a1a',
    text: '#d0e8d0',
    accent: '#7bc97b',
    dim: 'rgba(120, 200, 120, 0.15)',
    sub: '#90b890',
    cellEmpty: 'rgba(120, 200, 120, 0.12)',
    cellNorm: 'rgba(120, 200, 120, 0.08)',
    cellDisc: 'rgba(120, 200, 120, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(123,201,123,0.16), rgba(70,150,70,0.1))',
    border: 'rgba(123,201,123,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(26,42,26,0.5), rgba(12,20,12,0.85))',
  },
  maxUnderstanding: 37,
};

export const aoiPsychLayers: PsychLayerData[] = [layer1, layer2, layer3];
