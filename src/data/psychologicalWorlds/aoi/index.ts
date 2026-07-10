// ============================================================
// 小葵心理世界 — 四層情感弧線
// 原生家庭 → 創傷事件 → 冰封狀態 → 療癒接納
// 依據 npc/aoi.md 的 ## 心理世界 建立
// ============================================================

import type { PsychLayerData, PsychLayerId } from '../bridgePainter/index';

export type AoiPsychLayerId =
  | 'broken_home'
  | 'dance_recital_disaster'
  | 'silent_swing'
  | 'washed_red_shoes';

// ---- 第一層：經常吵架和冷戰的家 ----

const layer1: PsychLayerData = {
  layerId: 'broken_home',
  layerNumber: 1,
  layerName: '經常吵架和冷戰的家',
  symbol: '破碎的全家福',
  atmosphere: '牆上的全家福與冷戰的客廳形成鮮明對比，安靜得讓人喘不過氣',
  sceneDescription:
    '這是小葵認為很漂亮的家。\n'
    + '客廳裡，沙發上放著她喜歡的玩偶，牆上掛著一家三口幸福的照片。\n'
    + '可是家裡空無一人。父母剛才吵架後離開，沒有理會她。\n'
    + '小葵坐在沙發角落，看著門，又看著牆上的全家福。',
  emotionalForeword: '這是小葵每天生活的背景。她學會了根據腳步聲和關門力道調整呼吸。',
  playerUnderstanding:
    '她的原生家庭充斥著冷戰與爭吵。她必須維持表面的平靜，並把父母的情緒當成自己的責任。',
  interactables: [
    {
      id: 'broken_bear_doll',
      name: '破損的玩偶',
      category: 'comfort',
      surfaceInfo:
        '沙發上放著一隻小熊玩偶。耳朵被撕裂，縫線鬆散，但仍被擺在沙發最顯眼的位置。',
      deepMessage:
        '你注意到玩偶的肚子還留著一點棉花，像從來沒有人幫它縫好。\n\n'
        + '小葵常常抱著它，假裝有人能聽她說話。玩偶破損，卻還在這裡——\n'
        + '就像她努力維持的「完整的家」。',
      insight: '玩偶的破損象徵她努力維持完整的家，卻始終破碎的心境。',
      reflectionChoices: [
        { text: '陪伴', insight: false },
        { text: '碎片', insight: true },
        { text: '安靜', insight: false },
        { text: '丟棄', insight: false },
      ],
      understandingReward: 8,
    },
    {
      id: 'family_photo',
      name: '全家福照片',
      category: 'memory',
      surfaceInfo: '牆上掛著一張照片：爸爸、媽媽和小葵，三個人都笑得很開心。',
      deepMessage:
        '照片裡的笑容是真的。但照片不會說話，也不會吵架。\n'
        + '小葵有時會盯著照片很久，好像在確認那個曾經存在過。',
      insight: '家庭照片記錄的是快樂的瞬間，但瞬間不能代替日常。',
      reflectionChoices: [
        { text: '凝固', insight: false },
        { text: '碎片', insight: true },
        { text: '鏡像', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 8,
    },
    {
      id: 'corner_aoi',
      name: '角落的小葵',
      category: 'self',
      surfaceInfo: '沙發角落縮著一個小女孩。她沒有看照片，也沒有看門，只是抱著玩偶，盯著自己的手指。',
      deepMessage:
        '她的身體縮得很小，像是在試圖讓自己消失。\n'
        + '每次父母的聲音提高一點，她的肩膀就會抖一下。',
      insight: '她不是不想說話，是怕說錯話會讓事情更糟。',
      reflectionChoices: [
        { text: '消失', insight: false },
        { text: '重量', insight: true },
        { text: '影子', insight: false },
        { text: '回聲', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'arguing_parents',
      name: '爭吵的父母',
      category: 'family',
      surfaceInfo: '父母的剪影在門邊搖晃。他們的聲音被壓低，但憤怒穿透了牆壁。',
      deepMessage:
        '他們不是壞人。只是兩個人在一起時，會變成另一種樣子。\n'
        + '小葵知道這一點，所以她從不選邊站。',
      insight: '父母的爭吵不是小葵的錯，但小葵把它當成了自己的責任。',
      reflectionChoices: [
        { text: '邊界', insight: true },
        { text: '碎片', insight: false },
        { text: '回聲', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 7,
    },
    {
      id: 'voice_recorder',
      name: '錄音筆',
      category: 'fear',
      surfaceInfo: '一支錄音筆放在茶几中下方。它靜靜地躺著，像一個不願被打開的護身符。',
      deepMessage:
        '小葵在父母吵架時常把錄音筆放在口袋裡。\n'
        + '她錄下爭吵，反覆聆聽，想從中找到讓他們和好的方法。\n'
        + '但錄音裡永遠只有憤怒，沒有答案。',
      insight: '錄音筆象徵小葵對「家」的依賴，以及她對「家」的恐懼。',
      reflectionChoices: [
        { text: '回聲', insight: true },
        { text: '重量', insight: false },
        { text: '形狀', insight: false },
        { text: '循環', insight: false },
      ],
      understandingReward: 10,
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
  maxUnderstanding: 43,
};

// ---- 第二層：舞蹈表演的爭吵 ----

const layer2: PsychLayerData = {
  layerId: 'dance_recital_disaster',
  layerNumber: 2,
  layerName: '舞蹈表演的爭吵',
  symbol: '紅舞鞋',
  atmosphere: '舞台的聚光燈下，父母的爭吵像一道裂縫撕裂了所有的期待',
  sceneDescription:
    '在她有份表演的舞蹈會上，父母因為一些事情激烈爭吵，甚至打起來。\n'
    + '同時，在舞台表演中的她看到了這一幕。她的舞步開始脫節，從此再也沒有去舞蹈班上課。',
  emotionalForeword: '這是小葵創傷的核心事件。快樂變成了罪惡，跳舞變成了導火線。',
  playerUnderstanding:
    '小葵放棄了最愛的舞蹈，因為快樂會引發爭吵。她的壓力來源不是舞台，而是被成人衝突摧毀的重要時刻。',
  interactables: [
    {
      id: 'stage_spotlight',
      name: '舞台聚光燈',
      category: 'performance',
      surfaceInfo: '一束強光打在舞台中央。光很亮，亮到讓人看不見觀眾席。',
      deepMessage:
        '小葵曾經喜歡這束光。它讓她覺得自己是主角。\n'
        + '但現在，這束光只讓她覺得自己被暴露在所有爭吵面前。',
      insight: '舞台的光既是榮耀也是審判。',
      reflectionChoices: [
        { text: '光', insight: true },
        { text: '重量', insight: false },
        { text: '形狀', insight: false },
        { text: '邊界', insight: false },
      ],
      understandingReward: 8,
    },
    {
      id: 'audience_seats',
      name: '觀眾席',
      category: 'witness',
      surfaceInfo: '觀眾席上有很多人。他們本來應該在看跳舞。',
      deepMessage:
        '觀眾席中有些人轉過頭，看向爭吵的聲音。\n'
        + '小葵看到了他們的表情——困惑、同情、甚至不耐煩。\n'
        + '她知道，從這一刻開始，「跳舞」和「丟臉」會永遠連在一起。',
      insight: '在所有人面前發生的爭吵，讓羞恥感變成了公共的。',
      reflectionChoices: [
        { text: '邊界', insight: true },
        { text: '碎片', insight: false },
        { text: '回聲', insight: false },
        { text: '光', insight: false },
      ],
      understandingReward: 7,
    },
    {
      id: 'parents_arguing_silhouette',
      name: '爭吵的父母剪影',
      category: 'trauma',
      surfaceInfo: '觀眾席中，兩個人站了起來。他們的剪影在舞台燈光下被拉得很長。',
      deepMessage:
        '他們為什麼要在這裡吵架？這是我的舞蹈表演。這是我的一天。\n'
        + '小葵沒有說出口。她只是繼續跳，但舞步已經亂了。',
      insight: '孩子的重要時刻，被成人的衝突徹底摧毀。',
      reflectionChoices: [
        { text: '碎片', insight: true },
        { text: '形狀', insight: false },
        { text: '光', insight: false },
        { text: '回聲', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'faltering_dance_steps',
      name: '脫節的舞步',
      category: 'performance',
      surfaceInfo: '舞步記號在地板上，但有些地方亂了。像是一支沒有完成的曲子。',
      deepMessage:
        '小葵的腳還記得動作，但心已經跑掉了。\n'
        + '她一直在想：他們在吵什麼？是我跳錯了嗎？還是我不應該跳舞？',
      insight: '當創傷在重要時刻發生，那個時刻會被永遠污染。',
      reflectionChoices: [
        { text: '痕跡', insight: true },
        { text: '形狀', insight: false },
        { text: '回聲', insight: false },
        { text: '光', insight: false },
      ],
      understandingReward: 9,
    },
    {
      id: 'red_dance_shoes_scene',
      name: '紅舞鞋',
      category: 'loss',
      surfaceInfo: '一雙紅色的舞鞋被丟在舞台角落。鞋帶鬆開，像一雙被遺棄的手。',
      deepMessage:
        '小葵再也沒有穿過這雙鞋。她把它藏在衣櫃最裡面，以為看不見就不會難過。\n'
        + '但偶爾打開衣櫃，紅色還是會跳出來。',
      insight: '放棄的不是舞鞋，是允許自己快樂的權利。',
      reflectionChoices: [
        { text: '顏色', insight: true },
        { text: '重量', insight: false },
        { text: '消失', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 10,
    },
  ],
  nextLayerThreshold: 35,
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

// ---- 第三層：鞦韆上的靜止 ----

const layer3: PsychLayerData = {
  layerId: 'silent_swing',
  layerNumber: 3,
  layerName: '鞦韆上的靜止',
  symbol: '靜止的鞦韆',
  atmosphere: '沒有大人，沒有爭吵聲，只有安靜。但小葵不坐上鞦韆。',
  sceneDescription:
    '小葵坐在公園的鞦韆上，一動不動，眼睛緊盯著入口。\n'
    + '每當有成人經過，她的身體就會微微緊繃。她已經把紅舞鞋丟在公園裡，但錄音筆仍帶在身邊。',
  emotionalForeword: '她逃到了一個沒有爭吵的地方，卻發現自己不知道該做什麼。快樂——這種東西，她還被允許擁有嗎？',
  playerUnderstanding:
    '問題不是父母不合，而是她將整個家庭的情感平衡當成了自己的責任。\n'
    + '她只是一個孩子——但這個簡單的事實，她還沒有學會相信。',
  interactables: [
    {
      id: 'static_swing',
      name: '靜止的鞦韆',
      category: 'acceptance',
      surfaceInfo: '一架鞦韆靜止不動。鏈條上沒有使用痕跡。',
      deepMessage:
        '小葵站在鞦韆旁邊，但沒有坐上去。\n'
        + '她已經忘記了鞦韆是來玩的。她只記得，如果她太快樂，家裡就會出事。',
      insight: '鞦韆不只是玩具，是「允許自己無所事事」的象徵。',
      reflectionChoices: [
        { text: '靜止', insight: true },
        { text: '重量', insight: false },
        { text: '形狀', insight: false },
        { text: '光', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'school_bag',
      name: '書包',
      category: 'mask',
      surfaceInfo: '一個小書包放在鞦韆旁邊。裡面有課本和一本圖畫書。',
      deepMessage:
        '書包是小葵的「正常」偽裝。她會準時上學、準時寫功課、準時回家。\n'
        + '沒有人知道她在公園裡坐多久。',
      insight: '孩子用「正常」來保護自己，但正常不等於沒事。',
      reflectionChoices: [
        { text: '重量', insight: true },
        { text: '形狀', insight: false },
        { text: '碎片', insight: false },
        { text: '光', insight: false },
      ],
      understandingReward: 7,
    },
    {
      id: 'muddy_shoes',
      name: '沾滿泥土的紅舞鞋',
      category: 'loss',
      surfaceInfo: '一雙紅舞鞋被丟在草叢裡，鞋面上沾滿乾掉的泥土。',
      deepMessage:
        '小葵把舞鞋帶到公園，然後丟掉了。她以為這樣就不會再難過。\n'
        + '但現在她站在鞦韆旁邊，看著那雙鞋，不知道該不該撿回來。',
      insight: '放棄快樂不能阻止爭吵。它只是讓孩子變得更孤單。',
      reflectionChoices: [
        { text: '顏色', insight: true },
        { text: '泥土', insight: false },
        { text: '碎片', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'recording_pen_scene',
      name: '錄音筆',
      category: 'fear',
      surfaceInfo: '一支錄音筆躺在鞦韆座椅上。裡面有聲音，但小葵沒有按下播放鍵。',
      deepMessage:
        '小葵已經不需要再聽了。她知道爭吵的內容永遠不會改變。\n'
        + '她只是把錄音筆帶在身上，像一個她不願意打開的護身符。',
      insight: '反覆聆聽創傷，是一種試圖控制不可控之物的掙扎。',
      reflectionChoices: [
        { text: '回聲', insight: true },
        { text: '重量', insight: false },
        { text: '形狀', insight: false },
        { text: '循環', insight: false },
      ],
      understandingReward: 10,
    },
  ],
  nextLayerThreshold: 30,
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

// ---- 第四層：小葵的紅色鞋子 ----

const layer4: PsychLayerData = {
  layerId: 'washed_red_shoes',
  layerNumber: 4,
  layerName: '小葵的紅色鞋子',
  symbol: '洗淨的紅舞鞋',
  atmosphere:
    '公園的角落，沾滿泥土的紅舞鞋被洗淨了，靜靜放在鞦韆旁。鞋帶上繫著一個小小的鈴鐺，風吹過時發出輕響。',
  sceneDescription:
    '小葵蹲在公園的草叢邊，用濕紙巾一點一點地擦去紅舞鞋上的泥土。\n'
    + '這雙鞋已經在這裡躺了很久——她每天經過，不敢碰，甚至不敢看。\n'
    + '但今天，她把它撿了起來。她不再想著父母會不會吵架——她只是專注地、一下一下地，把紅色擦回來。',
  emotionalForeword:
    '撿起那雙鞋，不是為了跳舞——是為了告訴自己：你可以擁有快樂，不需要任何人的許可。',
  playerUnderstanding:
    '小葵終於明白：父母的爭吵不是她的錯，維持家庭和平也不是她的責任。\n'
    + '她穿上紅舞鞋，不是為了表演給誰看——只是因為她想穿。\n'
    + '她依然是一個孩子，有權讓紅色發光，有權讓鈴鐺發出聲音。',
  interactables: [
    {
      id: 'washed_red_shoes',
      name: '洗淨的紅舞鞋',
      category: 'acceptance',
      surfaceInfo:
        '一雙紅舞鞋被洗得乾乾淨淨，放在長椅上。鞋面上的泥土不見了，紅色重新亮了起來。鞋尖朝外，像終於準備好要出發。',
      deepMessage:
        '小葵花了很久才敢再碰這雙鞋。她以為紅色會燙手——會讓她想起舞台上的聚光燈、觀眾席的爭吵聲、自己亂掉的舞步。\n\n'
        + '但真正摸上去的時候，它軟軟的、安靜的，像一個等了很久的朋友。\n'
        + '她把它抱在懷裡，坐了很久。然後她開始擦——一下，一下，像在擦掉那些不好的記憶，把原本的紅色找回來。',
      insight: '紅色不再代表那天的羞恥。它只是她曾經喜歡的顏色——她決定重新喜歡它。',
      reflectionChoices: [
        { text: '顏色', insight: true },
        { text: '泥土', insight: false },
        { text: '等待', insight: false },
        { text: '重量', insight: false },
      ],
      understandingReward: 12,
    },
    {
      id: 'little_bell',
      name: '鞋帶上的鈴鐺',
      category: 'freedom',
      surfaceInfo:
        '鞋帶上繫著一個小小的銀色鈴鐺，在微風中輕輕搖晃，發出清脆的叮噹聲。',
      deepMessage:
        '鈴鐺是小葵自己繫上去的。不是因為好看，而是因為她想要聽見自己存在的聲音。\n\n'
        + '以前在家裡，她總是盡量不發出任何聲音——腳步要輕、呼吸要慢、說話要小到幾乎聽不見。她怕自己的聲音會讓已經很亂的家變得更糟。\n\n'
        + '但今天，她想要這個聲音。風吹過來，鈴鐺響了——輕輕的、確定的，像在說：「我在這裡。」',
      insight: '發出聲音不是罪過。她的存在，不需要保持沉默。',
      reflectionChoices: [
        { text: '聲音', insight: true },
        { text: '裝飾', insight: false },
        { text: '鈴鐺', insight: false },
        { text: '風', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'silent_recorder',
      name: '不再播放的錄音筆',
      category: 'echo',
      surfaceInfo:
        '一支錄音筆放在長椅上，螢幕是暗的。旁邊放著一顆新的電池，沒有被裝進去。',
      deepMessage:
        '小葵不再需要它了。以前她反覆播放那些爭吵，想從中找到解決的方法。\n\n'
        + '但現在她知道——那些聲音不是她的責任。不是她的錯。\n'
        + '錄音筆可以只是錄音筆，不是護身符。\n'
        + '她把新電池放在旁邊，沒有裝進去。也許有一天她會用這支筆錄下別的東西——比如公園的風，比如鈴鐺的聲音。\n'
        + '但今天，她只想讓它休息。',
      insight: '放下錄音筆，就是放下「我需要解決父母的問題」這個重擔。',
      reflectionChoices: [
        { text: '沉默', insight: true },
        { text: '休息', insight: false },
        { text: '電池', insight: false },
        { text: '回聲', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'moving_swing',
      name: '輕輕搖晃的鞦韆',
      category: 'echo',
      surfaceInfo:
        '公園的鞦韆在輕輕搖晃。鏈條上現在有使用的痕跡——一雙小手握過的地方，鐵鏽被蹭掉了一點。',
      deepMessage:
        '小葵終於坐上去了。不是因為有人叫她坐，也不是因為她需要假裝快樂——只是因為風吹得很舒服，而她想要盪一下。\n\n'
        + '鞦韆往上飛的時候，她聽見鞋帶上的鈴鐺在響。往下落的時候，她閉上了眼睛。\n'
        + '這裡沒有觀眾，沒有人吵架，只有一個小女孩，和一雙洗得很乾淨的紅鞋。',
      insight: '鞦韆不再是她用來等待的地方。現在，它只是鞦韆。',
      reflectionChoices: [
        { text: '靜止', insight: false },
        { text: '自由', insight: true },
        { text: '盪', insight: false },
        { text: '風', insight: false },
      ],
      understandingReward: 10,
    },
  ],
  nextLayerThreshold: 0,
  colorScheme: {
    bg: '#2d2322',
    text: '#f0e0d8',
    accent: '#e07b6a',
    dim: 'rgba(224, 123, 106, 0.15)',
    sub: '#c0a098',
    cellEmpty: 'rgba(224, 123, 106, 0.12)',
    cellNorm: 'rgba(224, 123, 106, 0.08)',
    cellDisc: 'rgba(224, 123, 106, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(224,123,106,0.16), rgba(160,80,65,0.1))',
    border: 'rgba(224,123,106,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(45,35,34,0.5), rgba(20,14,13,0.85))',
  },
  maxUnderstanding: 42,
};

export const aoiPsychLayers: PsychLayerData[] = [layer1, layer2, layer3, layer4];
