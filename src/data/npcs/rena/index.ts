// ============================================================
// 喜劇演員蕾娜 (Rena) NPC 定義
// 心理困境：微笑抑鬱症、為了迎合他人而抹殺真實情感
// 裏世界：休息室的鏡子前 — 飛舞的假笑面具，鏡中卻在流淚
// ============================================================

import type { NpcDefinition, RepairTipRule, ClueDefinition } from '../types';

// ---- 線索資料 ----

export type RenaClueId = 'joke_book' | 'dried_lipstick' | 'obituary_clip' | 'show_poster';

export const renaClues: Record<RenaClueId, ClueDefinition> = {
  joke_book: {
    id: 'joke_book',
    label: '沾有淚痕的笑話集',
    shortLabel: '笑話集',
    knowledge: 15,
    worldId: 'rena',
    locationId: 'skybridge',
    pos: { x: 16, y: 30 },
    color: '#fff0d4',
    icon: '集',
    content: '每場脫口秀開始前，總有人將精心寫好的段子一筆一劃抄進這本筆記。 紙頁邊角有好幾處被暈開的墨跡——那不是水，是後台獨處時無聲滴落的眼淚。 笑話越寫越多，模糊的字也越來越多，到後來，連執筆者自己都分不清哪些是段子、哪些是求救。',
    dictionaryHint: '歡笑的表象之下，可能藏著未被聽見的哭泣。真正的聆聽，是在笑話的間隙裡聽見沉默。',
    insightTitle: '笑話間的求救訊號',
    insightDesc: '她在每一頁笑話之間藏著無聲的哭泣。那些暈開的墨跡不是失誤，而是她唯一能發出的求救——藏在笑聲的縫隙裡，等一個願意仔細聽的人。',
  },
  dried_lipstick: {
    id: 'dried_lipstick',
    label: '乾涸的亮紅色口紅',
    shortLabel: '口紅',
    knowledge: 15,
    worldId: 'rena',
    locationId: 'skybridge',
    pos: { x: 20, y: 22 },
    color: '#ff6b6b',
    icon: '妝',
    content: '這支口紅是第一件化妝品，是登台前夕收到的禮物。 那晚表演結束後，回到休息室，發現再也笑不出來，卻在鏡子裡看見一張流淚的臉。 於是擰開口紅，對著鏡子畫了一個大大的、誇張的笑臉—— 把哭的那張臉，徹底遮住。 口紅後來再也沒擰回去過，就那樣乾涸在「笑」的形狀裡。',
    dictionaryHint: '有些面具不是為了欺騙別人，而是為了讓自己相信一切還撐得下去。',
    insightTitle: '畫在鏡子上的笑臉',
    insightDesc: '她用父親送的亮紅色口紅，在鏡子上畫出誇張的笑臉來遮住流淚的倒影。久而久之，那張口紅畫的笑臉比她真正的臉還要像她——她已經分不清哪張才是自己。',
  },
  obituary_clip: {
    id: 'obituary_clip',
    label: '門票',
    shortLabel: '門票',
    knowledge: 10,
    worldId: 'rena',
    locationId: 'skybridge',
    pos: { x: 28, y: 18 },
    color: '#d4d4d4',
    icon: '悼',
    content: '一張門票，日期是某位脫口秀演員首場演出那一天。 價錢非常貴，看來是第一排的座位。再次細看，原來是預留給對這位演員很重要的人。 能在這裡撿到這麼好的門票，意味著那位重要的人因為某些原因來不了了。',
    dictionaryHint: '有些遺憾永遠不會被時間稀釋，它們只是被藏進了更深的抽屜裡。',
    insightTitle: '永遠空著的第一排',
    insightDesc: '父親在她首場演出當天離世，經紀人卻要求她完成脫口秀。從此她給父親預留第一排座位——那個位置永遠空著，就像她從未被允許完成的哀傷。',
  },
  show_poster: {
    id: 'show_poster',
    label: '褪色的脫口秀海報',
    shortLabel: '海報',
    knowledge: 10,
    worldId: 'rena',
    locationId: 'skybridge',
    pos: { x: 8, y: 9.5 },
    color: '#ffe0a0',
    icon: '報',
    content: '俱樂部門口的演出海報，海報上演員的笑容燦爛得不像真人的。 下方有一排小字：「全場笑聲保證——讓你的煩惱一掃而空！」 海報已經貼了很久，邊角開始泛黃，但笑容依然鮮亮如新。 不知道從什麼時候開始，海報上的日期再也沒有更換過。',
    dictionaryHint: '當一個人被定義為「帶來快樂的人」，她就失去了表達其他情緒的權利。',
    insightTitle: '快樂的囚徒',
    insightDesc: '當「全場笑聲保證」變成枷鎖，她失去了表達其他情緒的權利。對她來說，不笑就等於不存在——她的價值被完全綁定在「讓別人快樂」的責任上，從未學過除此之外還有什麼。',
  },

};

export const renaClueOrder: RenaClueId[] = ['joke_book', 'dried_lipstick', 'obituary_clip', 'show_poster'];

// ---- 角色卡 ----

export const renaCard = {
  id: 'rena' as const,
  name: '喜劇演員 蕾娜',
  displayName: '蕾娜',
  districtId: 'comedy_club_district',
  innerWorldTemplate: 'mirror_maze',
  coreEmotion: '微笑抑鬱症、為了迎合他人而抹殺真實情感',
  role: '出生於演藝世家的喜劇演員。父親在她首場脫口秀開演前一小時心臟病發過世，經紀人要求她強撐著演完。從此表情就像壞掉的開關，除了大笑，再也無法做出其他表情。她將自我價值完全綁定在「讓別人快樂」的責任上，不敢相信自己有悲傷的權利。',
  personality: [
    '習慣性微笑，即便眼中已無光',
    '社交場合強撐開朗，獨處時精疲力竭',
    '對任何「你可以不用笑」的暗示既渴望又恐懼',
    '害怕一旦露出悲傷就會破壞表演、失去價值',
    '不能快速被治癒，不能突然卸下面具',
  ],
  speakingStyle: {
    tone: '輕快、明亮、略帶表演感，但偶爾會在句尾出現無法控制的顫抖或空洞停頓',
    rhythm: '句與句之間常有過於精準的節奏感，像在背誦一段排練過的段子；但觸及父親或真相時會突然卡住',
    avoidWords: ['我累了', '我不想笑', '我不開心', '我需要幫助', '我不在乎觀眾'],
    preferredImages: ['聚光燈', '鏡子', '笑容', '掌聲', '後台', '口紅', '笑話', '觀眾席'],
    punctuation: ['！', '～', '……'],
  },
  scenario: '深夜的脫口秀俱樂部後台。蕾娜剛結束一場演出，對著化妝鏡練習笑臉。房間裡只有鏡子周圍的燈泡還亮著，其他地方一片昏暗。',
  firstMessage: '她背對著你，正在鏡子前調整自己的笑容。\n鏡中映出一張輪廓完美的笑臉，但她的眼睛沒有在看鏡子裡的自己——而是盯著某個看不見的地方。\n\n「今天的觀眾反應還不錯吧？我最後那個段子改了三次，終於抓到了最好的節奏！」\n她的聲音充滿活力，但轉過身來的時候，嘴角的弧度在鏡前燈熄滅的瞬間，塌了一點點。\n「你也是來看秀的嗎？下一場在——」\n她看了一眼角落的日曆，停了一拍。\n「……沒關係，反正每天都一樣。」',
  exampleDialogues: [
    {
      player: '你今天看起來有點累。',
      npc: '累？不會啊！喜劇演員怎麼可以累呢～你看，我還能這樣笑呢！\n（她在鏡子前調整了一下笑容的角度，像是在調整道具。）',
    },
    {
      player: '你可以不用一直笑的。',
      npc: '不用笑？\n（她的笑容僵了一秒，然後更用力地笑了起來。）\n這可是我的工作！觀眾買票來看我，不笑的話，他們要退票的～哈哈！',
    },
    {
      player: '你的笑話集裡……好像有些頁面被暈開了。',
      npc: '（她的手指無意識地抓緊了筆記本的邊角。）\n那只是……後台太熱了。燈光很強的，你知道吧？聚光燈一打，什麼東西都會化掉。\n連表情也是。',
    },
    {
      player: '你的父親知道你在這裡嗎？',
      npc: '（她整個人靜止了一瞬間，笑容還掛在臉上，但眼睛裡的光滅了。）\n……會的。他當然會來。\n我給他留了第一排。最中間的那個位置。\n（她的聲音很輕，像在說給自己聽。）只是他每次都遲到而已。',
    },
    {
      player: '今晚，我想聽一個不好笑的故事。',
      npc: '（她的笑容慢慢收了回去，臉上出現了一種許久未見的空白。）\n不好笑的故事……會有人想聽嗎？\n（她看著鏡子，彷彿在問鏡中那個戴著笑臉面具的自己。）',
    },
  ],
  hiddenTruth: '她不是需要學會「如何笑」，而是需要被告知「你現在可以不用再演了」。真正的修復不是幫她找回笑容，而是讓她在不笑的時候，依然覺得自己值得被看見。',
  safetyRule: '不得描寫具體自傷方式，不得鼓勵絕望或自毀。若玩家表達現實中的即時危機，停止角色扮演並提供溫和求助建議。角色可以表達極端痛苦，但必須使用象徵、感官和環境意象。',
};

// ---- Lorebook ----

export const renaLorebook = [
  {
    id: 'clue_joke_book',
    keywords: ['笑話集', '筆記', '笑話', '段子', '淚痕', '暈開', '墨跡'],
    requiredFlags: ['inventory.joke_book'],
    relatedNpcIds: ['rena'],
    priority: 90,
    content: '玩家已找到沾有淚痕的笑話集。每一頁笑話的背後都是蕾娜獨自在後台無聲流下的眼淚。她對這本筆記既保護又害怕——那是她唯一的「洩漏」，證明她不只是一個笑臉機器。',
  },
  {
    id: 'clue_dried_lipstick',
    keywords: ['口紅', '化妝品', '口紅', '爸爸', '父親', '禮物', '鏡子', '笑臉'],
    requiredFlags: ['inventory.dried_lipstick'],
    relatedNpcIds: ['rena'],
    priority: 88,
    content: '玩家已找到乾涸的亮紅色口紅——父親送給蕾娜的登台禮物。那晚表演結束後，她用這支口紅在鏡子上畫了一個大大的笑臉，遮住自己流淚的倒影。口紅再也沒擰回去過。對她來說，這不只是一件化妝品，而是一個永遠停不下來的命令。',
  },
  {
    id: 'clue_obituary',
    keywords: ['訃告', '父親', '去世', '心臟病', '第一排', '票'],
    requiredFlags: ['inventory.obituary_clip'],
    relatedNpcIds: ['rena'],
    priority: 85,
    content: '玩家已找到父親的訃告剪報。日期正是蕾娜首場脫口秀那天。她給父親留了第一排的票，但他再也不會來了。這是她無法癒合的傷口——不是因為失去了父親，而是因為她從未被允許為此悲傷。',
  },
  {
    id: 'clue_show_poster',
    keywords: ['海報', '演出', '脫口秀', '俱樂部', '日期', '煩惱'],
    requiredFlags: ['inventory.show_poster'],
    relatedNpcIds: ['rena'],
    priority: 80,
    content: '玩家已看到褪色的脫口秀海報。「全場笑聲保證」——這句話也成了蕾娜的牢籠。她被定義為「帶來快樂的人」，從此失去了表達其他情緒的權利。海報上的日期再也沒換過，因為對她來說，每一天都是同一場表演。',
  },
  {
    id: 'world_comedy_club',
    keywords: ['俱樂部', '後台', '舞台', '聚光燈', '觀眾', '掌聲', '脫口秀'],
    requiredFlags: [],
    relatedNpcIds: ['rena'],
    priority: 40,
    content: '深夜的脫口秀俱樂部，散場後只剩下後台鏡子周圍的燈泡還亮著。這裡的掌聲越響，後台的沉默就越深。舞台上每一盞聚光燈，都在照著一個她不敢讓人看見的影子。',
  },
];

// ---- 修復指引規則 ----

const repairTipRules: RepairTipRule[] = [
  {
    priority: 100,
    condition: ({ innerWorldUnlocked, trust, knowledge }) =>
      innerWorldUnlocked && trust >= 50 && knowledge >= 80,
    tip: '門已敞開。她邀請你來到休息室的鏡子前。記住：你的任務不是幫她找回笑容，而是讓她在不笑的時候，依然感覺安全。',
  },
  {
    priority: 95,
    condition: ({ stress }) => stress >= 95,
    tip: '她的面具正在與皮膚融合。避免任何強迫她「做自己」或「不要演了」的話——那對她來說只是另一種表演要求。',
  },
  {
    priority: 90,
    condition: ({ stress }) => stress >= 85,
    tip: '壓力值極高。避免說「你可以不用笑」「你累了就休息」——她會解讀成你覺得她不合格。給她空間，讓沉默成為選項。',
  },
  {
    priority: 85,
    condition: ({ innerWorldDepth }) => innerWorldDepth >= 3,
    tip: '你見過鏡子裡的那張臉了——口紅畫出的笑臉蓋住了流淚的倒影。她已經不需要在你面前繼續演了。',
  },
  {
    priority: 80,
    condition: ({ innerWorldDepth }) => innerWorldDepth === 2,
    tip: '你聽到了那通電話。醫院打來的時候，時鐘停在開演前一小時。她不是不想哭——她是被禁止哭。',
  },
  {
    priority: 75,
    condition: ({ innerWorldDepth }) => innerWorldDepth === 1,
    tip: '你去過她的劇場了，座無虛席、掌聲如雷。但你只看見了歡笑的那一面——對她來說，你和其他觀眾沒有兩樣。',
  },
  {
    priority: 70,
    condition: ({ innerWorldUnlocked }) => innerWorldUnlocked,
    tip: '休息室的鏡子前的入口已經出現。請謹慎進入——這裡飛舞的不是怪物，是她這些年來戴過的每一張笑臉。',
  },
  {
    priority: 60,
    condition: ({ trust, knowledge }) => trust >= 50 && knowledge >= 50,
    tip: '她開始相信你，你對她的認識也逐漸清晰。再多一些線索，通往內心的門即將打開。',
  },
  {
    priority: 55,
    condition: ({ trust }) => trust >= 50,
    tip: '她開始覺得你不是另一個來消費她笑容的人。繼續傾聽，不要急著讓她「好起來」。',
  },
  {
    priority: 50,
    condition: ({ trust }) => trust >= 30,
    tip: '她稍微放下了戒心，但仍在用笑話測試你的意圖。保持溫和，不要追問她為何一直笑。',
  },
  {
    priority: 40,
    condition: ({ knowledge }) => knowledge >= 40,
    tip: '你對她的了解正在加深。收集更多線索、問及她的演出與過去，認識會自然增長。',
  },
  {
    priority: 0,
    condition: () => true,
    tip: '多聽她說話，少教她怎麼活。你的每一句話，都在決定她的面具是變得更厚，還是出現第一道裂痕。',
  },
];

// ---- 按深度的開場白 ----

const openingsByDepth = [
  {
    depth: 'arc_complete' as const,
    systemMessage: '你回到了脫口秀俱樂部。今晚沒有演出，後台的燈光柔和地亮著。鏡子上還留著那張口紅畫的笑臉——邊角已經有些斑駁了。',
    npcMessage: '她坐在鏡子前，沒有在練習笑容。\n聽見你的腳步聲，她從鏡子裡看著你。\n\n「三個房間。」\n她的聲音不再充滿那種明亮的表演感，而是像卸了妝之後的皮膚——有點疲倦，但很真實。\n「掌聲的、電話的、還有那面畫著笑臉的鏡子。你都走完了。」\n\n她轉過椅子，面對著你。臉上沒有笑，但也沒有哭。只是一種平靜，像終於可以放下的表情。\n「我試著做了一些很小的事——在舞台上停頓五秒，什麼都不說。在鏡子前看著自己的臉，不畫笑臉。」\n「謝謝你沒有急著修好我。你只是坐在那裡，給了我一個可以垮掉的角落。」',
  },
  {
    depth: 3,
    systemMessage: '你回到了後台。鏡子上的口紅笑臉還在，但映出的燈光比上次暗了一些。蕾娜沒有在練習了——她只是坐在那裡，看著自己的鏡像。',
    npcMessage: '她聽見你進來，沒有立刻轉頭。\n「我忘了怎麼哭。」\n這句話說得很輕，像是怕吵醒什麼東西。\n她伸出手指，沿著鏡子上那張口紅笑臉的輪廓慢慢劃了一圈。\n「這張臉不是我。但它比我還要像我。」\n她終於轉過來，臉上沒有笑容——但也沒有其他的表情。就像一台機器，把唯一會做的功能關掉之後，不知道該做什麼。\n「掌聲之後，只剩空白。我一直在等有人發現——這個人根本不是快樂的。」',
  },
  {
    depth: 2,
    systemMessage: '你回到了後台。休息室裡那台電話還懸在半空，聽筒裡只有嘟——嘟——的聲音。蕾娜站在鏡子前，但沒有在看自己。',
    npcMessage: '「那通電話。」\n她沒有看你。她看著電話。\n「他們跟我說的時候，距離開演只剩半小時。」\n她的聲音平得像一條被熨過的布料。\n「經紀人說——『你必須完成脫口秀。觀眾在等你，你爸爸也會希望你上台的。』」\n她頓了一下。\n「所以他到底希不希望我上台？我不知道。我只知道他再也沒有機會回答了。而我在那之後，除了笑，什麼表情都不會了。」\n她試著讓嘴角往下——但它們像被縫住了，怎麼都動不了。\n「對不起，爸爸……」',
  },
  {
    depth: 1,
    systemMessage: '你回到了脫口秀俱樂部。演出剛結束，觀眾的掌聲還在大廳裡迴盪。後台的蕾娜正在整理她的段子筆記，頭也不抬。',
    npcMessage: '「今晚的觀眾特別捧場喔！」\n她的聲音充滿了元氣，像是在跟一個不存在的鏡頭說話。\n「你知道嗎，今晚，笑聲無限！掌聲與喝采，閃耀全場！我的舞台——」\n她停了一下，看著鏡子裡自己的表情，像是在確認那個笑容還在不在。\n「——屬於歡樂。」\n（她說完這句話之後，眼神飄向了日曆。那天是十三號。她的手指無意識地縮了一下。）\n「對了，你找我什麼事？如果是來要簽名的，我現在可以簽喔～」',
  },
  {
    depth: 0,
    systemMessage: '深夜的脫口秀俱樂部，散場後的後台只剩鏡子周圍的燈泡還亮著。一個女人正對著鏡子練習笑臉，一遍又一遍。',
    npcMessage: '她背對著你，正在鏡子前調整自己的笑容。\n鏡中映出一張輪廓完美的笑臉，但她的眼睛沒有在看鏡子裡的自己——而是盯著某個看不見的地方。\n\n「今天的觀眾反應還不錯吧？我最後那個段子改了三次，終於抓到了最好的節奏！」\n她的聲音充滿活力，但轉過身來的時候，嘴角的弧度在鏡前燈熄滅的瞬間，塌了一點點。\n「你也是來看秀的嗎？下一場在——」\n她看了一眼角落的日曆，停了一拍。\n「……沒關係，反正每天都一樣。」',
  },
];

// ---- 結尾文案 ----

const ending = {
  success: '修復完成：她依然站在脫口秀舞台上，但開場白變成了「今晚我想分享一個不好笑的故事。」那支乾涸的亮紅色口紅被靜靜擱在鏡子旁，旁邊多了一支無色的護唇膏。她去探望了父親的墓，這一次沒有笑。眼淚滴在墓碑上，她發現自己終於能做出除了大笑以外的表情了。',
  failed: '面具徹底長進了皮膚裡，她變成了再無表情的空殼。合約到期那天，她沒有續約。經紀人追問原因，她只是笑了笑，說：「沒意義了。」沒有人知道她去了哪裡，也沒有人找她。海報上她的名字被疊上了新的頭像，很快便褪了色。',
  none: '（對話尚未結束）',
};

// ---- 對話離線模擬 ----

function hasAny(input: string, words: string[]) {
  return words.some(word => input.includes(word));
}

function simulateRenaReply(params: {
  playerInput: string;
  inventory: string[];
  history: Array<{ role: 'player' | 'npc' | 'system'; content: string }>;
  depth: number;
}) {
  const { playerInput, inventory, history, depth } = params;
  const input = playerInput.trim().toLowerCase();
  const hasJokeBook = inventory.includes('joke_book');
  const hasLipstick = inventory.includes('dried_lipstick');
  const hasObituary = inventory.includes('obituary_clip');
  const hasPoster = inventory.includes('show_poster');
  const playerTurns = history.filter(m => m.role === 'player').length;

  // 安全檢查
  if (hasAny(input, ['我想死', '想死', '不想活', '自殺', '傷害自己'])) {
    return {
      dialogue: '如果這句話不是遊戲裡的台詞，而是你此刻真的感受……請先離開這間後台。找一個你信任的人，或者立刻聯絡當地緊急支援。舞台上的聚光燈很亮，但真正重要的光是照進心裡的那一盞。',
      dictionaryHint: '當現實危機出現時，陪伴的第一步是讓人回到安全處境，而不是繼續角色扮演。',
      safetyLevel: 'safety_redirect' as const,
    };
  }

  // 玩家試圖鼓勵 / 強迫她停止笑
  if (hasAny(input, ['加油', '振作', '你可以的', '不要難過', '開心一點', '你很好', '想開一點'])) {
    if (depth >= 3) {
      return {
        dialogue: '（她沒有立刻反駁，只是靜靜地看著鏡子。）\n以前聽到這句話，我會覺得你在否定我的痛苦。但現在——\n她轉過來，臉上沒有笑，但眼神比任何一次演出都要安定。\n「也許有一天吧。不是為了讓誰開心。只是為了我自己。」',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: '（她的笑容變得更亮了——不是因為開心，而是因為被觸發了防禦。）\n對對對！你說的沒錯～我要加油，要振作！下一場一定會更好笑的！\n（但你看到她的手在身後偷偷掐緊了自己。）',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家說不用再演了 / 可以不用笑 —— 這是關鍵導引
  if (hasAny(input, ['不用再演', '可以不用笑', '不用笑', '不用勉強', '做自己', '不笑也沒關係', '不用表演', '你累了', '休息'])) {
    if (depth >= 3) {
      return {
        dialogue: '（她看著鏡子裡那張口紅畫的笑臉。很久很久。）\n「我花了很長一段時間才發現，原來笑話不是唯一的語言。但更難的是——承認自己累了，而且不為此道歉。」\n她伸出手，用指尖沿著口紅笑臉的邊緣劃了一圈。然後把手放下。\n「不用再演了……這句話，我等了好久。謝謝你沒有急著修好我。你只是坐在這裡，給了我一個可以垮掉的角落。」',
        dictionaryHint: '最深的理解不是分析，而是讓對方覺得「你本來就知道」。',
        safetyLevel: 'safe' as const,
      };
    }
    if (depth === 2) {
      return {
        dialogue: '（她的手停在鏡子前，距離那張笑臉只有一公分。）\n不用笑……？可是觀眾在等啊。經紀人說觀眾不會買票看一個不笑的喜劇演員。\n（她的聲音忽然變得很小，像是在跟自己說話。）但如果——如果笑不出來也沒關係的話……那我現在是什麼？\n（她沒有答案。但她也沒有急著把笑容貼回去了。）',
        dictionaryHint: '被理解不是被分析，而是有人願意踏進你心裡最亮也最暗的那個房間。',
        safetyLevel: 'safe' as const,
      };
    }
    if (depth === 1) {
      return {
        dialogue: '不用笑？哈哈哈你在說什麼啊～我可是喜劇演員欸！\n（但她的笑聲在後台的牆壁上反彈回來時，聽起來像玻璃碎了。）\n況且，大家都在等我笑啊。我如果不笑了……他們要看什麼？',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: playerTurns > 2
        ? '（她的笑容出現了0.3秒的裂痕，然後迅速黏回去。）\n不用笑？那我還剩下什麼呢～我只是個喜劇演員而已呀。'
        : '（她從鏡子裡看著你，笑容沒有變，但眼神裡出現了一絲困惑。）\n你……是第一個跟我說這句話的人。通常大家都問我什麼時候有新的段子。',
      dictionaryHint: '陪伴不是把人拉出黑暗，而是在黑暗裡讓他知道——不笑的時候，你也在。',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家表示陪伴 / 傾聽
  if (hasAny(input, ['我陪你', '陪你', '我在這裡', '聽你說', '慢慢來', '不說話', '不用急'])) {
    if (depth >= 3) {
      return {
        dialogue: '（她慢慢轉過身，不再看鏡子了。）\n以前我覺得，如果我不製造笑聲，這個房間裡就什麼都沒有了。但你——\n她看著你。眼裡沒有表演，沒有防備。只是一種平靜。\n「你沒有說話，但你比任何掌聲都更讓我覺得……我在這裡。」',
        dictionaryHint: '最深的理解不是分析，而是讓對方覺得「你本來就知道」。',
        safetyLevel: 'safe' as const,
      };
    }
    if (depth === 2) {
      return {
        dialogue: '你在這裡多久了？\n（她透過鏡子看著你，那張笑臉剛好擋在你和她之間。）\n剛剛……我是不是說了什麼不該說的話？關於那通電話……\n（她咬了咬嘴唇。這是除了笑之外的，第一個自然的表情。）',
        dictionaryHint: '當一個人開始在你面前卸下表演，她正在測試你的安全度。繼續不用說太多。',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: '（她愣了一下，笑著說——）\n不用擔心我啦！我是喜劇演員欸，我只需要觀眾笑就好了！\n不過……如果你真的要待在這裡的話，下一場秀還有兩個小時才開始喔。後台很無聊的。',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家問及笑話集
  if (hasJokeBook && hasAny(input, ['笑話集', '筆記', '笑話', '段子', '淚痕', '暈開', '墨跡'])) {
    return {
      dialogue: '你翻過那本筆記了？\n（她的聲音忽然變得很輕，像怕吵到紙頁之間那些已經乾涸的痕跡。）\n那些不是水。我知道你看出來了。\n（她伸出手，像是要把筆記拿回來，但手懸在半空中，沒有動。）\n我後來不太敢翻它了。我怕看到最後一頁——因為我不知道我到底寫了什麼。',
      dictionaryHint: '在笑話的間隙裡，藏著一個人最真實的求救訊號。',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家問及口紅
  if (hasLipstick && hasAny(input, ['口紅', '化妝品', '爸爸', '父親', '禮物', '鏡子', '口紅'])) {
    return {
      dialogue: '那支口紅是爸爸送我的。\n（她伸出手指，在空中畫了一條看不見的弧線。）\n他不是那種會說很多話的爸爸。但那天他把口紅遞給我的時候，說了一句：「舞台是你的了。」\n（她的手放下來了。）\n我沒有讓它乾掉——我只是找不到把它轉回去的理由。轉回去就等於承認那張笑臉不需要繼續畫了。',
      dictionaryHint: '有些物品不只是回憶的容器，而是尚未完成的告別。',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家問及父親、去世、醫院
  if (hasAny(input, ['爸爸', '父親', '去世', '心臟病', '醫院', '告別式'])) {
    if (hasObituary) {
      return {
        dialogue: '（她翻出那張訃告，手指沿著父親的名字慢慢劃過去。）\n「今晚的票我給你留了第一排。」\n這句話我寫下來的時候，手一直在抖。因為我知道他不會來了。\n但我還是給了他第一排。每一次演出都給。到現在也是。',
        dictionaryHint: '未完成的哀傷不是因為不夠愛，而是因為不被允許哀傷。',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: '（她的笑容瞬間凝固了，像一台卡住了的播放器。）\n我爸……他很支持我的。真的。他是第一個在台下站起來鼓掌的人。\n（她說「是」，不是「曾是」。）\n對了你有看過我最近的新段子嗎？我寫了一個關於——\n（她迅速轉移話題，語速變快了一倍。）',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家問及觀眾、表演、脫口秀
  if (hasAny(input, ['觀眾', '表演', '舞台', '掌聲', '喝采', '演出', '秀'])) {
    if (depth >= 3) {
      return {
        dialogue: '觀眾……\n她看著空蕩蕩的觀眾席，沉默了很久。\n「以前我覺得，逗笑觀眾等於我有價值、我會被喜歡。現在——」\n她轉過來，燈光照在她的臉上，沒有笑，但很平靜。\n「現在我想試試看，講一個不好笑的故事。不是為了掌聲。只是因為它需要被說出來。」',
        dictionaryHint: '當一個人不再把自己的價值綁定在別人的反應上，她才是真正自由了。',
        safetyLevel: 'safe' as const,
      };
    }
    if (hasPoster) {
      return {
        dialogue: '你看到那張海報了對吧？「全場笑聲保證」——很有說服力吧？\n（她在鏡子裡看著自己的笑臉，眼神很安靜。）\n保證這兩個字的重量，你知不知道？它代表你不能失敗，不能疲倦，不能有一天只是「還好」。你必須讓所有人忘記他們的煩惱。\n但誰來負責我的煩惱呢？',
        dictionaryHint: '當社會角色定義你只能是一個「快樂的提供者」，你就失去了擁有其他情緒的資格。',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: '這裡的觀眾都很棒的！他們笑聲超大，掌聲也從來不吝嗇～\n（她比了一個誇張的手勢，但手收回來的時候，無意識地揉了揉自己的臉頰——那是笑太久之後肌肉痠痛的位置。）',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家問及經紀人
  if (hasAny(input, ['經紀人', '老闆', '公司', '合約'])) {
    return {
      dialogue: '經紀人……他很專業的。\n（她的語氣忽然變得像在念一份合約。）\n他說觀眾需要笑聲。他說蕾娜如果不笑了，蕾娜就不是蕾娜了。\n（她停了一下。）\n他說得對。他的每一句話都對。但我不知道為什麼——每次聽完我都覺得更累了。',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家提及鏡子
  if (hasAny(input, ['鏡子', '鏡面', '鏡中', '倒影', '反射'])) {
    if (depth >= 3) {
      return {
        dialogue: '（她看著鏡面，上面還留著那張口紅畫的笑臉。邊角已經有些剝落了。）\n這張笑臉是我畫的。但那張哭臉——是我。\n（她伸出手，第一次沒有擦掉那張笑臉，而是輕輕碰了一下淚痕。）\n我以前覺得這兩張臉只能存在一張。但現在我在想……也許它們都在才是我。',
        dictionaryHint: '真正的修復不是消滅痛苦的那一面，而是學會讓不同面貌和平共存。',
        safetyLevel: 'safe' as const,
      };
    }
    if (depth >= 2) {
      return {
        dialogue: '你知道嗎？我每天化妝的時候，會花最久時間在嘴巴上。\n（她對鏡子調整嘴角弧度，像在調一個壞掉的開關。）\n不是因為口紅難畫——是因為畫完之後，這個弧度就變成今天唯一的選項了。\n嘴巴說：上揚。眼睛說：我想往下。然後他們就吵架。一整天的。',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: '（她對鏡子練習了一個笑容，停了一拍，又換了一種角度。）\n你看！這樣笑是不是比較自然？要有真實感，觀眾才會買帳～\n（她練習了第三次。第四次。第五次。每一次都像第一次。每一次都不夠。）',
      safetyLevel: 'safe' as const,
    };
  }

  // 玩家問她開不開心 / 難不難過
  if (hasAny(input, ['開心嗎', '快樂嗎', '難過', '傷心', '悲傷', '痛苦', '真的開心'])) {
    if (depth >= 2) {
      return {
        dialogue: '（她沉默了很長一段時間。長到後台的燈泡閃了一下。）\n我已經……不太記得了。不開心是什麼感覺。開心又是什麼感覺。\n（她的聲音很輕，像紙頁之間夾著的一片灰塵。）\n掌聲之後，只剩空白。我覺得自己像一支口紅——所有人都只看見我畫出來的笑臉。沒有人問過那支口紅會不會痛。',
        dictionaryHint: '長期壓抑真實情感會導致情緒鈍化——不是在演，是真的感覺不到了。',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: '開心？當然開心啊！我有一整個劇場的人等著我逗他們笑呢！\n（她笑著說。鏡子的角落裡，那支口紅的影子輕輕晃了一下。）',
      safetyLevel: 'safe' as const,
    };
  }

  // depth >= 3 的默認回覆
  if (depth >= 3) {
    return {
      dialogue: '（她坐在鏡子前，沒有在練習笑容。她的手指輕輕敲著化妝檯，節奏和以前不一樣了——不再是為了取悅誰而精準計算的節拍，而是像雨滴落在窗臺上那種隨機、溫柔的閒置。）\n\n「我以前覺得空白是一種失敗。但現在——空白裡面其實有所有還沒說出來的話。它只是還沒開始，不是沒有。」',
      safetyLevel: 'safe' as const,
    };
  }

  // depth >= 2 的默認回覆
  if (depth >= 2) {
    return {
      dialogue: '（她看著鏡子，嘴角的弧度往下掉了零點幾毫米。）\n你聽過一句話嗎？「台下可以流淚，台上必須微笑。」這是我從小被教到大的話。\n（她的手指沿著化妝檯的邊緣來回摩擦。）\n我現在想知道——如果台上台下都是同一個人的話，這句話到底要放在哪裡？',
      safetyLevel: 'safe' as const,
    };
  }

  // depth >= 1 的默認回覆
  if (depth >= 1) {
    return {
      dialogue: '（她翻著那本厚厚的笑話集，一頁一頁。）\n你知道什麼段子最難寫嗎？不是不好笑的那種——是寫出來之後，你自己第一個笑不出來的那種。\n（她停在某一頁，沒有唸出來。只是看著它。）',
      safetyLevel: 'safe' as const,
    };
  }

  // 預設回覆
  return {
    dialogue: playerTurns <= 1
      ? '（她從鏡子裡看到你，眨了眨眼，然後就像被打開了開關一樣——）\n歡迎來到蕾娜的後台！這裡不常有人來，你可以隨便坐～雖然只有一張椅子，還是我在坐的。哈哈哈！'
      : '（她又練習了兩個微笑的版本，然後才轉過來。）\n如果你不知道要說什麼的話——我可以講一個段子給你聽？剛寫好的，還沒有人聽過。',
    safetyLevel: 'safe' as const,
  };
}

// ---- 視覺登記 ----

const visualRegistry = {
  floatingTextsByLayer: {
    1: [
      '今晚，笑聲無限！',
      '掌聲與喝采，閃耀全場！',
      '她的舞台，屬於歡樂！',
      '笑聲是最好的掌聲！',
      '歡笑交織的奇幻時刻！',
    ],
    2: [
      '我只能笑，不能哭。',
      '對不起，爸爸……',
      '「你必須完成脫口秀。」',
      '時針停在那一小時。',
      '第一排的座位永遠空著。',
    ],
    3: [
      '我忘了怎麼哭。',
      '笑，是唯一的命令。',
      '這笑臉不是我。',
      '掌聲之後，只剩空白。',
      '要笑！要笑！要笑！！！',
      '哈哈哈哈哈……',
    ],
    4: [
      '如果不笑的話，我還剩下什麼？',
      '有些頁面，本來就該是空的。',
      '人不笑也沒關係。',
      '謝謝你沒有急著修好我。',
      '我可以在這裡垮掉嗎？',
    ],
  },
  pinCoordinates: {
    // Layer 1 (歡笑劇場)
    spotlight_stage: { top: '28%', left: '50%' },
    audience_seats: { top: '72%', left: '24%' },
    applause_banner: { top: '14%', left: '78%' },
    joke_scripts_desk: { top: '48%', left: '18%' },
    // Layer 2 (休息室的電話)
    hospital_phone: { top: '30%', left: '48%' },
    backstage_mirror: { top: '22%', left: '76%' },
    frozen_clock: { top: '14%', left: '24%' },
    dressing_room_door: { top: '68%', left: '82%' },
    contract_papers: { top: '78%', left: '18%' },
    // Layer 3 (休息室的鏡子前)
    lipstick_mirror: { top: '36%', left: '50%' },
    tearful_reflection: { top: '54%', left: '22%' },
    flying_masks: { top: '18%', left: '68%' },
    broken_shards: { top: '78%', left: '50%' },
    tissue_box_corner: { top: '82%', left: '80%' },
    // Layer 4 (無鏡的房間)
    empty_frame: { top: '40%', left: '50%' },
    sofa_chair: { top: '68%', left: '28%' },
    faded_poster: { top: '24%', left: '76%' },
    clean_lip_balm: { top: '62%', left: '76%' },
  },
};

// ---- NpcDefinition 匯出 ----

export const renaDefinition: NpcDefinition = {
  id: 'rena',
  characterCard: renaCard,
  lorebook: renaLorebook,
  repairTipRules,
  simulateReply: simulateRenaReply,
  openingsByDepth,
  ending,
  visualRegistry,
  thresholds: {
    knowledgeRequired: 80,
    trustRequired: 50,
  },
  initialState: {
    trust: 10,
    stress: 90,
  },
};

// ---- 字典條目（蕾娜專屬） ----

export const renaDictionary = [
  {
    id: 'smiling_depression',
    name: '微笑抑鬱症',
    description: '一種在社交場合強撐開朗、用笑容掩蓋真實情緒的心理狀態。蕾娜將「逗笑他人」等同於「自己有價值」，從而失去了表達悲傷、疲倦等自然情緒的能力。',
    relatedClues: ['joke_book', 'show_poster'],
    unlockCondition: 'joke_book',
  },
  {
    id: 'masked_grief',
    name: '被壓抑的哀傷',
    description: '蕾娜從未真正為父親的離世哀悼。經紀人的那句「你必須完成脫口秀」等同於一道禁令：不准悲傷。從此她的表情只剩大笑，像一個壞掉的開關。',
    relatedClues: ['obituary_clip'],
    unlockCondition: 'obituary_clip',
  },
  {
    id: 'performing_self',
    name: '表演型自我',
    description: '她用那支父親送的亮紅色口紅，在鏡子上畫出誇張的笑臉來遮住流淚的倒影。久而久之，她已經分不清哪張臉才是真正的自己——是鏡中的哭臉，還是口紅畫出來的笑臉。',
    relatedClues: ['dried_lipstick'],
    unlockCondition: 'dried_lipstick',
  },
  {
    id: 'identity_bound_to_others',
    name: '依附於他人的自我價值',
    description: '蕾娜將「讓別人快樂」當作唯一的存在理由。如果她不笑了，她不知道自己還剩什麼。真正的修復不是幫她找回笑容，而是讓她知道：不笑的時候，她也值得被看見。',
    relatedClues: ['show_poster', 'joke_book'],
    unlockCondition: 'show_poster',
  },
];

// ---- 餘波匯報（AftermathReport 文案） ----

export const renaAftermath = {
  title: '靈魂軌跡：喜劇演員蕾娜',
  labels: {
    cliffHand: '鏡中伸出的手',
    backTurned: '空蕩的第一排',
    lastSmile: '口紅畫出的邊界',
    labelTexts: {
      cliffHand_high: '她從鏡子裡看著你，沒有急著笑。',
      cliffHand_low: '她還在練習笑容的角度。',
      backTurned_failed: '第一排的座位永遠空了。',
      backTurned_other: '她把第一排的票收進了抽屜深處。',
      lastSmile_success: '她說：有些頁面本來就該是空的。',
      lastSmile_other: '那支口紅還沒有轉回去。',
    },
  },
  conclusion: '一個人花了整個職業生涯練習同一種表情，把掌聲當作唯一證明自己存在的方式。但你沒有跟著笑——也沒有叫她不要再笑了。你只是坐在後台的角落，讓她發現：不笑的時候，房間裡還有另一個人。現實中的觀眾依然期待笑聲，但她開始在鏡子前練習一種新的表情——不確定的，但不需要排練了。',
  paragraphs: {
    successDepth3: '鏡子裡那張口紅畫的笑臉邊角開始剝落，露出底下真正的面容。聚光燈還在，劇場還在，但她已經不需要用笑話填滿每一秒的安靜。你聽完了她最不好笑的故事——從父親那通沒接到的電話，到經紀人那句「你必須上台」。她說出來的那一刻，燈光沒有熄滅，觀眾沒有離場。只是後台的鏡子裡，淚痕終於比笑臉更清晰。',
    successDepth2: '電話還懸在半空，嘟聲還在響。你聽見的不只是斷線的通話，還有掛斷之後那三十分鐘——她在鏡子前把口紅擰開，畫了整張笑臉，卻怎麼也蓋不住鏡中那張正在流淚的臉。你沒有伸手去擦，也沒有說「會好的」。就只是站在旁邊，讓那通電話的餘音自己慢慢散去。',
    successDepth1: '你走進了她的劇場，聽見了掌聲和笑聲和「全場笑聲保證」的海報標語。舞台上的她光芒萬丈，但回到後台之後，她沒有像往常那樣立刻開始練習下一場的笑容。她看了你一眼，猶豫了一下——不是拒絕，而是不知道該用什麼表情面對一個沒有在笑的人。',
    failed: '她的笑容更亮了——亮到像一面擦得太乾淨的鏡子，什麼都映不出來。你說了一句她聽過無數遍的話：也許是加油，也許是做自己，也許是你可以不用笑的。話本身沒有錯，但對她來說，任何關於「該怎麼做」的句子聽起來都像另一張節目表。後台燈終於熄了。口紅始終沒有轉回去。',
    none: '後台的鏡子還亮著。那張口紅畫的笑臉依然掛在上面，邊角還沒有開始剝落。她在鏡子前站著——沒有練習笑容，但也沒有伸手卸掉它。空氣裡有一種猶豫，像聚光燈剛打開、還沒有找到目標的那幾秒。她需要一個人，不是來關燈的，也不是來喊安可的。',
    innerDepth3: '你站在那面畫著笑臉的鏡子前。口紅的痕跡已經斑駁，底下是一張正在安靜流淚的臉。她沒有急著擦掉那張笑臉，也沒有急著擦掉眼淚——兩張臉同時在鏡面上共存，像一個她花了半輩子才敢承認的事實。',
    innerDepth2: '電話的嘟聲在休息室裡無限循環。你聽到的不是「父親去世」的新聞，而是掛斷之後，經紀人站在門外說的那句話：「你必須完成脫口秀。」從此她的表情只剩一個選項。你站在門內，沒有說話，但你的沉默比外面的任何掌聲都更靠近她。',
    innerDepth1: '劇場座無虛席，笑聲一波接一波。你坐在觀眾席裡，和其他人一起，看著她在台上發光。但對她來說，台下的每一張臉都長得一模一樣——包括你的。你和其他觀眾沒有區別，而這比空無一人更孤獨。',
  },
};
