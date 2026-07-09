// ============================================================
// 天橋畫家表世界資料 — 地圖/建築/道路/碰撞/實體/海拔
// 從 OuterWorldExplorer.tsx 抽離
// ============================================================

import React from 'react';
import type { Building, CollisionZone, ElevationFn, EntityTemplate, LocationDisplay, RoadDef, SceneryItem } from '../types';
import type { Point } from './types';

// ---- 常數 ----
export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 1600;
export const TILE_W = 96;
export const TILE_H = 48;
export const ORIGIN_X = MAP_WIDTH / 2;
export const ORIGIN_Y = 160;
export const PLAYER_SPEED = 0.055;
const BRIDGE_DECK_ELEVATION = 76;
const BRIDGE_RAIL_HEIGHT = 14;

// ---- 工具函數 ----
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function isoToScreen(pos: Point) {
  return {
    left: ORIGIN_X + (pos.x - pos.y) * (TILE_W / 2),
    top: ORIGIN_Y + (pos.x + pos.y) * (TILE_H / 2),
  };
}

export function getSkybridgeElevation(pos: Point): number {
  const inUpperBridge = pos.x >= 4 && pos.x <= 19 && pos.y >= 8 && pos.y <= 10;
  if (inUpperBridge) return BRIDGE_DECK_ELEVATION;

  const inStairs = pos.x >= 4 && pos.x <= 6 && pos.y >= 10 && pos.y <= 16;
  if (inStairs) {
    const t = clamp((pos.y - 10) / 6, 0, 1);
    return lerp(BRIDGE_DECK_ELEVATION, 0, t);
  }

  // 新樓梯：天橋東端（近涼亭 x:22,y:13）→ 畫廊前道路
  const inGalleryStairs = pos.x >= 19 && pos.x <= 26 && pos.y >= 8 && pos.y <= 10;
  if (inGalleryStairs) {
    const t = clamp((pos.x - 19) / 8, 0, 1);
    return lerp(BRIDGE_DECK_ELEVATION, 0, t);
  }

  return 0;
}

export function worldToScreen(pos: Point) {
  const base = isoToScreen(pos);
  return { left: base.left, top: base.top - getSkybridgeElevation(pos) };
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export const locationDisplay: LocationDisplay = {
  id: 'skybridge',
  name: '表世界',
  subtitle: '街道、報攤、劇院與公園',
  description: '天橋、報攤與公園，這些在白晝下失色的微光之處，正透過漫長的道路和臺階連接在一起。往事在這裡延伸，等待著你去探索。',
  ambient: '雨後的車流低鳴、舊報紙的油墨味、潮濕泥土與落葉的微光',
};

// ---- 建築物 ----
export const buildings: Building[] = [
  {
    id: 'gallery',
    name: '失色畫廊',
    pos: { x: 26, y: 5 },
    size: { x: 4, y: 3 },
    tall: 260,
    baseColor: '#ec407a',
    windows: [
      { side: 'left', x: 0.1, y: 0.3, w: 0.2, h: 0.2 },
      { side: 'left', x: 0.7, y: 0.3, w: 0.2, h: 0.2 },
      { side: 'left', x: 0.1, y: 0.6, w: 0.2, h: 0.2 },
      { side: 'left', x: 0.4, y: 0.6, w: 0.2, h: 0.2 },
      { side: 'left', x: 0.7, y: 0.6, w: 0.2, h: 0.2 },
      { side: 'right', x: 0.1, y: 0.3, w: 0.2, h: 0.2 },
      { side: 'right', x: 0.4, y: 0.3, w: 0.2, h: 0.2 },
      { side: 'right', x: 0.7, y: 0.3, w: 0.2, h: 0.2 },
      { side: 'right', x: 0.1, y: 0.6, w: 0.2, h: 0.2 },
      { side: 'right', x: 0.4, y: 0.6, w: 0.2, h: 0.2 },
      { side: 'right', x: 0.7, y: 0.6, w: 0.2, h: 0.2 },
    ],
  },
  {
    id: 'news_cabin',
    name: '拾光報攤',
    pos: { x: 9, y: 12.5 },
    size: { x: 3.5, y: 3.5 },
    tall: 130,
    baseColor: '#d84315',
    windows: [{ side: 'left', x: 0.2, y: 0.3, w: 0.6, h: 0.4 }],
    decorations: ({ points }) => (
      <div style={{
        position: 'absolute',
        left: points.s3.left + 100,
        top: points.s3.top + 25,
        transform: 'skewY(-26.5deg)',
        background: 'rgba(30, 35, 45, 0.9)',
        border: '1.5px solid #ffd54f',
        borderRadius: '4px',
        padding: '2px 8px',
        color: '#fff',
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        boxShadow: '0 0 10px rgba(255, 213, 79, 0.3)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '40px'
      }}>
        OPEN
      </div>
    ),
  },
    {
    id: 'pavilion',
    name: '林蔭涼亭',
    pos: { x: 22, y: 13 },
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
    id: 'theater',
    name: '微光劇院',
    pos: { x: 5.45, y: 22 },
    size: { x: 7.5, y: 8 },
    tall: 150,
    baseColor: '#6a1b9a',
    windows: [
      { side: 'left', x: 0.1, y: 0.2, w: 0.2, h: 0.22 },
      { side: 'left', x: 0.4, y: 0.2, w: 0.2, h: 0.22 },
      { side: 'left', x: 0.7, y: 0.2, w: 0.2, h: 0.22 },
      { side: 'left', x: 0.1, y: 0.52, w: 0.2, h: 0.22 },
      { side: 'left', x: 0.4, y: 0.52, w: 0.2, h: 0.22 },
      { side: 'left', x: 0.7, y: 0.52, w: 0.2, h: 0.22 },
      { side: 'right', x: 0.1, y: 0.3, w: 0.15, h: 0.25 },
      { side: 'right', x: 0.75, y: 0.3, w: 0.15, h: 0.25 },
    ],
    decorations: ({ points, isRepaired }) => (
      <div style={{
        position: 'absolute',
        left: points.s2.left + 120,
        top: points.t2.top - 90,
        transform: 'skewY(-26.5deg)',
        background: isRepaired ? 'rgba(106, 27, 154, 0.9)' : 'rgba(30, 30, 34, 0.9)',
        border: `2px solid ${isRepaired ? '#ffd54f' : '#555'}`,
        borderRadius: '6px',
        padding: '4px 14px',
        color: isRepaired ? '#ffd54f' : '#888',
        fontSize: '13px',
        fontWeight: 'bold',
        letterSpacing: '3px',
        boxShadow: isRepaired ? '0 0 18px rgba(255, 213, 79, 0.4)' : 'none',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
        textAlign: 'center',
        transition: 'all 1.5s ease',
      }}>
        ★ 微光劇院 ★
      </div>
    ),
  },
];

// ---- 道路定義 ----
export const roadDefs = (locationId: string): RoadDef => {
  if (locationId !== 'skybridge') return [];
  return [
    [{ x: 4, y: 8 }, { x: 19, y: 8 }, { x: 19, y: 10 }, { x: 4, y: 10 }],
    // [1] 新樓梯：天橋東端（近涼亭）→ 畫廊前道路
    [{ x: 19, y: 8 }, { x: 26, y: 8 }, { x: 26, y: 10 }, { x: 19, y: 10 }],
    [{ x: 4, y: 10 }, { x: 6, y: 10 }, { x: 6, y: 16 }, { x: 4, y: 16 }],
    [{ x: 4, y: 16 }, { x: 30, y: 16 }, { x: 30, y: 19 }, { x: 4, y: 19 }],
    [{ x: 26, y: 8 }, { x: 30, y: 8 }, { x: 30, y: 19 }, { x: 26, y: 19 }], 
    // [4] 劇院右側垂直路：從地面道路通向劇院大門
    [{ x: 12.5, y: 11 }, { x: 16.25, y: 11 }, { x: 17, y: 30 }, { x: 13, y: 30 }],
    // [5] 劇院→公園橫向路
    // [{ x: 11.5, y: 23.5 }, { x: 17, y: 23.5 }, { x: 17, y: 26 }, { x: 11.5, y: 26 }],
  ];
};

// ---- 碰撞區域 ----
export const collisionZones: Record<string, CollisionZone> = {
  skybridge: {
    id: 'skybridge',
    walkableRegions: [
      { minX: 4.5, maxX: 19.0, minY: 8.5, maxY: 10.0 },
      // 新樓梯：天橋東端（近涼亭）→ 畫廊前道路
      { minX: 19.0, maxX: 27.0, minY: 8.5, maxY: 10.0 },
      { minX: 4.5, maxX: 6.0, minY: 10.0, maxY: 17.0 },
      { minX: 4.5, maxX: 28.0, minY: 16.5, maxY: 19.0 },
      { minX: 17.0, maxX: 28.0, minY: 19.0, maxY: 28.0 },
      { minX: 27.0, maxX: 30.5, minY: 8.0, maxY: 19.0 },
      // 劇院右側垂直路（不穿過天橋區 y:8~10.5，從地面道路或天橋另行繞行）
      { minX: 13.5, maxX: 16.5, minY: 12.0, maxY: 16.5 },
      { minX: 13.5, maxX: 30.5, minY: 16.5, maxY: 30.0 },
      // 劇院→公園橫向路
      // { minX: 11.5, maxX: 17.0, minY: 23.5, maxY: 26.0 },
    ],
    maxX: 35,
    maxY: 30,
  },
};

// ---- 實體 ----
export function getEntities(ctx: {
  npcEnding: string;
  npcInnerWorldUnlocked: boolean;
  collectedClues: string[];
  locationId: string;
}): EntityTemplate[] {
  const list: EntityTemplate[] = [];
  const { npcEnding } = ctx;

  if (ctx.locationId === 'skybridge') {
    list.push({
      id: 'painter', label: '天橋畫家', type: 'npc',
      pos: { x: 12, y: 9 },
      color: npcEnding === 'success' ? '#7acc7a' : '#ffaa33',
      icon: npcEnding === 'success' ? '光' : '畫',
    });

    list.push({
      id: 'aoi', label: '小葵', type: 'npc',
      pos: { x: 25, y: 24.5 },
      color: '#ffaa33', icon: '葵',
    });

    const renaState = (ctx as any).save?.npcs?.rena;
    const renaEnding = renaState?.ending ?? 'none';
    
    list.push({
      id: 'rena', label: '蕾娜', type: 'npc',
      pos: { x: 14, y: 24 },
      color: renaEnding === 'success' ? '#7acc7a' : '#ffaa33',
      icon: renaEnding === 'success' ? '光' : '娜',
    });

    list.push({
      id: 'gallery_door', label: '畫廊大門', type: 'clue',

      pos: { x: 27.25, y: 8.5 }, color: '#ec407a', icon: '門',
    });
    list.push({
      id: 'theater_door', label: '劇院大門', type: 'clue',
      pos: { x: 13.5, y: 26.0 }, color: '#6a1b9a', icon: '門',
    });
  }

  // 線索實體由 clueOrder 驅動，此處由呼叫方合併（避免循環依賴）
  return list;
}

// ---- 公園場景裝飾：占據地圖右下角 x=17~28, y=19~28 ----
export const parkScenery: SceneryItem[] = [
  // 西邊 x=17
  // { id: 'tree_w1', type: 'tree', pos: { x: 17, y: 21 }, size: 1.2 },
  // { id: 'tree_w2', type: 'tree', pos: { x: 17, y: 22.5 }, size: 1.3 },
  // { id: 'tree_w3', type: 'tree', pos: { x: 17, y: 23.5 }, size: 1.2 },
  // { id: 'tree_w4', type: 'tree', pos: { x: 17, y: 25 }, size: 1.2 },
  // { id: 'tree_w5', type: 'tree', pos: { x: 17, y: 26.5 }, size: 1.3 },
  // 東邊 x=28
  { id: 'tree_e1', type: 'tree', pos: { x: 30, y: 21 }, size: 1.2 },
  { id: 'tree_e2', type: 'tree', pos: { x: 30, y: 22.5 }, size: 1.1 },
  { id: 'tree_e3', type: 'tree', pos: { x: 30, y: 23.5 }, size: 1.2 },
  { id: 'tree_e4', type: 'tree', pos: { x: 30, y: 25 }, size: 1.2 },
  { id: 'tree_e5', type: 'tree', pos: { x: 30, y: 26.5 }, size: 1.1 },
  { id: 'tree_e6', type: 'tree', pos: { x: 30, y: 28 }, size: 1.1 },
  { id: 'tree_e7', type: 'tree', pos: { x: 30, y: 29.5 }, size: 1.1 },
  // 北邊 y=19 緊鄰道路，移除樹木避免遮蔽道路
  // 南邊 y=28
  { id: 'tree_s1', type: 'tree', pos: { x: 18, y: 30 }, size: 1.1 },
  { id: 'tree_s2', type: 'tree', pos: { x: 19.5, y: 30 }, size: 1.2 },
  { id: 'tree_s3', type: 'tree', pos: { x: 21, y: 30 }, size: 1.1 },
  { id: 'tree_s4', type: 'tree', pos: { x: 22.5, y: 30 }, size: 1.3 },
  { id: 'tree_s5', type: 'tree', pos: { x: 24, y: 30 }, size: 1.1 },
  { id: 'tree_s6', type: 'tree', pos: { x: 25.5, y: 30 }, size: 1.2 },
  { id: 'tree_s7', type: 'tree', pos: { x: 27, y: 30 }, size: 1.1 },
  { id: 'tree_s8', type: 'tree', pos: { x: 28.75, y: 30 }, size: 1.1 },
  // 內部小樹
  { id: 'tree_i1', type: 'tree', pos: { x: 20, y: 21.5 }, size: 1.1 },
  { id: 'tree_i2', type: 'tree', pos: { x: 22.5, y: 22.5 }, size: 1.2 },
  { id: 'tree_i3', type: 'tree', pos: { x: 25, y: 23.5 }, size: 1.1 },
  { id: 'tree_i4', type: 'tree', pos: { x: 26.5, y: 21.5 }, size: 1.2 },
  { id: 'tree_i5', type: 'tree', pos: { x: 21, y: 25.5 }, size: 1.1 },
  { id: 'tree_i6', type: 'tree', pos: { x: 24.5, y: 26 }, size: 1.2 },

  // 草地（占據公園內部，避開線索位置）
  { id: 'grass_1', type: 'grass', pos: { x: 18, y: 20 }, size: 1.2 },
  { id: 'grass_2', type: 'grass', pos: { x: 19.5, y: 20 }, size: 1.1 },
  { id: 'grass_3', type: 'grass', pos: { x: 21, y: 20 }, size: 1.2 },
  { id: 'grass_4', type: 'grass', pos: { x: 22.5, y: 20 }, size: 1.1 },
  { id: 'grass_5', type: 'grass', pos: { x: 24, y: 20 }, size: 1.2 },
  { id: 'grass_6', type: 'grass', pos: { x: 25.5, y: 20 }, size: 1.1 },
  { id: 'grass_7', type: 'grass', pos: { x: 27, y: 20 }, size: 1.2 },
  { id: 'grass_8', type: 'grass', pos: { x: 18, y: 21.5 }, size: 1.1 },
  { id: 'grass_9', type: 'grass', pos: { x: 19.5, y: 21.5 }, size: 1.2 },
  { id: 'grass_10', type: 'grass', pos: { x: 21, y: 21.5 }, size: 1.1 },
  { id: 'grass_11', type: 'grass', pos: { x: 22.5, y: 21.5 }, size: 1.2 },
  { id: 'grass_12', type: 'grass', pos: { x: 24, y: 21.5 }, size: 1.1 },
  { id: 'grass_13', type: 'grass', pos: { x: 25.5, y: 21.5 }, size: 1.2 },
  { id: 'grass_14', type: 'grass', pos: { x: 27, y: 21.5 }, size: 1.1 },
  { id: 'grass_15', type: 'grass', pos: { x: 18, y: 23 }, size: 1.2 },
  { id: 'grass_16', type: 'grass', pos: { x: 19.5, y: 23 }, size: 1.1 },
  { id: 'grass_17', type: 'grass', pos: { x: 21, y: 23 }, size: 1.2 },
  { id: 'grass_18', type: 'grass', pos: { x: 22.5, y: 23 }, size: 1.1 },
  { id: 'grass_19', type: 'grass', pos: { x: 24, y: 23 }, size: 1.2 },
  { id: 'grass_20', type: 'grass', pos: { x: 25.5, y: 23 }, size: 1.1 },
  { id: 'grass_21', type: 'grass', pos: { x: 27, y: 23 }, size: 1.2 },
  { id: 'grass_22', type: 'grass', pos: { x: 18, y: 24.5 }, size: 1.1 },
  { id: 'grass_23', type: 'grass', pos: { x: 19.5, y: 24.5 }, size: 1.2 },
  { id: 'grass_24', type: 'grass', pos: { x: 21, y: 24.5 }, size: 1.1 },
  { id: 'grass_25', type: 'grass', pos: { x: 22.5, y: 24.5 }, size: 1.2 },
  { id: 'grass_26', type: 'grass', pos: { x: 24, y: 24.5 }, size: 1.1 },
  { id: 'grass_27', type: 'grass', pos: { x: 25.5, y: 24.5 }, size: 1.2 },
  { id: 'grass_28', type: 'grass', pos: { x: 27, y: 24.5 }, size: 1.1 },
  { id: 'grass_29', type: 'grass', pos: { x: 18, y: 26 }, size: 1.2 },
  { id: 'grass_30', type: 'grass', pos: { x: 19.5, y: 26 }, size: 1.1 },
  { id: 'grass_31', type: 'grass', pos: { x: 21, y: 26 }, size: 1.2 },
  { id: 'grass_32', type: 'grass', pos: { x: 22.5, y: 26 }, size: 1.1 },
  { id: 'grass_33', type: 'grass', pos: { x: 24, y: 26 }, size: 1.2 },
  { id: 'grass_34', type: 'grass', pos: { x: 25.5, y: 26 }, size: 1.1 },
  { id: 'grass_35', type: 'grass', pos: { x: 27, y: 26 }, size: 1.2 },
  { id: 'grass_36', type: 'grass', pos: { x: 18, y: 27.5 }, size: 1.2 },
  { id: 'grass_37', type: 'grass', pos: { x: 19.5, y: 27.5 }, size: 1.1 },
  { id: 'grass_38', type: 'grass', pos: { x: 21, y: 27.5 }, size: 1.2 },
  { id: 'grass_39', type: 'grass', pos: { x: 22.5, y: 27.5 }, size: 1.1 },
  { id: 'grass_40', type: 'grass', pos: { x: 24, y: 27.5 }, size: 1.2 },
  { id: 'grass_41', type: 'grass', pos: { x: 25.5, y: 27.5 }, size: 1.1 },
  { id: 'grass_42', type: 'grass', pos: { x: 27, y: 27.5 }, size: 1.2 },
  { id: 'grass_43', type: 'grass', pos: { x: 18, y: 28.5 }, size: 1.2 },
  { id: 'grass_44', type: 'grass', pos: { x: 19.5, y: 28.5 }, size: 1.1 },
  { id: 'grass_45', type: 'grass', pos: { x: 21, y: 28.5 }, size: 1.2 },
  { id: 'grass_46', type: 'grass', pos: { x: 22.5, y: 28.5 }, size: 1.1 },
  { id: 'grass_47', type: 'grass', pos: { x: 24, y: 28.5 }, size: 1.2 },
  { id: 'grass_48', type: 'grass', pos: { x: 25.5, y: 28.5 }, size: 1.1 },
  { id: 'grass_49', type: 'grass', pos: { x: 27, y: 28.5 }, size: 1.2 },
  { id: 'grass_50', type: 'grass', pos: { x: 28.5, y: 28.5 }, size: 1.2 },
  { id: 'grass_51', type: 'grass', pos: { x: 28.5, y: 27 }, size: 1.2 },
  { id: 'grass_52', type: 'grass', pos: { x: 28.5, y: 25.5 }, size: 1.2 },
  { id: 'grass_53', type: 'grass', pos: { x: 28.5, y: 24 }, size: 1.2 },
  { id: 'grass_54', type: 'grass', pos: { x: 28.5, y: 22.5 }, size: 1.2 },
  { id: 'grass_55', type: 'grass', pos: { x: 28.5, y: 21 }, size: 1.2 },
  { id: 'grass_56', type: 'grass', pos: { x: 28.5, y: 20}, size: 1.2 },

];

// ---- 海拔函數 ----
export const getElevation: ElevationFn = (pos: Point) => 0;

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
  if (entityId === 'painter') {
    if (ctx.npcEnding === 'success') {
      return {
        title: '成功結局：雨聲仍在',
        content: [
          '他沒有抬頭。手裡沒有畫筆。風從天橋下面灌上來，吹動他腳邊那疊潮濕的紙——但它們沒有飛走，只是輕輕翻了一頁。',
          '「……雨聲。」',
          '',
          '他像是對著空氣說話，也像是對著自己。',
          '「我以前聽過這個聲音。在出事之前。那時候雨只是天氣，不是什麼……象徵。」',
          '',
          '他沉默了很久。天橋上的車聲忽遠忽近。',
          '「你來過很多次了。第一次的時候，我以為你也是來討顏色的。後來發現……你從來沒有跟我要過任何東西。」',
          // '「第一次的時候，我以為你也是來討顏色的。後來發現……你從來沒有跟我要過任何東西。」',
          '',
          '他終於看了你一眼。他的眼神還是很淡，但不再像最初那種——準備好要被冒犯的戒備。',
          '「我以前覺得，畫布是為了承載色彩。沒有顏色的畫布，是失敗的、羞恥的、不該存在的。」',
          '他頓了一下。',
          '「但你是第一個……願意看著這片空白，而不急著往上面填東西的人。」',
          '',
          '風又吹過來。這次他把那疊濕紙壓住了——不是怕它們飛走，而是覺得它們躺在那裡，也行。',
          '「乾枯。這是我的名字。出事之後就沒用過了。因為一個叫乾枯的廢人……太像一個不好笑的笑話。」',
          // '「這是我的名字。出事之後就沒用過了。因為一個叫乾枯的廢人……太像一個不好笑的笑話。」',
          '',
          '他的嘴角動了一下——不是笑，但也不是不笑。',
          '「但你讓我覺得……乾枯不是失敗的狀態。只是一種……天氣。就像這座天橋。它從來沒有要求風停下來。」',
          // '「就像這座天橋。它從來沒有要求風停下來。」',
          '',
          '他又沉默了。但這次的沉默不是牆——只是一種他選擇的逗號。',
          '「我不會說謝謝。那太像展覽開幕詞了。但如果你的天橋也下雨了——」',
          // '「但如果你的天橋也下雨了——」',
          '',
          '他低頭看著自己的手。沒有顏料，也沒有傷口。只是一雙人的手。',
          '「——你可以站在這裡。這裡的風夠大，大到可以讓你什麼都不用是。」',
          // '「這裡的風夠大，大到可以讓你什麼都不用是。」',
        ].join('\n'),
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    if (ctx.npcEnding === 'failed') {
      return {
        title: '',
        content: [
          '碎布還在原地。雨水繼續浸透它們。',
          '你注意到最大那塊碎片上的鉛筆線——',
          '它是一筆從畫框中央向外拖出去的長線，',
          '在撕裂處戛然而止。',
          '像一段話，說到一半就斷了。',
          '',
          '「連這最後的......空白......你都不肯......留給我嗎？」',
          '',
          '你感覺天橋的風變冷了一些。',
        ].join('\n'),
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    return null; // 信號：應該開對話頁
  }

  if (entityId === 'aoi') {
    if (ctx.npcEnding === 'success') {
      return {
        title: '成功結局：靜止的鞦韆',
        content: [
          '她站在鞦韆旁邊，手裡抱著一本圖畫書。風吹過的時候，鞋帶上的小鈴鐺發出了輕輕的響聲。',
          '「……你來了。」',
          '',
          '她沒有像以前那樣躲開你的視線。她看著你，沉默了一會兒，像是在整理一些從來沒有人允許她好好整理的東西。',
          '「以前……我覺得世界是一個魔方。每一面都要對齊，不然就會爆炸。所以我一直轉、一直轉。但無論怎麼轉……顏色從來沒有對齊過。」',
          '',
          '她低頭看了看自己腳上的紅舞鞋。洗乾淨了，但有些泥土的痕跡還在。',
          '「我以為只要我不跳舞，它們就不會吵架。只要我夠乖、夠懂事……家就會變好。但你是第一個……沒有叫我加油的人。也沒有說『你父母很擔心你』。你就只是……坐在那裡。」',
          // '「你就只是……坐在那裡。」',
          '',
          '她輕輕地笑了一下——不是那種快樂的笑，而是一種終於可以不用假裝沒事的笑。',
          '「我以前覺得，安靜是一種失敗。如果我不說話、不做點什麼……一切就會更糟。但是你讓我知道……有些東西，不是靠我轉動就會對齊的。」',
          '',
          '風又吹過來了。鞦韆自己動了起來。她看著輕輕搖晃的鞦韆，沒有伸手去扶。',
          '「我今天帶了圖畫書來。不是為了學習，也不是為了讓誰覺得我很乖。就只是……想看。」',
          '「還有這雙鞋子。」她的手指碰了碰鞋帶上的鈴鐺。「我把它們洗乾淨了。穿上去的時候，它會響。不是為了表演……就只是走路的時候，有聲音陪著我。」',
          '',
          '她沉默了很久。然後抬起頭，用一種很平靜的聲音說：',
          '「謝謝你。不是謝謝你救了我——因為你沒有把我當成需要被拯救的人。你是第一個……看著我，然後不需要我做任何東西的大人。」',
          '',
          '她又笑了，這次比剛才多了一點點重量——像是終於可以把一個很沉的書包放在地上。',
          '「風大的時候，鞦韆自己會動。我不用推它，它也沒生氣。下一次你來公園的時候，我可能就在那裡。看書、發呆、或者只是聽風。你不用跟我說話……就只是一起坐著也可以。」「因為安靜裡面，其實有所有還沒說出口的話。它只是還沒開始——不是沒有。」',
          // '「下一次你來公園的時候，我可能就在那裡。看書、發呆、或者只是聽風。你不用跟我說話……就只是一起坐著也可以。」',
          // '「因為安靜裡面，其實有所有還沒說出口的話。它只是還沒開始——不是沒有。」',
          '',
          '她微微鞠了一個小小的躬——不是為了禮貌，而是因為她終於學會了用自己舒服的方式說再見。',
          '「再見。下次風大的時候……記得來。」',
        ].join('\n'),
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    if (ctx.npcEnding === 'failed') {
      return {
        title: '空盪的鞦韆',
        content: [
          '這裡曾經有一個小女孩，靜靜坐在鞦韆上。',
          '風輕輕推著她的影子，彷彿時間也不忍打擾。',
          '可如今，她的身影已不在，空盪的座位孤獨地搖晃著，像是在呼喚，卻永遠等不到回應。',
          '夜色吞沒了她的背影，只留下公園裡一片寂靜，提醒著人們——她曾經來過，卻再也不會回來。',
        ].join('\n'),
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    return null; // 信號：應該開對話頁（ OuterWorldExplorer 處理 onSwitchNpc + onOpenConversation ）
  }

  if (entityId === 'rena') {
    if (ctx.npcEnding === 'success') {
      return {
        title: '成功結局：不再表演的微笑',
        content: [
          '蕾娜依然站在脫口秀舞台上，但這一次，她的開場白變了：「今晚，我想分享一個不好笑的故事。」',
          '',
          '觀眾起初困惑，有人發出尷尬的乾笑，但漸漸地，全場陷入了沉默的聆聽。她講述了父親去世那晚的後台、練習微笑的鏡子，以及那支乾涸的亮紅色口紅。',
          '',
          '謝幕時，台下沒有人大笑，卻有人紅了眼眶。後台的鏡子上，那支口紅被靜靜擱在一旁，旁邊多了一支無色的護唇膏。',
          // '後台的鏡子上，那支口紅被靜靜擱在一旁，旁邊多了一支無色的護唇膏。',
          '',
          '幾個月後，她出版了一本薄薄的圖文書——裡面有笑話，也有大片的空白頁。書名：《有些頁面，本來就該是空的》。',
          // '裡面有笑話，也有大片的空白頁。',
          // '書名：《有些頁面，本來就該是空的》。',
          '',
          '她去探望了父親的墓，這一次她沒有笑。眼淚滴在墓碑上的那一刻，她發現自己終於能做出除了大笑以外的表情了。',
          // '眼淚滴在墓碑上的那一刻，她發現自己終於能做出',
          // '除了大笑以外的表情了。',
          '',
          '她轉過頭，對你說：',
          '',
          '我花了很長一段時間才發現，原來笑話不是唯一的語言。但更難的是，承認自己累了，而且不為此道歉。',
          // '但更難的是，承認自己累了，而且不為此道歉。',
          '',
          '那天之後，我試著做了一些很小的事——在舞台上停頓五秒，什麼都不說。在鏡子前看著自己的臉，不畫笑臉。在父親的墓前站了很久，什麼都沒做，只是站著。',
          // '在舞台上停頓五秒，什麼都不說。',
          // '在鏡子前看著自己的臉，不畫笑臉。',
          // '在父親的墓前站了很久，什麼都沒做，只是站著。',
          '',
          '書的最後一頁，我什麼都沒寫。以前我會覺得這很失敗，現在我知道，有些頁面本來就該是空的——就像有時候，人不笑也沒關係。',
          // '以前我會覺得這很失敗。',
          // '現在我知道，有些頁面本來就該是空的——就像有時候，人不笑也沒關係。',
          // '就像有時候，人不笑也沒關係。',
          '',
          '謝謝你沒有急著修好我。你只是坐在那裡，給了我一個可以垮掉的角落。',
          // '你只是坐在那裡，給了我一個可以垮掉的角落。',
        ].join('\n'),
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    if (ctx.npcEnding === 'failed') {
      return {
        title: '面具的餘音',
        content: [
          '對話結束時，蕾娜對你露出了一個完美的笑容——',
          '那笑容精準、明亮、無懈可擊，',
          '但你看到她的眼神深處，最後一絲光熄滅了。',
          '',
          '從那以後，她依然每晚登台，但站在聚光燈下的與其說是人，不如說是一座笑臉的雕像。',
          '笑話一個接一個，觀眾的笑聲一次比一次響，',
          '但仔細聽，她的語氣裡已經沒有任何起伏，像一台設定好頻率的播放器。',
          '',
          '後台的那面鏡子不知何時碎了。',
          '裂縫正好穿過那張口紅畫出來的笑臉，把它切成兩半。',
          '沒有人來修——反正她在鏡子裡也只看得見同一張臉。',
          '',
          '那本沾有淚痕的笑話集被塞在櫃子最深處，',
          '翻到最後一頁，紙張被指甲反覆刮爛，留下兩個字：',
          '「好累。」',
          '',
          '她再也沒去掃過父親的墓。',
          '久而久之，她連「為什麼要掃墓」都忘了。',
          '',
          '合約到期那天，她沒有續約。',
          '經紀人追問原因，她只是笑了笑，說：「沒意義了。」',
          '沒有人知道她去了哪裡，也沒有人找她。',
          '海報上她的名字被疊上了新的頭像，很快便褪了色。',
          '',
          '面具徹底長進了皮膚裡，她變成了再無表情的空殼——',
          '但偶爾有老觀眾提起她時，仍會說：',
          '「蕾娜那時候，笑得特別開心呢。」',
        ].join('\n'),
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    return null; // 開啟對話
  }


  if (entityId === 'torn_canvas') {
    const hasInteracted = ctx.npcFlags.includes('torn_canvas_first_interaction');
    return hasInteracted ? {
      title: '被撕碎的空白畫布',
      content: [
        '碎布還在原地。雨水繼續浸透它們。',
        '你注意到最大那塊碎片上的鉛筆線——',
        '它是一筆從畫框中央向外拖出去的長線，',
        '在撕裂處戛然而止。',
        '像一段話，說到一半就斷了。',
        '',
        '「連這最後的......空白......你都不肯......留給我嗎？」',
        '',
        '你感覺天橋的風變冷了一些。',
      ].join('\n'),
      actions: [{ label: '走向終章', tone: 'primary', onClick: ctx.onOpenArcFailure }],
    } : {
      title: '被撕碎的空白畫布',
      content: [
        '你蹲下身，手指觸到濕透的帆布邊緣。',
        '纖維在水裡泡得發軟，觸感像死去的皮膚。',
        '你試著把碎片拼回原來的形狀——但它們已經泡皺了，',
        '再也無法對齊。',
        '雨水從你的指縫流過，把撕裂的邊緣沖得更碎。',
        '',
        '「連這最後的空白，你都不肯留給我嗎？」',
        '',
        '（稍後再來看看它吧。）',
      ].join('\n'),
    };
  }

  if (entityId === 'gallery_door') {
    if (ctx.npcInnerWorldUnlocked && ctx.npcEnding === 'none') {
      return {
        title: '進入心理世界',
        content: [
          '你站在失色畫廊沉重的雕花橡木門前。',
          '',
          '此時你已解鎖了心理世界的存取權，大門正散發著玄妙的心智波動。',
          '',
          '是否推開大門，潛入畫家的心理世界（第一層：榮耀美術館）進行探索？',
        ].join('\n'),
        actions: [
          { label: '潛入心理世界', tone: 'primary', onClick: ctx.onEnterInnerWorld },
          { label: '留在外面', onClick: () => { ctx.onShowModal(null); } },
        ],
      };
    }
    return {
      title: '進入建築物',
      content: [
        '你站在失色畫廊沉重的雕花橡木門前。',
        '',
        ctx.npcEnding === 'success'
          ? '在被開導後，這裡已經泛起了溫暖的色彩，門縫下透出令人安心的金黃色光芒。'
          : '這扇門被冰冷沉悶的死灰包圍，彷彿封鎖了一段不願示人的過往。',
        '',
        '是否推開大門進入探索？',
      ].join('\n'),
      actions: [
        {
          label: '推門進入',
          tone: 'primary',
          onClick: () => {
            ctx.onShowModal({
              title: '失色畫廊 - 內部幻境',
              content: [
                '【失色畫廊 · 內部】',
                '',
                '你推開了大門。此時畫廊內部呈現出一個宏大的心智空間，牆壁上掛滿了未填滿的畫布。',
                '',
                ctx.npcEnding === 'success'
                  ? '【治癒共鳴】高大的採光窗下，一道明亮柔和的暖光斜射在地板上。雨聲此時在畫廊內迴響，空洞的灰色畫布上慢慢浮現出春天的線條與輪廓，那是重生的起點。'
                  : '【失色迴廊】四下寂靜無聲，只有陰暗的灰階霧氣漂浮。所有的作品都沒有顏色，像一座封存了辨色力與希望的宏大墓碑，這就是他封閉的內心深處。\n\n（提示：你尚未解鎖心理世界的探尋權限，需要與畫家進一步對話並收集更多線索）',
              ].join('\n'),
              actions: [{ label: '回到外表世界', onClick: () => ctx.onShowModal(null) }],
            });
          },
        },
        { label: '留在外面', onClick: () => { ctx.onShowModal(null); } },
      ],
    };
  }

  if (entityId === 'theater_door') {
    return {
      title: '微光劇院',
      content: [
        '【微光劇院 · 大門】',
        '',
        '你站在微光劇院的入口前。深紫色的帷幕從門縫中若隱若現，',
        '外牆上褪色的海報還殘留著昔日演出的痕跡。',
        '',
        '門上掛著一塊銅牌，字跡已經有些模糊：',
        '「每一個不曾起舞的日子，都是對生命的辜負。」',
        '',
        '劇院的大門虛掩著，門縫裡傳出微弱的燈光和低沉的回音——',
        '彷彿有一場永遠不會落幕的演出正在進行。',
        '',
        ctx.npcEnding === 'success'
          ? '在治癒之後，門縫中透出的燈光溫暖而柔和，空氣中飄著淡淡的木頭和舊絨布的味道。'
          : '門框周圍被一層灰暗的霧氣籠罩，但你仍然能感受到裡面有什麼在等待。',
        '',
        '是否推開大門進入探索？',
      ].join('\n'),
      actions: [
        {
          label: '推門進入',
          tone: 'primary',
          onClick: () => {
            ctx.onShowModal({
              title: '微光劇院 - 內部',
              content: [
                '【微光劇院 · 內部】',
                '',
                '你推開了大門。偌大的觀眾席空空蕩蕩，只有舞臺上一盞孤獨的聚光燈',
                '照亮著一張空椅子。空氣中殘留著演出後的寂靜，以及若有若無的笑聲迴響。',
                '',
                ctx.npcEnding === 'success'
                  ? '【治癒共鳴】舞臺兩側的帷幕輕輕飄動，空氣中充滿了溫暖的琥珀色光芒。那些曾經在這裡演出過的故事，已經不再是傷痕，而是溫柔的回憶。'
                  : '【沉寂舞臺】四下寂靜無聲，只有偶爾從天花板落下的灰塵在燈光中旋轉。舞臺後方的化妝鏡反射出微弱的光芒，彷彿等待著某個永遠不會上臺的演員。',
              ].join('\n'),
              actions: [{ label: '回到外面', onClick: () => ctx.onShowModal(null) }],
            });
          },
        },
        { label: '留在外面', onClick: () => { ctx.onShowModal(null); } },
      ],
    };
  }

  return null;
}

// ---- 出入口 ----
export const bridgePainterOuterWorld = {
  id: 'bridge_painter',
  mapWidth: MAP_WIDTH,
  mapHeight: MAP_HEIGHT,
  tileW: TILE_W,
  tileH: TILE_H,
  originX: ORIGIN_X,
  originY: ORIGIN_Y,
  playerSpeed: PLAYER_SPEED,
  buildings,
  roadDefs,
  collisionZones,
  getEntities,
  locationDisplay,
  locationOffsets: {
    newsstand: { x: 3, y: 1 },
  },
  scenery: parkScenery,
  getElevation: getSkybridgeElevation,
  getMaxX: (lid: string) => collisionZones[lid]?.maxX || 28,
  getMaxY: (lid: string) => collisionZones[lid]?.maxY || 28,
  getInteraction,
};
