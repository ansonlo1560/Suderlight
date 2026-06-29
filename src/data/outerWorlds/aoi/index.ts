// ============================================================
// 小葵（Aoi）表世界資料 — 公園地圖
// 從 OuterWorldExplorer.tsx 與 bridgePainter 遷移至此
// ============================================================

import type {
  Building, CollisionZone, ElevationFn, EntityTemplate, LocationDisplay, RoadDef,
} from '../types';
import type { Point } from '../bridgePainter/types';

// ---- 共用常數與工具（從 bridgePainter 引入） ----
import {
  MAP_WIDTH, MAP_HEIGHT, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, PLAYER_SPEED,
  clamp, lerp, isoToScreen, distance, getOffsetPos,
} from '../bridgePainter';

export {
  MAP_WIDTH, MAP_HEIGHT, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, PLAYER_SPEED,
  clamp, lerp, isoToScreen, distance, getOffsetPos,
} from '../bridgePainter';

export function getElevation(_pos: Point): number { return 0; }
export function worldToScreen(pos: Point) { return isoToScreen(pos); }

// ---- 地圖描述 ----
export const locationDisplay: LocationDisplay = {
  id: 'park',
  name: '公園',
  subtitle: '失修的城市公園',
  description: '長椅被雨水浸黑，兒童遊具在風裡發出細小尖聲。樹下有一雙被踩進泥水裡的紅舞鞋。',
  ambient: '泥土、落葉、遲疑的雨聲',
};

// ---- 建築物 ----
export const buildings: Building[] = [
  {
    id: 'pavilion',
    name: '林蔭涼亭',
    locationId: 'park',
    pos: { x: 11, y: 6.5 },
    size: { x: 3, y: 3 },
    tall: 150,
    baseColor: '#2e7d32',
    windows: [
      { side: 'left', x: 0.25, y: 0.2, w: 0.15, h: 0.6 },
      { side: 'left', x: 0.6, y: 0.2, w: 0.15, h: 0.6 },
      { side: 'right', x: 0.25, y: 0.2, w: 0.15, h: 0.6 },
      { side: 'right', x: 0.6, y: 0.2, w: 0.15, h: 0.6 },
    ],
  },
  {
    id: 'park_bench_area',
    name: '長椅區',
    locationId: 'park',
    pos: { x: 5, y: 10 },
    size: { x: 2, y: 1.5 },
    tall: 20,
    baseColor: '#4a4a4a',
  },
  {
    id: 'swing_set',
    name: '鞦韆架',
    locationId: 'park',
    pos: { x: 14, y: 11 },
    size: { x: 2.5, y: 1.5 },
    tall: 80,
    baseColor: '#5d4037',
  },
];

// ---- 道路定義 ----
export const roadDefs = (locationId: string): RoadDef => {
  if (locationId !== 'park') return [];
  return [
    // 主步道：環繞涼亭
    [{ x: 3, y: 8 }, { x: 18, y: 8 }, { x: 18, y: 15 }, { x: 3, y: 15 }],
    // 支線：通往鞦韆
    [{ x: 13, y: 8 }, { x: 16, y: 8 }, { x: 16, y: 13 }, { x: 13, y: 13 }],
    // 支線：通往長椅
    [{ x: 3, y: 10 }, { x: 8, y: 10 }, { x: 8, y: 13 }, { x: 3, y: 13 }],
  ];
};

// ---- 碰撞區域 ----
export const collisionZones: Record<string, CollisionZone> = {
  park: {
    id: 'park',
    walkableRegions: [
      { minX: 1, maxX: 22, minY: 1, maxY: 18 },
    ],
    maxX: 22,
    maxY: 18,
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
  if (ctx.locationId !== 'park') return list;

  // 小葵 NPC（由 OuterWorldExplorer 根據 save.npcs.aoi 狀態決定是否顯示）
  // 這裡只提供靜態模板，OuterWorldExplorer 會覆蓋 pos/color/icon
  list.push({
    id: 'aoi', label: '小葵', type: 'npc',
    pos: { x: 12, y: 12 },
    color: '#ffaa33', icon: '葵',
  });

  // 傳送回天橋
  list.push({
    id: 'skybridge_portal', label: '天橋', type: 'portal',
    pos: { x: 16, y: 14 },
    color: '#ffaa33', icon: '🧭',
  });

  return list;
}

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
  if (entityId === 'aoi') {
    if (ctx.npcEnding === 'success') {
      return {
        title: '成功結局：靜止的鞦韆',
        content: '她沒有重新開始跳舞，也沒有立刻變好。\n\n但她終於坐在鞦韆上，沒有晃動，只是靜靜地待著。\n\n「原來……不做事的時候，我也還在。」',
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    // 信號：應該開對話頁（ OuterWorldExplorer 處理 onSwitchNpc + onOpenConversation ）
    return null;
  }

  return null;
}

// ---- 出入口 ----
export const getMaxX = (_locationId: string) => 22;
export const getMaxY = (_locationId: string) => 18;

export const aoiOuterWorld = {
  id: 'aoi',
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
  locationOffsets: {},
  getElevation,
  getMaxX,
  getMaxY,
  getInteraction,
};
