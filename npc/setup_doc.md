# NPC 新增完整設定指南

> 適用版本：Suderlight（《情緒修復師：微光城市》）v1.1+  
> 參考範例：天橋畫家 (bridge_artist / 已完成) · 小葵 (aoi / 已完成)  
> **架構更新**：自 v1.1 起，每個 NPC 的表世界與心理世界資料獨立存放，`OuterWorldExplorer.tsx` 改為通用協調器，透過 `outerWorlds/index.ts` 註冊中心動態載入。

---

## 總覽

新增一個可遊玩的 NPC 需要以下七大步驟，涉及 **後端 (cloud-functions)** 和 **前端 (src/data + src/ui)** 兩個範疇：

> **架構原則**：自 v1.1 起，每個 NPC 的**表世界**資料獨立存放在 `src/data/outerWorlds/<npc>/`，**心理世界**資料獨立存放在 `src/data/psychologicalWorlds/<npc>/`。`OuterWorldExplorer.tsx` 不再硬編碼 NPC 專屬邏輯，而是透過 `outerWorlds/index.ts` 註冊中心動態載入對應的世界模組。

> **階段性 Git Commit 建議**：每完成一個大步驟（1–7），執行一次 `git add -A && git commit -m "feat: add <npcId> — <step description>"`。這樣可以在出錯時快速回滾，也方便 Code Review。

| # | 範圍 | 說明 | 檔案數 | 建議 Commit 訊息 |
|---|------|------|--------|-----------------|
| 1 | NPC 定義 | 角色卡、NpcId 類型、註冊中心 | 3 | `feat: add <npcId> — NPC definition & registry` |
| 2 | 線索系統 | 線索定義、收集邏輯、線索 ID 聯合類型 | 2 | `feat: add <npcId> — clue system & verticalSlice` |
| 3 | 心理世界 | 四層情感弧線 + 可互動物件 | 1+ | `feat: add <npcId> — psychological world layers` |
| 4 | 表世界地圖 | 等角地圖：建築、道路、碰撞、實體 | 2 | `feat: add <npcId> — outer world map & teleport` |
| 5 | NPC 狀態引擎 | 對話評估規則、初始狀態、關鍵詞 | 1 | `feat: add <npcId> — state engine & dialogue evaluation` |
| 6 | 後端資料 | 線索、心理世界、NPC 狀態、Prompt | 5 | `feat: add <npcId> — backend data sync` |
| 7 | UI 整合 | 心理世界視覺、地圖實體互動、傳送點、存檔 | 3+ | `feat: add <npcId> — UI integration & testing` |

---

## 第一步：NPC 定義與註冊

### 1.1 定義 NpcId 類型

**檔案**: `src/data/verticalSlice.ts`

在 `NpcId` 聯合類型中加入新 ID：
```ts
export type NpcId = 'bridge_artist' | 'victor' | 'your_new_npc';
```

### 1.2 建立 NPC 資料目錄

在 `src/data/npcs/` 下建立新目錄（例如 `yourNewNpc/`），包含 `index.ts`。

**檔案**: `src/data/npcs/yourNewNpc/index.ts`

必須匯出一個完整的 `NpcDefinition` 物件，結構如下：

```ts
import type { NpcDefinition, RepairTipRule, ClueDefinition } from '../types';

export const yourNewNpcDefinition: NpcDefinition = {
  id: 'your_new_npc',
  characterCard: { /* 詳見 1.3 */ },
  lorebook: [ /* 詳見 2.2 */ ],
  repairTipRules: [ /* 詳見 5.2 */ ],
  simulateReply: simulateYourNpcReply,  // 離線對話模擬函數
  openingsByDepth: [ /* 詳見 1.5 */ ],
  ending: { /* 詳見 1.6 */ },
  visualRegistry: { /* 詳見 3.4 */ },
  thresholds: { knowledgeRequired: 80, trustRequired: 50 },
  initialState: { trust: 10, stress: 90 },
};
```

### 1.3 角色卡 (characterCard)

必須包含以下欄位（完整型別見 `src/data/npcs/types.ts` 的 `NpcCharacterCard`）：

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | `NpcId` | NPC 唯一 ID |
| `name` | `string` | 角色名稱（如「天橋畫家」） |
| `displayName` | `string` | 顯示名稱 |
| `districtId` | `string` | 所在區域標識 |
| `innerWorldTemplate` | `string` | 心理世界模板名 |
| `coreEmotion` | `string` | 核心情緒標籤 |
| `role` | `string` | 角色背景描述 |
| `personality` | `string[]` | 人格特徵列表 |
| `speakingStyle` | `NpcSpeakingStyle` | **必須是物件**，含 `tone`, `rhythm`, `avoidWords`, `preferredImages`, `punctuation` |
| `scenario` | `string` | 場景描述 |
| `firstMessage` | `string` | 初次見面開場白 |
| `exampleDialogues` | `Array<{player, npc}>` | 至少 4 組示例對話 |
| `hiddenTruth` | `string` | 隱藏真相 / 核心導引 |
| `safetyRule` | `string` | 安全規則 |

### 1.4 註冊 NPC

**檔案**: `src/data/npcs/registry.ts`

```ts
import { yourNewNpcDefinition } from './yourNewNpc';

const npcRegistry: Record<NpcId, NpcDefinition> = {
  bridge_artist: bridgePainterDefinition,
  victor: victorDefinition,
  your_new_npc: yourNewNpcDefinition,  // ← 新增
};
```

### 1.5 開場白 (openingsByDepth)

至少需要 5 組開場白，對應不同深度：

```ts
const openingsByDepth = [
  { depth: 'arc_complete', systemMessage: '…', npcMessage: '…' },
  { depth: 3, systemMessage: '…', npcMessage: '…' },
  { depth: 2, systemMessage: '…', npcMessage: '…' },
  { depth: 1, systemMessage: '…', npcMessage: '…' },
  { depth: 0, systemMessage: '…', npcMessage: '…' },
];
```

### 1.6 結尾文案 (ending)

```ts
const ending = {
  success: '成功結局描述…',
  failed: '失敗結局描述…',
  none: '（對話尚未結束）',
};
```

> ✅ **第一步完成後請執行**：
> ```bash
> git add -A && git commit -m "feat: add <npcId> — NPC definition & registry"
> ```

---

## 第二步：線索系統

### 2.1 定義線索 (ClueDefinition)

在 NPC 的 `index.ts` 中定義線索（建議 4 條，knowledge 總和 ≥ 50）：

```ts
export type YourNpcClueId = 'clue_1' | 'clue_2' | 'clue_3' | 'clue_4';

export const yourNpcClues: Record<YourNpcClueId, ClueDefinition> = {
  clue_1: {
    id: 'clue_1',
    label: '線索顯示名稱',
    shortLabel: '簡稱',
    knowledge: 10,          // 知識值獎勵 (10-15)
    worldId: 'your_new_npc',
    locationId: 'your_location_1',
    pos: { x: 16, y: 7 },  // 等角座標
    color: '#d4ffd4',       // 標記顏色
    icon: '圖',             // 圖示文字
    content: '玩家找到線索時顯示的敘述文字…',
    dictionaryHint: '情緒詞典提示…',
  },
  // … 其餘 3 條
};

export const yourNpcClueOrder = ['clue_1', 'clue_2', 'clue_3', 'clue_4'];
```

### 2.2 更新 verticalSlice.ts

**檔案**: `src/data/verticalSlice.ts`

```ts
import { yourNpcClues, yourNpcClueOrder, type YourNpcClueId } from './npcs/yourNewNpc/index';

export type ClueId = BridgeArtistClueId | VictorClueId | YourNpcClueId;
export { yourNpcClues, yourNpcClueOrder };
```

### 2.3 更新 gameStore.ts（多 NPC 線索收集）

**檔案**: `src/store/gameStore.ts`

在 `getNpcIdForClue` 函數中加入新 NPC 的線索判斷：
```ts
function getNpcIdForClue(clueId: ClueId): NpcId {
  if (clueId in bridgeArtistClues) return 'bridge_artist';
  if (clueId in victorClues) return 'victor';
  if (clueId in yourNpcClues) return 'your_new_npc';
  return 'bridge_artist';
}
```

### 2.4 更新線索查詢 (UI)

**檔案**: `src/ui/OuterWorldExplorer.tsx`

更新 `clueName` 函數、`CLUE_IMAGE_MAP`、及 `entities` 生成邏輯中的線索查詢 `(bridgeArtistClues as any)[clueId] ?? (victorClues as any)[clueId] ?? (yourNpcClues as any)[clueId]`

**檔案**: `src/ui/NarrativeDebugOverlay.tsx`, `src/ui/NarrativePlaytestDashboard.tsx`

同樣更新導入和查詢。

> ✅ **第二步完成後請執行**：
> ```bash
> git add -A && git commit -m "feat: add <npcId> — clue system & verticalSlice"
> ```

---

## 第三步：心理世界（四層情感弧線）

### 3.1 設計四層結構

| 層級 | 主題 | 象徵 | 互動物件數 |
|------|------|------|-----------|
| 1 | Success / Identity | 成就／身份認同 | 4-5 |
| 2 | Trauma | 創傷事件 | 5 |
| 3 | Collapse / Self-Punishment | 身份崩解／自我懲罰 | 5 |
| 4 | Acceptance | 接納／核心自我 | 4 |

### 3.2 建立心理世界資料目錄

**目錄**: `src/data/psychologicalWorlds/yourNewNpc/`

**檔案**: `src/data/psychologicalWorlds/yourNewNpc/index.ts`

每層是一個 `PsychLayerData` 物件，結構如下：

```ts
import type { PsychLayerData, PsychInteractable } from '../bridgePainter/index';

const layer1: PsychLayerData = {
  layerId: 'your_layer_1_id',
  layerNumber: 1,
  layerName: '層級名稱',
  symbol: '這層對應的心理主題',
  atmosphere: '氛圍描述文字…',
  sceneDescription: '場景描述文字…',
  emotionalForeword: '進入本層時的情緒引言…',
  playerUnderstanding: '本層完成後玩家的理解收穫…',
  interactables: [ /* PsychInteractable[] */ ],
  nextLayerThreshold: 25,   // 進入下一層需要的理解度門檻
  colorScheme: 'gold',       // 'gold' | 'cold' | 'faded' | 'void'
  maxUnderstanding: 40,      // 本層最大可獲得理解度
};
```

### 3.3 可互動物件 (PsychInteractable)

每個互動物件包含：

| 欄位 | 說明 |
|------|------|
| `id` | 唯一標識（對應 visualRegistry 中的 pin 座標） |
| `name` | 顯示名稱 |
| `category` | 分類標籤 |
| `row`, `col` | 網格位置 |
| `surfaceInfo` | 玩家第一眼看到的表面資訊 |
| `deepMessage` | 觀察後揭露的深層心理訊息 |
| `insight` | 玩家獲得 insight 後的簡短結論 |
| `reflectionChoices` | 反思選項（含正確/錯誤答案） |
| `understandingReward` | 理解度獎勵數值 (7-10) |

### reflectionChoices 設計規範

每個 `reflectionChoices` 必須包含 **4 個選項**，每個選項應該是：
- **更模糊、更意象化的關鍵詞語**（例如：「才華」、「消失」、「沉默」、「形狀」）
- **避免使用完整的判斷句或詳細解釋**（例如：不要寫「你應該接受自己的空白」或「這不是你的錯」）
- 4 個選項中只有 1 個是 `insight: true`（正確選項），其餘 3 個為 `insight: false`
- 正確選項的關鍵詞應該與該 NPC 的核心創傷主題產生隱晦共鳴，而不是直接說出答案

```ts
reflectionChoices: [
  { text: '才華', insight: false },      // 模糊詞語，觸碰但非正解
  { text: '消失', insight: true },      // 正確選項：與核心創傷共鳴
  { text: '沉默', insight: false },
  { text: '形狀', insight: false },
]
```

這種設計讓玩家必須透過**情感直覺**而非**邏輯推理**來選擇，強化心理世界的沉浸感。

### 3.4 視覺註冊 (visualRegistry)

在 NPC 定義中設定 `visualRegistry`：

```ts
const visualRegistry = {
  floatingTextsByLayer: {
    1: ['漂浮文字1', '漂浮文字2', /* … */],
    2: [ /* … */ ],
    3: [ /* … */ ],
    4: [ /* … */ ],
  },
  pinCoordinates: {
    // Layer 1 的互動物件座標（百分比定位）
    interactable_1: { top: '28%', left: '18%' },
    // Layer 2 …
    // Layer 3 …
    // Layer 4 …
  },
};
```

### 3.5 更新 PsychLayerId 聯合類型

**檔案**: `src/data/psychologicalWorlds/bridgePainter/index.ts`

將新 NPC 的 layer ID 加入聯合類型：
```ts
export type PsychLayerId =
  | "glory_gallery" | "accident_site" | "fading_maze" | "blank_frame_chamber"
  | "aroma_hall" | "accident_lab" | "faded_greenhouse" | "silent_soil"
  | "your_layer_1" | "your_layer_2" | "your_layer_3" | "your_layer_4";
```

### 3.6 註冊心理世界

**檔案**: `src/data/psychologicalWorlds/index.ts`

```ts
import { yourNpcPsychLayers } from './yourNewNpc/index';

const psychWorldRegistry: Record<NpcId, PsychLayerData[]> = {
  bridge_artist: ALL_PSYCH_LAYERS,
  victor: victorPsychLayers,
  your_new_npc: yourNpcPsychLayers,
};
```

### 3.7 心理世界視覺（UI）

**檔案**: `src/ui/NpcInnerWorld.tsx`

1. 在 `ComingSoonVisual` 中為新 NPC 加入主題視覺設定
2. 在渲染區塊中加入新 NPC 的條件分支（可參考 victor 的實作）

> ✅ **第三步完成後請執行**：
> ```bash
> git add -A && git commit -m "feat: add <npcId> — psychological world layers"
> ```

---

## 第四步：表世界地圖（等角地圖）

### 4.1 建立地圖資料目錄

**目錄**: `src/data/outerWorlds/yourNewNpc/`

每個 NPC 的表世界資料獨立存放。必須包含 `index.ts`（主資料檔），可選 `types.ts`（型別）。

**檔案**: `src/data/outerWorlds/yourNewNpc/index.ts`

必須匯出一個完整的 `OuterWorldModule` 物件，結構如下：

```ts
import type {
  Building, CollisionZone, ElevationFn, EntityTemplate, LocationDisplay, RoadDef,
} from '../types';
import type { Point } from '../bridgePainter/types';

// 建議：若與 bridgePainter 共用同一套等角座標系，直接 re-export 工具函數
import {
  MAP_WIDTH, MAP_HEIGHT, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, PLAYER_SPEED,
  clamp, lerp, isoToScreen, distance, getOffsetPos,
} from '../bridgePainter';

export {
  MAP_WIDTH, MAP_HEIGHT, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, PLAYER_SPEED,
  clamp, lerp, isoToScreen, distance, getOffsetPos,
} from '../bridgePainter';

// ---- 地圖描述 ----
export const locationDisplay: LocationDisplay = {
  id: 'your_location',
  name: '地圖名稱',
  subtitle: '副標題',
  description: '地圖描述…',
  ambient: '氛圍描述…',
};

// ---- 建築物 ----
export const buildings: Building[] = [
  {
    id: 'building_id',
    name: '建築名稱',
    locationId: 'your_location',
    pos: { x: 17, y: 5 },
    size: { x: 5, y: 4 },
    tall: 200,
    baseColor: '#37474f',
    windows: [
      { side: 'left', x: 0.1, y: 0.2, w: 0.2, h: 0.3 },
    ],
  },
];

// ---- 道路定義 ----
export const roadDefs = (locationId: string): RoadDef => {
  if (locationId !== 'your_location') return [];
  return [
    [{ x: 4, y: 8 }, { x: 19, y: 8 }, { x: 19, y: 10 }, { x: 4, y: 10 }],
  ];
};

// ---- 碰撞區域 ----
export const collisionZones: Record<string, CollisionZone> = {
  your_location: {
    id: 'your_location',
    walkableRegions: [
      { minX: 4.5, maxX: 19.0, minY: 8.5, maxY: 10.0 },
    ],
    maxX: 28,
    maxY: 22,
  },
};

// ---- 實體生成 ----
export function getEntities(ctx: {
  npcEnding: string;
  npcInnerWorldUnlocked: boolean;
  collectedClues: string[];
  locationId: string;
}): EntityTemplate[] {
  const list: EntityTemplate[] = [];
  if (ctx.locationId !== 'your_location') return list;

  // NPC 實體
  list.push({
    id: 'your_npc', label: 'NPC 名稱', type: 'npc',
    pos: { x: 13, y: 9 },
    color: ctx.npcEnding === 'success' ? '#7acc7a' : '#ffaa33',
    icon: ctx.npcEnding === 'success' ? '光' : '圖',
  });

  // 傳送點（雙向）
  list.push({
    id: 'skybridge_portal', label: '天橋', type: 'portal',
    pos: { x: 16, y: 14 }, color: '#ffaa33', icon: '🧭',
  });

  return list;
}

// ---- 海拔函數 ----
export function getElevation(_pos: Point): number { return 0; }

// ---- 互動邏輯 ----
export function getInteraction(
  entityId: string,
  ctx: {
    npcEnding: string;
    npcInnerWorldUnlocked: boolean;
    npcFlags: string[];
    collectedClues: string[];
    onOpenConversation: () => void;
    onEnterInnerWorld: () => void;
    onOpenArcFailure: () => void;
    onOpenReport: () => void;
    onShowModal: (modal: { title: string; content: string; actions?: Array<{ label: string; tone?: string; onClick: () => void }> } | null) => void;
  },
): { title: string; content: string; actions?: Array<{ label: string; tone?: string; onClick: () => void }> } | null {
  if (entityId === 'your_npc') {
    if (ctx.npcEnding === 'success') {
      return {
        title: '成功結局',
        content: '結局描述…',
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    return null; // 信號：開啟對話
  }
  return null;
}

// ---- 出入口 ----
export const getMaxX = (_locationId: string) => 28;
export const getMaxY = (_locationId: string) => 22;

// ---- 世界模組物件（註冊中心使用）----
export const yourNpcOuterWorld = {
  id: 'your_npc',
  mapWidth: 2400,
  mapHeight: 1600,
  tileW: 96,
  tileH: 48,
  originX: 1200,
  originY: 160,
  playerSpeed: 0.055,
  buildings,
  roadDefs,
  collisionZones,
  getEntities,
  locationDisplay,
  locationOffsets: {
    // 若其他地點的實體需要偏移顯示在此地圖上，可在此定義
    // skybridge: { x: 10, y: 6.5 },
  },
  getElevation,
  getMaxX,
  getMaxY,
  getInteraction,
};
```

### 4.2 建築物 (Building)

每個建築物是一個物件：

```ts
{
  id: 'building_id',
  name: '建築名稱',
  locationId: 'your_location',
  pos: { x: 17, y: 5 },
  size: { x: 5, y: 4 },
  tall: 200,                    // 高度（像素）
  baseColor: '#37474f',         // 基礎顏色
  windows: [
    { side: 'left', x: 0.1, y: 0.2, w: 0.2, h: 0.3 },
    // … 更多窗戶
  ],
}
```

建議 2-3 棟建築物，對應到 `LocationId` 的地點。

### 4.3 註冊表世界模組

**檔案**: `src/data/outerWorlds/index.ts`

將新世界模組加入 `worldRegistry`：

```ts
import { yourNpcOuterWorld } from './yourNewNpc';

const worldRegistry: Record<LocationId, OuterWorldModule> = {
  skybridge: bridgePainterOuterWorld as OuterWorldModule,
  newsstand: bridgePainterOuterWorld as OuterWorldModule,
  park: aoiOuterWorld as OuterWorldModule,
  your_location: yourNpcOuterWorld as OuterWorldModule,  // ← 新增
};
```

**無需修改 `OuterWorldExplorer.tsx`** — 它會自動透過 `getWorldForLocation(locationId)` 動態載入對應的世界模組。

### 4.4 更新 LocationId 類型

**檔案**: `src/data/locations.ts`

將新地圖的地點加入聯合類型：
```ts
export type LocationId = 'skybridge' | 'newsstand' | 'park'
  | 'laboratory' | 'greenhouse'
  | 'your_location_1' | 'your_location_2';
```

並在 `locations` 物件中新增對應的 `LocationData`（含 `spawn` 座標）。

### 4.5 傳送點

傳送點應定義為 `type: 'portal'` 的實體，由 `OuterWorldExplorer` 統一處理：

```ts
// 在新 NPC 地圖的 getEntities 中加入返回傳送點：
list.push({
  id: 'skybridge_portal', label: '天橋', type: 'portal',
  pos: { x: 16, y: 14 }, color: '#ffaa33', icon: '🧭',
});
```

同時，在 `bridgePainter` 的 `getEntities` 中（或對應的連接地點）加入前往新地圖的傳送點：

```ts
list.push({
  id: 'your_location_portal', label: '新地點', type: 'portal',
  pos: { x: 5, y: 9 }, color: '#66bb6a', icon: '🧭',
});
```

> ✅ **第四步完成後請執行**：
> ```bash
> git add -A && git commit -m "feat: add <npcId> — outer world map & teleport"
> ```

---

## 第五步：NPC 狀態引擎

### 5.1 建立初始狀態

**檔案**: `src/systems/npcStateEngine.ts`

```ts
export function createYourNpcState(): NpcRuntimeState {
  return {
    id: 'your_new_npc',
    name: '角色名稱',
    trust: 10,    // 初始信任度 (0-100)
    stress: 90,   // 初始壓力值 (0-100)
    knowledge: 0,
    knowledgeRequired: 80,
    trustRequired: 50,
    innerWorldUnlocked: false,
    ending: 'none',
    flags: [],
    innerWorldDepth: 0,
    innerWorldLayer: 0,
    innerWorld: createDefaultInnerWorldSave('your_new_npc'),
  };
}
```

### 5.2 修復指引規則 (repairTipRules)

至少需要 10-12 條規則，按 priority 排序（數字越大越優先）：

```ts
const repairTipRules: RepairTipRule[] = [
  {
    priority: 100,
    condition: ({ innerWorldUnlocked, trust, knowledge }) =>
      innerWorldUnlocked && trust >= 50 && knowledge >= 80,
    tip: '心理世界已解鎖的提示…',
  },
  {
    priority: 95,
    condition: ({ stress }) => stress >= 95,
    tip: '壓力值極高的警告提示…',
  },
  // … 遞減 priority 直到 0
  {
    priority: 0,
    condition: () => true,
    tip: '預設提示（所有狀態都適用的通用建議）',
  },
];
```

### 5.3 對話評估關鍵詞

定義專屬關鍵詞陣列（參考 victor 的 `victorSmellRecoveryWords` 等）：

```ts
const yourNpcPositiveWords = ['正向關鍵詞1', '正向關鍵詞2', /* … */];
const yourNpcNegativeWords = ['應避免關鍵詞1', '應避免關鍵詞2', /* … */];
const yourNpcTriggerWords  = ['特殊觸發關鍵詞1', /* … */];
```

### 5.4 對話評估函數

新增 `evaluateYourNpcDialogue` 函數，並在 `evaluateNpcDialogue` 中加入分派：

```ts
export function evaluateNpcDialogue(…) {
  if (npcId === 'victor') return evaluateVictorNpcDialogue(…);
  if (npcId === 'your_new_npc') return evaluateYourNpcDialogue(…);
  return evaluateBridgeArtistNpcDialogue(…);
}
```

### 5.5 更新 gameStore.ts

在 `getNpcIdForClue`、`findClueById`、以及存檔系統中加入新 NPC 的支援。

> ✅ **第五步完成後請執行**：
> ```bash
> git add -A && git commit -m "feat: add <npcId> — state engine & dialogue evaluation"
> ```

---

## 第六步：後端資料

### 6.1 線索資料

**檔案**: `cloud-functions/api/data/clues.js`

```js
  {
    "id": "clue_1",
    "npcId": "your_new_npc",
    "knowledge": 10,
    "description": "線索描述…"
  },
  // … 其餘 3 條
```

### 6.2 心理世界定義

**檔案**: `cloud-functions/api/data/innerWorlds.js`

```js
  "your_new_npc": {
    "modelVersion": 2,
    "name": "心理世界名稱（四層模型）",
    "emotion": "核心情緒標籤",
    "layers": [
      { "layerNumber": 1, "layerId": "your_layer_1", "layerName": "層級名稱", "theme": "主題" },
      { "layerNumber": 2, /* … */ },
      { "layerNumber": 3, /* … */ },
      { "layerNumber": 4, /* … */ },
    ]
  }
```

### 6.3 NPC 狀態模板

**檔案**: `cloud-functions/api/data/npc.json`

```json
  "your_new_npc": {
    "id": "your_new_npc",
    "name": "角色名稱",
    "background": "角色背景描述…",
    "trauma": "核心創傷描述…",
    "emotion": "核心情緒",
    "trust": 10,
    "stress": 90,
    "knowledge": 0,
    "knowledgeRequired": 80,
    "innerWorldUnlocked": false,
    "ending": "none",
    "worldbookUnlockIds": [5, 6, 7]
  }
```

### 6.4 角色卡

**檔案**: `cloud-functions/api/data/character-cards.js`

加入 system_prompt 和 system_prompt_post：
```js
  "your_new_npc": {
    "name": "角色名稱",
    "description": "角色描述…",
    "personality": "人格描述…",
    "scenario": "場景描述…",
    "first_mes": "開場白…",
    "mes_example": "示例對話…",
    "system_prompt": "LLM system prompt（含角色設定、說話規則、禁忌、隱藏狀態追蹤規則）…",
    "system_prompt_post": "成功後的 system_prompt…",
    "creator_notes": ""
  }
```

### 6.5 Prompt 檔案

**檔案**: `cloud-functions/api/prompts/your_npc.txt`

純文字 Prompt，結構參考 `prompts/artist.txt`，包含：
- 角色設定
- 說話規則
- 系統邊界
- 安全規則
- 輸出格式（JSON）

### 6.6 世界書解鎖

**檔案**: `cloud-functions/api/data/worldbook.json`

確保新 NPC 的場景條目 `unlockedByDefault: true`（若為可遊玩 NPC）。

> ✅ **第六步完成後請執行**：
> ```bash
> git add -A && git commit -m "feat: add <npcId> — backend data sync"
> ```

---

## 第七步：前端 UI 整合

### 7.1 App.tsx

**檔案**: `src/App.tsx`

1. 在 `gameStore` 的 `switchToNpc` action 中加入新 NPC 的映射
2. 確認 `save.currentNpcId` 正確獲取
3. 在 `OuterWorldExplorer` 的 props 中傳入 `onSwitchTo<YourNpc>` callback

### 7.2 OuterWorldExplorer

**檔案**: `src/ui/OuterWorldExplorer.tsx`

> ⚠️ **自 v1.1 起，此檔案已改為通用協調器**。新增 NPC 時**無需修改此檔案**。只要完成以下步驟即可：
> 1. 在 `src/data/outerWorlds/index.ts` 註冊中心加入新世界模組
> 2. 在 `src/data/verticalSlice.ts` 中擴展 `ClueId` 和 `NpcId` 類型
> 3. 更新 `src/data/locations.ts` 中的 `LocationId` 和 `locations` 資料
> 4. 若有線索圖片，在 `CLUE_IMAGE_MAP` 中新增映射（可選）

### 7.3 NpcInnerWorld

**檔案**: `src/ui/NpcInnerWorld.tsx`

1. 在 `ComingSoonVisual` 中為新 NPC 加入主題視覺設定
2. 在渲染區塊中加入新 NPC 的互動 pin 渲染
3. 確保 `floatingTextsByLayer` 和 `pinCoordinates` 正確載入

### 7.4 NarrativeDebugOverlay / NarrativePlaytestDashboard

**檔案**: `src/ui/NarrativeDebugOverlay.tsx`  
**檔案**: `src/ui/NarrativePlaytestDashboard.tsx`

更新線索導入和查詢，加入新 NPC 的 `Clues` 導入。

### 7.5 角色圖片

**目錄**: `images/character/`

放置 PNG 角色圖片（例如 `YourNpc.png`）。

> ✅ **第七步完成後請執行**：
> ```bash
> git add -A && git commit -m "feat: add <npcId> — UI integration & testing"
> ```

---

## 快速檢查清單

- [ ] `NpcId` 類型已更新
- [ ] NPC 註冊中心已登記
- [ ] `NpcDefinition` 完整（含 characterCard, lorebook, repairTipRules, simulateReply, openingsByDepth, ending, visualRegistry）
- [ ] `speakingStyle` 為物件格式（非 string[]）
- [ ] `exampleDialogues` 至少 4 組
- [ ] `ClueId` 類型已更新
- [ ] 4 條線索已定義（前後端同步）
- [ ] `PsychLayerId` 類型已更新
- [ ] 四層心理世界已建立（每層 4-5 個互動物件）
- [ ] `pinCoordinates` 已設定所有層級的所有互動物件座標
- [ ] `LocationId` 類型已擴展
- [ ] 表世界地圖資料已建立（buildings, roadDefs, collisionZones, getEntities, getInteraction）
- [ ] **表世界模組已在 `outerWorlds/index.ts` 註冊中心登記**
- [ ] 對話評估關鍵詞與函數已新增
- [ ] 初始狀態 `createYourNpcState()` 已定義
- [ ] `getNpcIdForClue` 已加入新 NPC
- [ ] 後端 clues.js, innerWorlds.js, npc.json, character-cards.js, prompts, worldbook 已更新
- [ ] `OuterWorldExplorer` 已自動支援（無需硬編碼修改）
- [ ] 雙向傳送點已設定（`type: 'portal'`）
- [ ] `NpcInnerWorld` 已加入新 NPC 主題視覺
- [ ] `App.tsx` 的 `switchToNpc` 已支援
- [ ] 角色圖片已放置
- [ ] TypeScript 編譯零錯誤 (`npx tsc --noEmit`)
