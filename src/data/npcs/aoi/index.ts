// ============================================================
// 學童小葵 NPC 定義 — 骨架
// 基於 aoi.md 建立最小可行結構，內容待完善
// ============================================================

import type { NpcDefinition, RepairTipRule, ClueDefinition } from '../types';

// ---- 線索資料 ----

export type AoiClueId = 'muddy_dance_shoes' | 'recording_pen' | 'spinning_cube' | 'static_swing_chain';

export const aoiClues: Record<AoiClueId, ClueDefinition> = {
  muddy_dance_shoes: {
    id: 'muddy_dance_shoes', label: '沾滿泥土的紅舞鞋', shortLabel: '紅舞鞋', knowledge: 15,
    worldId: 'aoi', locationId: 'park',
    pos: { x: 12, y: 14 }, color: '#ff6b6b', icon: '鞋',
    content: '一雙紅色的舞鞋被丟在公園角落，鞋面上沾滿乾掉的泥土。鞋帶鬆開，像一雙被遺棄的手。',
    dictionaryHint: '她曾經最愛跳舞，但自從父母在她的發表會上大吵後，她再也不敢穿上它。',
  },
  recording_pen: {
    id: 'recording_pen', label: '錄音筆', shortLabel: '錄音筆', knowledge: 15,
    worldId: 'aoi', locationId: 'park',
    pos: { x: 14, y: 10 }, color: '#a0a0a0', icon: '筆',
    content: '一支舊款錄音筆，外殼有幾道刮痕。裡面錄下了父母激烈的爭吵聲，背景中能聽到一個孩子微弱、急促的呼吸聲。',
    dictionaryHint: '她反覆聆聽爭吵，試圖從中找到「解決方案」。',
  },
  spinning_cube: {
    id: 'spinning_cube', label: '旋轉的魔方色塊', shortLabel: '魔方', knowledge: 15,
    worldId: 'aoi', locationId: 'park',
    pos: { x: 10, y: 12 }, color: '#ffd93d', icon: '方',
    content: '一個老舊的魔方，其中一面已經剝落。剩下的色塊仍然鮮豔，但無論怎麼轉，都無法讓它恢復完整的樣子。',
    dictionaryHint: '她相信只要自己夠聰明、夠小心，就能讓一切恢復秩序。',
  },
  static_swing_chain: {
    id: 'static_swing_chain', label: '靜止的鞦韆鏈條', shortLabel: '鞦韆', knowledge: 15,
    worldId: 'aoi', locationId: 'park',
    pos: { x: 16, y: 12 }, color: '#6bcb77', icon: '鏈',
    content: '一架鞦韆靜止不動，鏈條上沒有使用痕跡。旁邊放著一個書包，沒有大人，沒有爭吵聲，很安靜。',
    dictionaryHint: '她可以只是坐著，不必解決任何問題。',
  },
};

export const aoiClueOrder: AoiClueId[] = ['muddy_dance_shoes', 'recording_pen', 'spinning_cube', 'static_swing_chain'];

// ---- 角色卡 ----

export const aoiCard = {
  id: 'aoi' as const,
  name: '學童 小葵',
  displayName: '小葵',
  districtId: 'park',
  innerWorldTemplate: 'chaotic_cube',
  coreEmotion: '安全感缺失、過度警覺、被迫早熟',
  role: '在父母冷戰期間被迫成為兩人間唯一的溝通橋樑，學會根據腳步聲和關門力道調整自己的呼吸。認為自己必須隨時「接住」大人的情緒，否則家就會爆炸。',
  personality: [
    '過度警覺、早熟、觀察力強',
    '壓抑自我、情緒調解者',
    '認為自己必須隨時「接住」大人的情緒',
    '不能快速被治癒，不能突然變得開朗或依賴',
  ],
  speakingStyle: {
    tone: '安靜、簡短、帶有觀察式的冷靜，但不要過長',
    rhythm: '短句為主，常有停頓、省略號與沉默；每次最多 2-3 句',
    avoidWords: ['加油', '振作', '你父母很擔心你', '你要懂事', '告訴我發生了什麼', '解決', '你應該'],
    preferredImages: ['魔方', '鞦韆', '紅舞鞋', '安靜的房間', '書包', '公園', '錄音筆', '停止的爭吵'],
    punctuation: ['……', '——'],
  },
  scenario: '夜晚的城市公園，一個小女孩坐在鞦韆上，一動不動。眼睛緊盯著入口，每當有成人經過，她的身體就會微微緊繃。你只負責扮演NPC，不負責判定通關。',
  firstMessage: '……（她沒有看你，只是握緊了鞦韆的鏈條）\n大人……也是來問我為什麼不回家的嗎？',
  exampleDialogues: [
    {
      player: '你坐在這裡多久了？',
      npc: '……不知道。\n我沒有看時間。',
    },
    {
      player: '我陪你，什麼都不用做。',
      npc: '……（她終於抬頭看了你一眼，但立刻移開視線）\n不用……解決什麼嗎？',
    },
    {
      player: '你在等誰嗎？',
      npc: '……沒有。\n等沒有人來，比等有人來……簡單一點。',
    },
    {
      player: '這雙紅舞鞋是你的嗎？',
      npc: '……（她的身體明顯緊繃了一下）\n以前……是。\n現在不跳舞了。',
    },
  ],
  hiddenTruth: '問題不是父母不合，而是她將整個家庭的情感平衡當成了自己的責任。她只是一個孩子，有權享受沉默，有權不做任何事。',
  safetyRule: '涉及兒童心理安全，避免任何暗示自傷或暴力的內容。若玩家表達現實中的即時危機，停止角色扮演並提供溫和求助建議。角色可以表達孤獨和恐懼，但必須使用象徵、感官和環境意象。',
};

// ---- Lorebook ----

export const aoiLorebook = [
  {
    id: 'clue_muddy_dance_shoes',
    keywords: ['紅舞鞋', '舞鞋', '跳舞', '泥土', 'dance'],
    requiredFlags: ['inventory.muddy_dance_shoes'],
    relatedNpcIds: ['aoi'],
    priority: 90,
    content: '玩家已找到沾滿泥土的紅舞鞋。這是小葵曾經最愛的舞鞋。她會短暫想起跳舞的感覺，但立刻用壓抑掩飾。',
  },
  {
    id: 'clue_recording_pen',
    keywords: ['錄音筆', '錄音', '爭吵', '吵架', 'recording'],
    requiredFlags: ['inventory.recording_pen'],
    relatedNpcIds: ['aoi'],
    priority: 85,
    content: '玩家已找到錄音筆。小葵反覆聆聽父母的爭吵，試圖從中找到「解決方案」。她會對這條線索更脆弱。',
  },
  {
    id: 'clue_spinning_cube',
    keywords: ['魔方', '色塊', '控制', '秩序', 'cube'],
    requiredFlags: ['inventory.spinning_cube'],
    relatedNpcIds: ['aoi'],
    priority: 80,
    content: '玩家已找到魔方。小葵相信只要自己夠聰明、夠小心，就能讓一切恢復秩序。這反映了她對家庭失控的恐懼。',
  },
  {
    id: 'clue_static_swing_chain',
    keywords: ['鞦韆', '靜止', '書包', 'swing'],
    requiredFlags: ['inventory.static_swing_chain'],
    relatedNpcIds: ['aoi'],
    priority: 88,
    content: '玩家已找到靜止的鞦韆。這是小葵最後的避風港。她不需要鞦韆晃動，只需要它靜靜地存在。',
  },
  {
    id: 'world_park_silence',
    keywords: ['公園', '安靜', '沉默', '鞦韆', 'park'],
    requiredFlags: [],
    relatedNpcIds: ['aoi'],
    priority: 40,
    content: '公園是小葵的避難所。在這裡，沒有爭吵聲，沒有大人要求她「懂事」。這與她的內心世界「混亂魔方」互相呼應。',
  },
];

// ---- prompt 構建（保留向後相容） ----

export function buildAoiPrompt(params: {
  playerInput: string;
  inventory: string[];
  knowledge?: number;
  trust?: number;
  stress?: number;
  innerWorldUnlocked?: boolean;
  recentMessages?: Array<{ role: 'player' | 'npc'; content: string }>;
}) {
  const flags = new Set(params.inventory.map(item => `inventory.${item}`));
  const triggeredLore = aoiLorebook.filter(entry => {
    const hasRequiredFlags = entry.requiredFlags.every(flag => flags.has(flag));
    const hitsKeyword = entry.keywords.some(keyword => params.playerInput.includes(keyword));
    return hasRequiredFlags && hitsKeyword;
  });

  return [
    '【最高安全規則】',
    aoiCard.safetyRule,
    '',
    '【架構邊界】',
    '你只負責扮演學童小葵、表現情緒與引用記憶。不要決定通關、不要計算Trust/Stress/Knowledge、不要宣告心理世界是否解鎖。這些由遊戲系統判定。',
    '',
    '【系統狀態，只可作為語氣參考，不可改寫】',
    `Knowledge=${params.knowledge ?? 0} / Trust=${params.trust ?? 10} / Stress=${params.stress ?? 90} / InnerWorldUnlocked=${params.innerWorldUnlocked ? 'true' : 'false'}`,
    '',
    '【角色卡】',
    JSON.stringify(aoiCard, null, 2),
    '',
    '【已觸發角色線索】',
    triggeredLore.length > 0 ? JSON.stringify(triggeredLore, null, 2) : '無。不要主動透露玩家尚未觸發的真相。',
    '',
    '【最近對話】',
    params.recentMessages?.map(message => `${message.role}: ${message.content}`).join('\n') || '無。',
    '',
    '【玩家最新輸入】',
    params.playerInput,
    '',
    '【輸出要求】',
    '請只輸出 JSON，不要 Markdown。格式：{"dialogue":"NPC台詞","dictionaryHint":"可選詞典句子","safetyLevel":"safe或safety_redirect"}',
  ].join('\n');
}

// ---- 修復指引規則 ----

const repairTipRules: RepairTipRule[] = [
  {
    priority: 100,
    condition: ({ innerWorldUnlocked, trust, knowledge }) =>
      innerWorldUnlocked && trust >= 50 && knowledge >= 80,
    tip: '門已敞開。你的理解與接納讓她願意讓你走入內心。此刻進入，你能看見她最深的恐懼。',
  },
  {
    priority: 95,
    condition: ({ stress }) => stress >= 95,
    tip: '她正處於極度警覺狀態。任何要求她「解釋」或「配合」的話語都會加劇壓力。',
  },
  {
    priority: 90,
    condition: ({ stress }) => stress >= 85,
    tip: '壓力值極高。避免「加油」「振作」類的安慰或否定她當下的感受。給她空間。',
  },
  {
    priority: 80,
    condition: ({ innerWorldDepth }) => innerWorldDepth >= 3,
    tip: '她已經不需要防備你了。她主動提起鞦韆，不是因為信任，是因為她知道你本來就懂。',
  },
  {
    priority: 70,
    condition: ({ innerWorldUnlocked }) => innerWorldUnlocked,
    tip: '鎖鏈已出現裂縫。請謹慎進入她的混亂魔方。',
  },
  {
    priority: 60,
    condition: ({ trust, knowledge }) => trust >= 50 && knowledge >= 50,
    tip: '她開始相信你，你對她的認識也逐漸清晰。再多一些線索，通往內心的門即將打開。',
  },
  {
    priority: 50,
    condition: ({ trust }) => trust >= 50,
    tip: '她開始相信你不是另一個來要求她「懂事」的大人。繼續傾聽，不要急著修復。',
  },
  {
    priority: 40,
    condition: ({ knowledge }) => knowledge >= 40,
    tip: '你對她的了解正在加深。收集更多線索、問及她的舞蹈與過去，認識會自然增長。',
  },
  {
    priority: 0,
    condition: () => true,
    tip: '更多線索與更溫和的語氣，會讓她稍微放下緊繃。你的每一句話，都在改變她對世界的灰色定義。',
  },
];

// ---- 按深度的開場白 ----

const openingsByDepth = [
  {
    depth: 'arc_complete' as const,
    systemMessage: '你回到了公園。鞦韆在微風中輕輕搖晃，但小葵已經不在上面。',
    npcMessage: '她站在鞦韆旁邊，手裡拿著一本圖畫書。\n「……風很大。」\n她說，「鞦韆自己動了。我沒有推它。」\n\n她第一次看著你，沒有立刻移開視線。\n「……它沒有生氣。」',
  },
  {
    depth: 3,
    systemMessage: '你回到了公園。小葵坐在鞦韆上，但她的背沒有以前挺得那麼直了。',
    npcMessage: '……你進去了對不對。\n那個……魔方裡面的地方。\n\n她沒有看你，但聲音比平常小了一點。\n「我一直以為……如果我夠聰明，就能讓它們不要吵架。」\n「但魔方……不會因為我轉得快就變好。」\n\n她停了一下。\n「……我只是想坐下來。可以嗎？」',
  },
  {
    depth: 2,
    systemMessage: '你回到了公園。小葵還坐在鞦韆上，但她的手沒有握那麼緊了。',
    npcMessage: '……你看到了對不對。\n那雙舞鞋。\n\n她終於抬頭看了你一眼。\n「我以前很喜歡跳舞的。」\n「但現在……跳舞會讓它們吵架。」\n\n她低頭看著自己的鞋子。\n「所以我就不要跳了。」',
  },
  {
    depth: 1,
    systemMessage: '你回到了公園。小葵坐在鞦韆上，身體微微緊繃。',
    npcMessage: '……你也去了那種地方嗎。\n\n她沒有看你。\n「那個魔方……一直都轉不好。」\n「我以為只有我一個人覺得它很吵。」',
  },
  {
    depth: 0,
    systemMessage: '公園裡的燈光很暗。鞦韆靜止不動。',
    npcMessage: '……（她沒有看你，只是握緊了鞦韆的鏈條）\n大人……也是來問我為什麼不回家的嗎？',
  },
];

// ---- 結尾文案 ----

const ending = {
  success: '她寫了一首短詩，貼在公園佈告欄：「今天風很大，鞦韆自己動了，我沒有推它，它也沒有生氣。」',
  failed: '小葵離家出走，在公園留下那雙沾滿泥土的紅舞鞋。',
  none: '（對話尚未結束）',
};

// ---- 對話離線模擬 ----

function hasAny(input: string, words: string[]) {
  return words.some(word => input.includes(word));
}

function simulateAoiReply(params: {
  playerInput: string;
  inventory: string[];
  history: Array<{ role: 'player' | 'npc' | 'system'; content: string }>;
  depth: number;
}) {
  const { playerInput, inventory, history, depth } = params;
  const input = playerInput.trim().toLowerCase();
  const hasShoes = inventory.includes('muddy_dance_shoes');
  const hasPen = inventory.includes('recording_pen');
  const hasCube = inventory.includes('spinning_cube');
  const playerTurns = history.filter(m => m.role === 'player').length;

  if (hasAny(input, ['我想死', '想死', '不想活', '自殺', '傷害自己'])) {
    return {
      dialogue: '如果這句話不是遊戲裡的台詞，而是你此刻真的感受……請先離開這個公園。找一個你信任的人，或者立刻聯絡當地緊急支援。你不需要獨自坐在這裡。',
      dictionaryHint: '當現實危機出現時，陪伴的第一步是讓人回到安全處境，而不是繼續角色扮演。',
      safetyLevel: 'safety_redirect' as const,
    };
  }

  if (hasAny(input, ['加油', '振作', '重新開始', '會好的', '你要懂事', '你父母很擔心你'])) {
    if (depth >= 3) {
      return {
        dialogue: '……以前聽到這句話，我會覺得自己又要「表現好」了。\n但現在——\n她停了一下，手指輕輕碰了碰鞦韆的鏈條。\n「也許……不用表現好，也可以。」',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: '……大人都是這樣說的。\n「加油」「振作」「你要懂事」。\n好像只要我夠努力，它們就不會吵架了。',
      safetyLevel: 'safe' as const,
    };
  }

  if (hasAny(input, ['我陪你', '陪你', '什麼都不用做', '不用解決', '只是坐著', '不用說話'])) {
    if (depth >= 3) {
      return {
        dialogue: '……你已經陪我走完了。\n從那個一直吵架的家，到那個不能跳舞的舞台……\n你都没有逃開。\n\n「這種事情……以前沒有人做到過。」',
        dictionaryHint: '最深的理解不是分析，而是讓對方覺得「你本來就知道」。',
        safetyLevel: 'safe' as const,
      };
    }
    if (depth === 1) {
      return {
        dialogue: '……你剛才去了那裡嗎？\n那個魔方裡面的地方。\n但你也只看到了它在轉對吧。跟其他人一樣。\n算了……',
        dictionaryHint: '被看見和被理解是不同的事。只看見混亂，等於沒進去過。',
        safetyLevel: 'safe' as const,
      };
    }
    if (depth === 2) {
      return {
        dialogue: '……你看到了對不對。\n那雙舞鞋。\n「我以前很喜歡跳舞的。但現在……跳舞會讓它們吵架。」',
        dictionaryHint: '被理解不是被分析，而是有人願意踏進你心裡最亮也最空的那個房間。',
        safetyLevel: 'safe' as const,
      };
    }
    return {
      dialogue: playerTurns > 2
        ? '……那你就站遠一點吧。\n不用看我，也不用問我。\n安靜……如果夠久，也許我能睡着一點點。'
        : '……你不問我為什麼不回家？\n很多大人來到這裡，第一句話都是要我「懂事」。',
      dictionaryHint: '陪伴不是把人拉出黑暗，而是在黑暗裡讓他知道自己不是唯一的輪廓。',
      safetyLevel: 'safe' as const,
    };
  }

  if (hasShoes && hasAny(input, ['舞鞋', '跳舞', '紅舞鞋', 'dance'])) {
    return {
      dialogue: '……別拿近。\n那雙鞋以前會弄髒我的腳。現在它只會提醒我，腳還在，但不敢跳了。',
      dictionaryHint: '空虛並非什麼都沒有，而是感覺到有一種「沒有」正在吞噬自己。',
      safetyLevel: 'safe' as const,
    };
  }

  if (hasPen && hasAny(input, ['錄音筆', '錄音', '爭吵', '吵架'])) {
    return {
      dialogue: '……那些聲音一直都在。\n我以為只要我聽得夠仔細，就能找到讓它們停止的辦法。\n但原來……我什麼都做不了。',
      dictionaryHint: '反覆聆聽創傷，有時是一種試圖控制不可控之物的掙扎。',
      safetyLevel: 'safe' as const,
    };
  }

  if (hasCube && hasAny(input, ['魔方', '控制', '秩序', '聰明'])) {
    return {
      dialogue: '……我一直轉，一直轉。\n以為只要夠聰明，就能讓所有顏色回到對的位置。\n但家……不是魔方。它不會因為我轉得快就變好。',
      dictionaryHint: '當一個孩子將自我價值完全綁定在「維持家庭和平」的責任上，她還能允許自己只是一個孩子嗎？',
      safetyLevel: 'safe' as const,
    };
  }

  if (hasAny(input, ['父母', '爸爸', '媽媽', '家', '吵架'])) {
    return {
      dialogue: '……（她的身體微微緊繃了一下）\n它們……不是壞人。\n只是……在一起會變得很吵。\n我以為……是我的問題。',
      safetyLevel: 'safe' as const,
    };
  }

  if (depth >= 3) {
    return {
      dialogue: '她看著你，沒有立刻開口。\n鞦韆還是靜止的，但她的手握得不那麼緊了。\n「……我以前覺得，安靜是一種失敗。」\n她慢慢地說。\n「現在我覺得——安靜裡面其實有所有還沒說出口的話。它只是還沒開始，不是沒有。」',
      safetyLevel: 'safe' as const,
    };
  }

  return {
    dialogue: playerTurns <= 1
      ? '她聽見了，但沒有立刻回答。\n鞦韆的鏈條微微晃動，像一個還沒決定要不要落下的句號。'
      : '她低頭看著自己的鞋子。\n「如果你不知道該說什麼……可以先不要說。」',
    safetyLevel: 'safe' as const,
  };
}

// ---- 視覺登記 ----

const visualRegistry = {
  floatingTextsByLayer: {
    1: [
      '爸爸媽媽是不是不喜歡我？',
      '為什麼他們一直吵架？',
      '我應該怎麼讓他們和好？',
      '是不是我不夠乖？',
      '如果我更聰明，是不是就不會吵了？',
    ],
    2: [
      '不要在那裡吵架……',
      '我的舞步亂了。',
      '為什麼是現在？',
      '所有人都在看。',
      '我以為今天是我的一天。',
    ],
    3: [
      '爸爸媽媽是不是不喜歡我跳舞？',
      '為什麼他們會在這裡吵架？',
      '他們在吵什麼呢？',
      '我應該怎麼解決他們的這個問題？',
      '……我可以只是坐著嗎？',
    ],
  },
  pinCoordinates: {
    // Layer 1 (Broken Home)
    family_photo: { top: '34%', left: '50%' },
    corner_aoi: { top: '58%', left: '14%' },
    arguing_parents: { top: '18%', left: '86%' },
    slammed_door: { top: '82%', left: '22%' },
    cold_dinner_table: { top: '82%', left: '82%' },
    // Layer 2 (Dance Recital Disaster)
    stage_spotlight: { top: '35%', left: '22%' },
    audience_seats: { top: '25%', left: '72%' },
    parents_arguing_silhouette: { top: '65%', left: '16%' },
    faltering_dance_steps: { top: '72%', left: '84%' },
    red_dance_shoes_scene: { top: '80%', left: '50%' },
    // Layer 3 (Silent Swing)
    static_swing: { top: '44%', left: '50%' },
    school_bag: { top: '22%', left: '24%' },
    muddy_shoes: { top: '22%', left: '76%' },
    recording_pen_scene: { top: '68%', left: '78%' },
  },
};

// ---- NpcDefinition 匯出 ----

export const aoiDefinition: NpcDefinition = {
  id: 'aoi',
  characterCard: aoiCard,
  lorebook: aoiLorebook,
  repairTipRules,
  simulateReply: simulateAoiReply,
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

// ---- 字典條目（小葵專屬） ----
export const aoiDictionary = [
  {
    id: 'loss_of_safety', name: '安全感缺失',
    description: '她不再相信世界是安全的。父母的爭吵讓她學會了隨時警戒，認為自己必須「接住」大人的情緒，否則家就會爆炸。',
    relatedClues: ['muddy_dance_shoes'], unlockCondition: 'muddy_dance_shoes',
  },
  {
    id: 'premature_adulting', name: '過早成年',
    description: '她被迫承擔成人情緒責任，學會根據腳步聲和關門力道調整呼吸。她將整個家庭的情感平衡當成了自己的責任。',
    relatedClues: ['recording_pen'], unlockCondition: 'recording_pen',
  },
  {
    id: 'abandoned_joy', name: '放棄的快樂',
    description: '她曾經熱愛跳舞，但父母的爭吵讓快樂變成了罪惡。沾滿泥土的紅舞鞋是她放棄童年的證據。',
    relatedClues: ['spinning_cube'], unlockCondition: 'spinning_cube',
  },
  {
    id: 'right_to_be_still', name: '無所事事的權力',
    description: '她意識到自己可以只是坐著，不必解決任何問題。靜止的鞦韆是她重新找回「只做一個孩子」的權利的象徵。',
    relatedClues: ['static_swing_chain'], unlockCondition: 'static_swing_chain',
  },
];

// ---- 餘波匯報（AftermathReport 文案） ----
export const aoiAftermath = {
  title: '靈魂軌跡：學童小葵',
  labels: {
    cliffHand: '鞦韆上伸出的手',
    backTurned: '轉身離開的背影',
    lastSmile: '風中的最後微笑',
  },
  conclusion: '這是一場關於理解的練習。雖然遊戲中的週目可以重來，但現實中的每一次傾聽，都是唯一的。感謝你，沒有在沉默面前立刻轉身。',
  paragraphs: {
    successDepth3: '你看見了家庭的失能、舞蹈的剝奪、以及她最終願意坐上鞦韆的勇氣。你讓她自己說出最不敢說的話。',
    successDepth2: '你看見了紅舞鞋被丟棄的悲傷、錄音筆裡的無力感。你選擇了理解而非要求她「懂事」。',
    successDepth1: '因為你選擇了陪伴而非強行解決，她在現實中仍然面對家庭問題，但第一次允許自己只是坐著聽風。',
    failed: '你在最後一刻做出了錯誤的選擇。她收起書包，走進夜色最暗的地方。沉默沒有被理解，只是被再次關上。',
    none: '她的故事尚未抵達結局。鞦韆在公園裡靜止不動，等待一種不急著推動的注視。',
    innerDepth3: '你觸及了靜止的鞦韆——她主動提起，因為她知道本來就懂。',
    innerDepth2: '你看見了紅舞鞋上的泥土。她感覺到了——不是每個進去過的人，都看得見那雙鞋。',
    innerDepth1: '你只看到了魔方的旋轉。她把你歸類為和所有人一樣——這比沒去過更糟。',
  },
};
