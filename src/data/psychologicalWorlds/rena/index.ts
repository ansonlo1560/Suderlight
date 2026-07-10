// ============================================================
// 蕾娜 (Rena) 心理世界 — 四層情感弧線
// 歡笑劇場 → 休息室的電話 → 鏡面，和鏡面前的她 → 鏡面前的她
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

// ---- 第三層：鏡面，和鏡面前的她 (Mirror, and Her at the Mirror) ----

const layer3: PsychLayerData = {
  layerId: 'mirror_maze',
  layerNumber: 3,
  layerName: '鏡面，和鏡面前的她',
  symbol: '畫著笑臉的鏡子',
  atmosphere: '休息室的化妝鏡，鏡上用亮紅色口紅畫著一張誇張的笑臉，遮住了底下流淚的倒影',
  sceneDescription:
    '脫口秀後，她回到休息室，卻發現自己已經不能笑出來了。\n' +
    '她只記得要笑，於是她在鏡子前練習微笑，卻在鏡子中流淚。\n' +
    '於是，她拿著口紅，在鏡子前，畫了一個大大的，誇張的笑臉。\n' +
    '在此之後，她只懂笑，卻沒有了其他的表情。',
  emotionalForeword: '她拿起口紅的那一刻，不是為了化妝——是為了把哭的那張臉，永遠蓋住。',
  playerUnderstanding: '那晚她拿著父親送的亮紅色口紅，在鏡子上畫出誇張的笑臉來遮住流淚的自己。從此口紅再也沒擰回去——她把自己鎖在了那個畫出來的微笑裡。',
  interactables: [
    {
      id: 'lipstick_mirror',
      name: '口紅畫的鏡子',
      category: 'self',
      surfaceInfo: '休息室的化妝鏡上，有人用亮紅色的口紅畫了一個巨大的、誇張的笑臉，線條幾乎穿透整面玻璃。',
      deepMessage: '那晚表演後她再也笑不出來，卻在鏡中看見一張流淚的臉。於是她擰開口紅，把哭的那張臉徹底遮住。口紅後來再也沒擰回去過，就那樣乾涸在「笑」的形狀裡。',
      insight: '畫出來的笑臉，成了她對世界最後的防線——也是她囚禁自己的牢籠。',
      reflectionChoices: [
        { text: '顏色', insight: false },
        { text: '防線', insight: true },
        { text: '塗鴉', insight: false },
        { text: '形狀', insight: false },
      ],
      understandingReward: 12,
    },
    {
      id: 'tearful_reflection',
      name: '流淚的倒影',
      category: 'trauma',
      surfaceInfo: '在口紅畫出的笑臉底下，隱約能看見鏡中蕾娜的倒影正在無聲地流淚。',
      deepMessage: '她在鏡子前練習微笑，卻在鏡子中看見自己流淚。這個倒影沒有在表演——那是最後一個真實的蕾娜，被困在口紅笑臉的後面。',
      insight: '笑臉背後的眼淚，是她最後被允許流露的真實情感。從那以後，她只懂笑，卻忘了怎麼哭。',
      reflectionChoices: [
        { text: '倒影', insight: false },
        { text: '真實', insight: true },
        { text: '液體', insight: false },
        { text: '反射', insight: false },
      ],
      understandingReward: 10,
    },
  ],
  nextLayerThreshold: 40,
  colorScheme: {
    bg: '#2b2020',
    text: '#e8d5d5',
    accent: '#eb4d4b',
    dim: 'rgba(235, 77, 75, 0.15)',
    sub: '#b8a0a0',
    cellEmpty: 'rgba(184, 160, 160, 0.12)',
    cellNorm: 'rgba(184, 160, 160, 0.08)',
    cellDisc: 'rgba(184, 160, 160, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(235,77,75,0.16), rgba(150,50,50,0.1))',
    border: 'rgba(235,77,75,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(43,32,32,0.5), rgba(20,12,12,0.85))',
  },
  maxUnderstanding: 22,
};

// ---- 第四層：鏡面前的她 (Her at the Mirror) ----

const layer4: PsychLayerData = {
  layerId: 'mirrorless_room',
  layerNumber: 4,
  layerName: '鏡面前的她',
  symbol: '被擦去的笑臉',
  atmosphere: '鏡子上的口紅笑臉被抹去了大半，底下露出那張不再表演的臉。眼淚和笑容第一次同時存在。',
  sceneDescription:
    '她伸出手，擦掉了之前在鏡子上用口紅畫的那張笑臉。\n' +
    '這一次，她不再刻意地笑，而是露出了自己真實的、平常應該有的表情。\n' +
    '然後——她哭了。她也笑了。\n' +
    '她終於能像平常人一樣，擁有感受和控制自己的表情與情緒的能力了。',
  emotionalForeword: '當你不再需要證明什麼的時候，你才真正擁有了自己。',
  playerUnderstanding: '真正的修復不是幫她找回笑容，而是讓她在不笑的時候，依然覺得自己值得被看見。',
  interactables: [
    {
      id: 'wiped_mirror',
      name: '被擦去的笑臉',
      category: 'acceptance',
      surfaceInfo: '鏡子上那張用口紅畫的笑臉被抹去了大半。底下隱約看見一張不再表演的臉——有淚痕，也有淡淡的微笑。',
      deepMessage: '她用指尖沿著口紅笑臉的邊緣劃了一圈，然後——鼓起勇氣，把它擦掉了。底下露出的不是另一個完美的表情，而是一個正在流淚、也正在微笑的人。兩張臉同時存在，像她花了半輩子才敢承認的事實。',
      insight: '擦掉笑臉的那一刻，她終於看見了自己真正的表情——不需要完美，也不需要觀眾。',
      reflectionChoices: [
        { text: '痕跡', insight: false },
        { text: '解放', insight: true },
        { text: '抹去', insight: false },
        { text: '殘留', insight: false },
      ],
      understandingReward: 12,
    },
    {
      id: 'sofa_chair',
      name: '柔軟的沙發',
      category: 'comfort',
      surfaceInfo: '鏡子旁擺著一張米白色的單人沙發。看起來被坐過很久，凹陷處非常溫暖。',
      deepMessage: '這是她擦掉笑臉後第一次把自己摔進去的地方。不用挺直腰桿，不用保持優雅——只是讓自己塌陷在柔軟裡。',
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
      surfaceInfo: '牆角貼著一張舊海報，字跡已經模糊。那是她多年前的夢想——現在看來像一個很久不見的老朋友。',
      deepMessage: '海報上的笑容依舊燦爛，但邊角已經泛黃捲曲。她看著它，不再感到窒息——只是一種平靜，像翻閱一本很久以前的相簿。那些努力、那些假裝、那些不讓自己垮掉的日日夜夜，都是她走過的路。',
      insight: '接納過去的自己，不是忘記傷痛，而是承認那些痕跡都是自己的一部分。',
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
      surfaceInfo: '化妝檯上放著一支透明的護唇膏。旁邊是那支乾涸的亮紅色口紅——終於被擱在一旁了。',
      deepMessage: '她不再需要用亮紅色來定義自己的嘴唇。透明的，才是她此刻最想要的顏色。不需要向任何人證明什麼，不需要上揚的弧度——只是好好照顧自己。',
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
    bg: '#2a2520',
    text: '#e8dcc8',
    accent: '#d4a574',
    dim: 'rgba(212, 165, 116, 0.15)',
    sub: '#b8a898',
    cellEmpty: 'rgba(212, 165, 116, 0.12)',
    cellNorm: 'rgba(212, 165, 116, 0.08)',
    cellDisc: 'rgba(212, 165, 116, 0.10)',
    cellInsight: 'linear-gradient(135deg, rgba(212,165,116,0.16), rgba(140,100,60,0.1))',
    border: 'rgba(212,165,116,0.12)',
    gridBg: 'radial-gradient(ellipse at center, rgba(42,37,32,0.5), rgba(20,16,12,0.85))',
  },
  maxUnderstanding: 37,
};

export const renaPsychLayers: PsychLayerData[] = [layer1, layer2, layer3, layer4];
