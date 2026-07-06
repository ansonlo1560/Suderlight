// ============================================================
// 蕾娜 (Rena) 心理世界 — 四層情感弧線
// 歡笑劇場 → 休息室的電話 → 鏡面迷宮 → 無鏡的房間
// ============================================================

import type { PsychLayerData } from '../bridgePainter/index';

export type RenaPsychLayerId =
  | 'applause_stage'
  | 'backstage_phone'
  | 'mirror_maze'
  | 'mirrorless_room';

// ---- 第一層：歡笑劇場 (Applause Stage) ----

const layer1: PsychLayerData = {
  layerId: 'applause_stage',
  layerNumber: 1,
  layerName: '歡笑劇場',
  symbol: '舞台上的笑容',
  atmosphere: '座無虛席、掌聲如雷，但聚光燈亮得讓人看不清任何觀眾的臉',
  sceneDescription:
    '蕾娜站在聚光燈下。觀眾席傳來陣陣笑聲，每一聲都精準地落在她設計好的笑點上。\n' +
    '這是她最擅長的地方。舞台、掌聲、完美的演出。\n' +
    '但如果你仔細觀察，會發現台下的影子在笑聲中扭曲。',
  emotionalForeword: '「今晚，笑聲無限！」這是她對世界的宣言，也是她給自己的麻醉劑。',
  playerUnderstanding: '她將自我價值完全綁定在「讓別人快樂」的責任上，認為除此之外她別無價值。',
  interactables: [
    {
      id: 'spotlight_stage',
      name: '舞台聚光燈',
      category: 'performance',
      surfaceInfo: '強烈而純白的聚光燈，將蕾娜的身影拉得極長。',
      deepMessage: '這束光不是為了照亮她，是為了讓她看不見台下的空洞。只要光還在，表演就不能停止。',
      insight: '舞台的聚光燈是她的盾牌，也是她的牢籠。',
      reflectionChoices: [
        { text: '照亮', insight: false },
        { text: '屏障', insight: true },
        { text: '溫度', insight: false },
        { text: '焦點', insight: false },
      ],
      understandingReward: 8,
    },
    {
      id: 'audience_seats',
      name: '觀眾席',
      category: 'witness',
      surfaceInfo: '黑壓壓的觀眾席，只能看見無數雙發光的眼睛，卻看不見任何表情。',
      deepMessage: '對蕾娜來說，觀眾不是活生生的人，而是需要被「餵食」笑聲的怪物。',
      insight: '她害怕觀眾，因為她害怕一旦停下來，那些笑聲就會變成噓聲。',
      reflectionChoices: [
        { text: '喝采', insight: false },
        { text: '期待', insight: false },
        { text: '恐懼', insight: true },
        { text: '重量', insight: false },
      ],
      understandingReward: 7,
    },
    {
      id: 'applause_banner',
      name: '喝采布條',
      category: 'public_perception',
      surfaceInfo: '上方懸掛著「全場笑聲保證」的巨大紅色布條。',
      deepMessage: '「保證」這兩個字，成了她每天化妝時最大的壓力。它代表她失去了悲傷的權利。',
      insight: '當一個人被定義為「帶來快樂的人」，她就失去了表達其他情緒的權利。',
      reflectionChoices: [
        { text: '榮耀', insight: false },
        { text: '保證', insight: false },
        { text: '牢籠', insight: true },
        { text: '形狀', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'joke_scripts_desk',
      name: '段子筆記',
      category: 'comfort',
      surfaceInfo: '桌上放著一本翻開的筆記，寫滿了各種笑話的草稿。',
      deepMessage: '筆記的邊緣有乾涸的水漬。那是她在練習笑容時，不小心滴落的眼淚。',
      insight: '笑話集是用來埋葬痛苦的，每一頁笑聲背後都是孤獨。',
      reflectionChoices: [
        { text: '段子', insight: false },
        { text: '淚痕', insight: true },
        { text: '墨跡', insight: false },
        { text: '集結', insight: false },
      ],
      understandingReward: 10,
    },
  ],
  nextLayerThreshold: 30,
  colorScheme: {
    bg: '#2d251a',
    text: '#f2e8cf',
    accent: '#bc6c25',
    dim: 'rgba(188, 108, 37, 0.15)',
    sub: '#dda15e',
    cellEmpty: 'rgba(221, 161, 94, 0.12)',
    cellNorm: 'rgba(221, 161, 94, 0.08)',
    cellDisc: 'rgba(221, 161, 94, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(188,108,37,0.16), rgba(120,70,25,0.1))',
    border: 'rgba(188,108,37,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(45,37,26,0.5), rgba(20,15,10,0.85))',
  },
  maxUnderstanding: 35,
};

// ---- 第二層：休息室的電話 (Backstage Phone) ----

const layer2: PsychLayerData = {
  layerId: 'backstage_phone',
  layerNumber: 2,
  layerName: '休息室的電話',
  symbol: '靜止的電話',
  atmosphere: '昏暗的後台休息室，只有牆上的時鐘在倒數，電話線像蛇一樣纏繞在地板上',
  sceneDescription:
    '那是她首場演出前一小時。休息室的電話響了，帶來了父親去世的消息。\n' +
    '經紀人推開門，跟她說：「你必須演完，這是為了觀眾，也是為了你爸爸。」\n' +
    '她在那一刻學會了如何把靈魂鎖進箱子裡。',
  emotionalForeword: '有些電話一旦接起，世界就再也不會恢復原狀。',
  playerUnderstanding: '她不是不想哭，而是被禁止哭。那通電話奪走了她身為人的自然情感，將她變成了機器。',
  interactables: [
    {
      id: 'hospital_phone',
      name: '休息室的電話',
      category: 'trauma',
      surfaceInfo: '一台老舊的旋轉撥號電話。聽筒懸在半空，傳出斷斷續續的忙音。',
      deepMessage: '電話那頭的聲音，是她這輩子聽過最冷的東西。從那一刻起，她的心跳似乎也跟著斷了。',
      insight: '這通電話是她情感世界的斷裂點——在此之後，只剩表演。',
      reflectionChoices: [
        { text: '忙音', insight: false },
        { text: '斷裂', insight: true },
        { text: '通訊', insight: false },
        { text: '重量', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'backstage_mirror',
      name: '後台化妝鏡',
      category: 'mask',
      surfaceInfo: '鏡子周圍鑲滿了燈泡。有些燈泡在閃爍，映出一張蒼白而僵硬的臉。',
      deepMessage: '她在鏡子前化了人生中最濃的一個妝，為了蓋住那張快要垮掉的臉。',
      insight: '面具不是為了欺騙別人，是為了讓自己相信自己還撐得住。',
      reflectionChoices: [
        { text: '妝容', insight: false },
        { text: '燈泡', insight: false },
        { text: '支撐', insight: true },
        { text: '倒影', insight: false },
      ],
      understandingReward: 8,
    },
    {
      id: 'frozen_clock',
      name: '凍結的時鐘',
      category: 'trauma',
      surfaceInfo: '掛在牆上的圓形時鐘。指針指著開演前的一小時，不再走動。',
      deepMessage: '對蕾娜來說，時間永遠停在那一分鐘。她的一生都在重演那一小時之後的表演。',
      insight: '未完成的告別，讓她的時間永遠凍結在痛苦發生的那一刻。',
      reflectionChoices: [
        { text: '停滯', insight: true },
        { text: '指針', insight: false },
        { text: '數字', insight: false },
        { text: '循環', insight: false },
      ],
      understandingReward: 9,
    },
    {
      id: 'dressing_room_door',
      name: '休息室的門',
      category: 'identity',
      surfaceInfo: '門縫外傳來觀眾進場的嘈雜聲。門鎖被從外面反鎖了。',
      deepMessage: '經紀人的命令隔著這扇門傳進來。這扇門分開了「蕾娜」與「喜劇演員」。',
      insight: '這扇門象徵著外界對她的期許，強行隔離了她的私人哀傷。',
      reflectionChoices: [
        { text: '隔離', insight: true },
        { text: '門鎖', insight: false },
        { text: '聲音', insight: false },
        { text: '邊界', insight: false },
      ],
      understandingReward: 7,
    },
    {
      id: 'contract_papers',
      name: '演出合約',
      category: 'loss',
      surfaceInfo: '揉成一團的演出合約。上面有一條：不得因個人因素影響表演質量。',
      deepMessage: '這張紙比任何鎖鏈都要沉重。它賦予了她「專業」的頭銜，卻剝奪了她哀傷的權利。',
      insight: '社會角色與個人情感的衝突，是她痛苦的根源。',
      reflectionChoices: [
        { text: '紙張', insight: false },
        { text: '重量', insight: true },
        { text: '文字', insight: false },
        { text: '束縛', insight: false },
      ],
      understandingReward: 8,
    },
  ],
  nextLayerThreshold: 35,
  colorScheme: {
    bg: '#1a1d2e',
    text: '#d1d8e0',
    accent: '#4b7bec',
    dim: 'rgba(75, 123, 236, 0.15)',
    sub: '#a5b1c2',
    cellEmpty: 'rgba(165, 177, 194, 0.12)',
    cellNorm: 'rgba(165, 177, 194, 0.08)',
    cellDisc: 'rgba(165, 177, 194, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(75,123,236,0.16), rgba(40,60,120,0.1))',
    border: 'rgba(75,123,236,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(26,29,46,0.5), rgba(10,12,20,0.85))',
  },
  maxUnderstanding: 42,
};

// ---- 第三層：鏡面迷宮 (Mirror Maze) ----

const layer3: PsychLayerData = {
  layerId: 'mirror_maze',
  layerNumber: 3,
  layerName: '鏡面迷宮',
  symbol: '飛舞的面具',
  atmosphere: '無數面鏡子折射著同一個笑容，卻在鏡子的深處藏著不同的哭聲',
  sceneDescription:
    '這是一個由無數面鏡子組成的迷宮。每一面鏡子都映出蕾娜完美的笑臉。\n' +
    '但在迷宮的中心，有一張面具正在與皮膚融合。蕾娜已經分不清哪一張臉才是真正的自己。\n' +
    '這裡飛舞著她這些年來戴過的每一張笑臉。',
  emotionalForeword: '如果你分不清真假，那是因為你已經把謊言當成了唯一的真實。',
  playerUnderstanding: '她不是在「演」笑，而是已經「忘記」了如何不笑。這種身分崩解讓她極度空虛。',
  interactables: [
    {
      id: 'lipstick_mirror',
      name: '口紅畫的鏡子',
      category: 'self',
      surfaceInfo: '一面大鏡子上，有人用亮紅色的口紅畫了一個巨大的、誇張的笑臉。',
      deepMessage: '那晚表演後，她用這支口紅遮住了鏡中哭泣的自己。從此口紅再也沒擰回去。',
      insight: '畫出來的笑臉，成了她對世界最後的防線。',
      reflectionChoices: [
        { text: '顏色', insight: false },
        { text: '防線', insight: true },
        { text: '塗鴉', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 10,
    },
    {
      id: 'tearful_reflection',
      name: '流淚的倒影',
      category: 'trauma',
      surfaceInfo: '在一面不起眼的碎裂鏡子裡，蕾娜的倒影正在無聲地流淚。',
      deepMessage: '這個倒影沒有在表演。它被困在時間的縫隙裡，那是她唯一被允許悲傷的時刻。',
      insight: '只有在破碎的自我中，她才能短暫地面對真實的哀慟。',
      reflectionChoices: [
        { text: '倒影', insight: false },
        { text: '碎片', insight: true },
        { text: '液體', insight: false },
        { text: '反射', insight: false },
      ],
      understandingReward: 9,
    },
    {
      id: 'flying_masks',
      name: '飛舞的面具',
      category: 'identity',
      surfaceInfo: '迷宮中飛舞著無數陶瓷面具，每一個都在發出哈哈大笑的聲音。',
      deepMessage: '這些不是怪物，是她這些年來在不同場合戴過的「職業微笑」。',
      insight: '這些面具已經有了自己的生命，反過來控制了她的本體。',
      reflectionChoices: [
        { text: '生命', insight: true },
        { text: '笑聲', insight: false },
        { text: '陶瓷', insight: false },
        { text: '重量', insight: false },
      ],
      understandingReward: 8,
    },
    {
      id: 'broken_shards',
      name: '破碎的玻璃',
      category: 'loss',
      surfaceInfo: '地面上鋪滿了鏡子的碎片。每踩上去一步，都會映出一個不同的表情。',
      deepMessage: '這些碎片是她試圖打破面具時留下的痕跡。每一次嘗試，都讓她受傷得更深。',
      insight: '打破偽裝的過程是極其痛苦的，但這是找回真我的唯一途徑。',
      reflectionChoices: [
        { text: '疼痛', insight: false },
        { text: '痕跡', insight: false },
        { text: '途徑', insight: true },
        { text: '碎片', insight: false },
      ],
      understandingReward: 9,
    },
    {
      id: 'tissue_box_corner',
      name: '乾涸的面紙盒',
      category: 'comfort',
      surfaceInfo: '迷宮角落放著一個空的面紙盒。裡面什麼都沒有，盒子已經泛黃。',
      deepMessage: '這本應是擦拭淚水的地方。但因為她不再被允許哭泣，所以面紙也顯得不再必要。',
      insight: '空的面紙盒象徵著她對自我情感排泄能力的徹底喪失。',
      reflectionChoices: [
        { text: '遺忘', insight: true },
        { text: '空盒', insight: false },
        { text: '紙張', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 8,
    },
  ],
  nextLayerThreshold: 40,
  colorScheme: {
    bg: '#2b2b2b',
    text: '#dcdde1',
    accent: '#eb4d4b',
    dim: 'rgba(235, 77, 75, 0.15)',
    sub: '#7f8c8d',
    cellEmpty: 'rgba(127, 140, 141, 0.12)',
    cellNorm: 'rgba(127, 140, 141, 0.08)',
    cellDisc: 'rgba(127, 140, 141, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(235,77,75,0.16), rgba(150,50,50,0.1))',
    border: 'rgba(235,77,75,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(43,43,43,0.5), rgba(20,20,20,0.85))',
  },
  maxUnderstanding: 44,
};

// ---- 第四層：無鏡的房間 (Mirrorless Room) ----

const layer4: PsychLayerData = {
  layerId: 'mirrorless_room',
  layerNumber: 4,
  layerName: '無鏡的房間',
  symbol: '空白的畫框',
  atmosphere: '柔和、安靜，沒有任何鏡子。空氣中瀰漫著淡淡的薰衣草香',
  sceneDescription:
    '這是一個普通的房間。這裡沒有舞台，沒有聚光燈，更沒有鏡子。\n' +
    '蕾娜坐在沙發上，手中拿著一支無色的護唇膏。她不再需要用亮紅色遮掩什麼。\n' +
    '這裡允許空白，允許不笑，允許只是活著。',
  emotionalForeword: '當你不再需要證明什麼的時候，你才真正擁有了自己。',
  playerUnderstanding: '真正的修復不是幫她找回笑容，而是讓她在不笑的時候，依然覺得自己值得被看見。',
  interactables: [
    {
      id: 'empty_frame',
      name: '空白畫框',
      category: 'acceptance',
      surfaceInfo: '牆上掛著一個木製的畫框，裡面是一片空白。這不是缺少，而是完整。',
      deepMessage: '蕾娜看著這個框。她發現，不需要填充任何內容，這個存在本身就是美麗的。',
      insight: '空白不是缺陷，而是無限的可能。',
      reflectionChoices: [
        { text: '空白', insight: false },
        { text: '完整', insight: true },
        { text: '虛無', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 12,
    },
    {
      id: 'sofa_chair',
      name: '柔軟的沙發',
      category: 'comfort',
      surfaceInfo: '一張米白色的單人沙發。看起來被坐過很久，凹陷處非常溫暖。',
      deepMessage: '這是她第一次允許自己「塌陷」的地方。不用挺直腰桿，不用保持優雅。',
      insight: '允許自己疲倦，是通往療癒的第一步。',
      reflectionChoices: [
        { text: '休息', insight: false },
        { text: '療癒', insight: true },
        { text: '家具', insight: false },
        { text: '柔軟', insight: false },
      ],
      understandingReward: 8,
    },
    {
      id: 'faded_poster',
      name: '褪色的海報',
      category: 'echo',
      surfaceInfo: '牆角貼著一張舊海報，字跡已經模糊。那是她多年前的夢想。',
      deepMessage: '海報上的笑容依舊燦爛。但現在她看著它，就像看著一個很久不見的老朋友，不再是枷鎖。',
      insight: '接納過去的自己，包括那些曾經傷害過自己的夢想。',
      reflectionChoices: [
        { text: '過去', insight: false },
        { text: '接納', insight: true },
        { text: '記憶', insight: false },
        { text: '海報', insight: false },
      ],
      understandingReward: 7,
    },
    {
      id: 'clean_lip_balm',
      name: '無色護唇膏',
      category: 'acceptance',
      surfaceInfo: '桌上放著一支透明的護唇膏。它靜靜地躺在那裡。',
      deepMessage: '她不再需要用亮紅色來定義自己的嘴唇。透明的，才是她此刻最想要的顏色。',
      insight: '透明代表著坦誠，不再需要用外界的標籤來覆蓋自我的本質。',
      reflectionChoices: [
        { text: '透明', insight: true },
        { text: '簡單', insight: false },
        { text: '護理', insight: false },
        { text: '標籤', insight: false },
      ],
      understandingReward: 10,
    },
  ],
  nextLayerThreshold: 0,
  colorScheme: {
    bg: '#f7f1e3',
    text: '#2c3e50',
    accent: '#706fd3',
    dim: 'rgba(112, 111, 211, 0.15)',
    sub: '#474787',
    cellEmpty: 'rgba(71, 71, 135, 0.12)',
    cellNorm: 'rgba(71, 71, 135, 0.08)',
    cellDisc: 'rgba(71, 71, 135, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(112,111,211,0.16), rgba(80,80,180,0.1))',
    border: 'rgba(112,111,211,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(247,241,227,0.5), rgba(200,190,170,0.85))',
  },
  maxUnderstanding: 37,
};

export const renaPsychLayers: PsychLayerData[] = [layer1, layer2, layer3, layer4];
