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
  const inGalleryPassage = pos.x >= 17 && pos.x <= 19 && pos.y >= 4 && pos.y <= 8;
  if (inUpperBridge || inGalleryPassage) return BRIDGE_DECK_ELEVATION;

  const inStairs = pos.x >= 4 && pos.x <= 6 && pos.y >= 10 && pos.y <= 16;
  if (inStairs) {
    const t = clamp((pos.y - 10) / 6, 0, 1);
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
  subtitle: '街道、報攤與公園',
  description: '天橋、報攤與公園，這些在白晝下失色的微光之處，正透過漫長的道路和臺階連接在一起。往事在這裡延伸，等待著你去探索。',
  ambient: '雨後的車流低鳴、舊報紙的油墨味、潮濕泥土與落葉的微光',
};

// ---- 建築物 ----
export const buildings: Building[] = [
  {
    id: 'gallery',
    name: '失色畫廊',
    pos: { x: 14.5, y: 2 },
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
];

// ---- 道路定義 ----
export const roadDefs = (locationId: string): RoadDef => {
  if (locationId !== 'skybridge') return [];
  return [
    [{ x: 4, y: 8 }, { x: 19, y: 8 }, { x: 19, y: 10 }, { x: 4, y: 10 }],
    [{ x: 17, y: 4 }, { x: 19, y: 4 }, { x: 19, y: 8 }, { x: 17, y: 8 }],
    [{ x: 4, y: 10 }, { x: 6, y: 10 }, { x: 6, y: 16 }, { x: 4, y: 16 }],
    [{ x: 4, y: 16 }, { x: 28, y: 16 }, { x: 28, y: 19 }, { x: 4, y: 19 }],
  ];
};

// ---- 碰撞區域 ----
export const collisionZones: Record<string, CollisionZone> = {
  skybridge: {
    id: 'skybridge',
    walkableRegions: [
      { minX: 4.5, maxX: 19.0, minY: 8.5, maxY: 10.0 },
      { minX: 17.5, maxX: 19.0, minY: 7.0, maxY: 8.5 },
      { minX: 4.5, maxX: 6.0, minY: 10.0, maxY: 17.0 },
      { minX: 4.5, maxX: 28.0, minY: 16.5, maxY: 19.0 },
      { minX: 17.0, maxX: 28.0, minY: 19.0, maxY: 28.0 },
    ],
    maxX: 28,
    maxY: 28,
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
    if (npcEnding === 'failed') {
      list.push({
        id: 'torn_canvas', label: '被撕碎的空白畫布', type: 'clue',
        pos: { x: 13, y: 9 }, color: '#7a7a8a', icon: '碎',
      });
    } else {
      list.push({
        id: 'painter', label: '天橋畫家', type: 'npc',
        pos: { x: 13, y: 9 },
        color: npcEnding === 'success' ? '#7acc7a' : '#ffaa33',
        icon: npcEnding === 'success' ? '光' : '畫',
      });
    }
    list.push({
      id: 'aoi', label: '小葵', type: 'npc',
      pos: { x: 25, y: 24.5 },
      color: '#ffaa33', icon: '葵',
    });
    list.push({
      id: 'gallery_door', label: '畫廊大門', type: 'clue',
      pos: { x: 18.0, y: 7.0 }, color: '#ec407a', icon: '門',
    });
  }

  // 線索實體由 clueOrder 驅動，此處由呼叫方合併（避免循環依賴）
  return list;
}

// ---- 公園場景裝飾：占據地圖右下角 x=17~28, y=19~28 ----
export const parkScenery: SceneryItem[] = [
  // 西邊 x=17
  { id: 'tree_w1', type: 'tree', pos: { x: 17, y: 21 }, size: 1.2 },
  { id: 'tree_w2', type: 'tree', pos: { x: 17, y: 22.5 }, size: 1.3 },
  { id: 'tree_w3', type: 'tree', pos: { x: 17, y: 23.5 }, size: 1.2 },
  { id: 'tree_w4', type: 'tree', pos: { x: 17, y: 25 }, size: 1.2 },
  { id: 'tree_w5', type: 'tree', pos: { x: 17, y: 26.5 }, size: 1.3 },
  // 東邊 x=28
  { id: 'tree_e1', type: 'tree', pos: { x: 28, y: 21 }, size: 1.2 },
  { id: 'tree_e2', type: 'tree', pos: { x: 28, y: 22.5 }, size: 1.1 },
  { id: 'tree_e3', type: 'tree', pos: { x: 28, y: 23.5 }, size: 1.2 },
  { id: 'tree_e4', type: 'tree', pos: { x: 28, y: 25 }, size: 1.2 },
  { id: 'tree_e5', type: 'tree', pos: { x: 28, y: 26.5 }, size: 1.1 },
  // 北邊 y=19 緊鄰道路，移除樹木避免遮蔽道路
  // 南邊 y=28
  { id: 'tree_s1', type: 'tree', pos: { x: 18, y: 28 }, size: 1.1 },
  { id: 'tree_s2', type: 'tree', pos: { x: 19.5, y: 28 }, size: 1.2 },
  { id: 'tree_s3', type: 'tree', pos: { x: 21, y: 28 }, size: 1.1 },
  { id: 'tree_s4', type: 'tree', pos: { x: 22.5, y: 28 }, size: 1.3 },
  { id: 'tree_s5', type: 'tree', pos: { x: 24, y: 28 }, size: 1.1 },
  { id: 'tree_s6', type: 'tree', pos: { x: 25.5, y: 28 }, size: 1.2 },
  { id: 'tree_s7', type: 'tree', pos: { x: 27, y: 28 }, size: 1.1 },
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
        content: '他沒有重新看見色彩，也沒有立刻變好。\n\n但他終於放下畫筆，坐在失色畫廊的地上，聽見雨聲從遠處回來。\n\n「原來……不畫畫的時候，我也還在。」',
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    return null; // 信號：應該開對話頁
  }

  if (entityId === 'aoi') {
    if (ctx.npcEnding === 'success') {
      return {
        title: '成功結局：靜止的鞦韆',
        content: '她沒有重新開始跳舞，也沒有立刻變好。\n\n但她終於坐在鞦韆上，沒有晃動，只是靜靜地待著。\n\n「原來……不做事的時候，我也還在。」',
        actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
      };
    }
    return null; // 信號：應該開對話頁（ OuterWorldExplorer 處理 onSwitchNpc + onOpenConversation ）
  }

  if (entityId === 'torn_canvas') {
    const hasInteracted = ctx.npcFlags.includes('torn_canvas_first_interaction');
    return hasInteracted ? {
      title: '被撕碎的空白畫布',
      content: '碎布還在原地。雨水繼續浸透它們。\n你注意到最大那塊碎片上的鉛筆線——\n它是一筆從畫框中央向外拖出去的長線，\n在撕裂處戛然而止。\n像一段話，說到一半就斷了。\n\n「連這最後的......空白......你都不肯......留給我嗎？」\n\n你感覺天橋的風變冷了一些。',
      actions: [{ label: '走向終章', tone: 'primary', onClick: ctx.onOpenArcFailure }],
    } : {
      title: '被撕碎的空白畫布',
      content: '你蹲下身，手指觸到濕透的帆布邊緣。\n纖維在水裡泡得發軟，觸感像死去的皮膚。\n你試著把碎片拼回原來的形狀——但它們已經泡皺了，\n再也無法對齊。\n雨水從你的指縫流過，把撕裂的邊緣沖得更碎。\n\n「連這最後的空白，你都不肯留給我嗎？」\n\n（稍後再來看看它吧。）',
    };
  }

  if (entityId === 'gallery_door') {
    if (ctx.npcInnerWorldUnlocked && ctx.npcEnding === 'none') {
      return {
        title: '進入心理世界',
        content: '你站在失色畫廊沉重的雕花橡木門前。\n\n此時你已解鎖了心理世界的存取權，大門正散發著玄妙的心智波動。\n\n是否推開大門，潛入畫家的心理世界（第一層：榮耀美術館）進行探索？',
        actions: [
          { label: '潛入心理世界', tone: 'primary', onClick: ctx.onEnterInnerWorld },
          { label: '留在外面', onClick: () => { ctx.onShowModal(null); } },
        ],
      };
    }
    return {
      title: '進入建築物',
      content: `你站在失色畫廊沉重的雕花橡木門前。\n\n${ctx.npcEnding === 'success' ? '在被開導後，這裡已經泛起了溫暖的色彩，門縫下透出令人安心的金黃色光芒。' : '這扇門被冰冷沉悶的死灰包圍，彷彿封鎖了一段不願示人的過往。'}\n\n是否推開大門進入探索？`,
      actions: [
        {
          label: '推門進入',
          tone: 'primary',
          onClick: () => {
            ctx.onShowModal({
              title: '失色畫廊 - 內部幻境',
              content: `【失色畫廊 · 內部】\n\n你推開了大門。此時畫廊內部呈現出一個宏大的心智空間，牆壁上掛滿了未填滿的畫布。${ctx.npcEnding === 'success' ? '\n\n【治癒共鳴】高大的採光窗下，一道明亮柔和的暖光斜射在地板上。雨聲此時在畫廊內迴響，空洞的灰色畫布上慢慢浮現出春天的線條與輪廓，那是重生的起點。' : '\n\n【失色迴廊】四下寂靜無聲，只有陰暗的灰階霧氣漂浮。所有的作品都沒有顏色，像一座封存了辨色力與希望的宏大墓碑，這就是他封閉的內心深處。\n\n（提示：你尚未解鎖心理世界的探尋權限，需要與畫家進一步對話並收集更多線索）'}`,
              actions: [{ label: '回到外表世界', onClick: () => ctx.onShowModal(null) }],
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
  getMaxX: (_lid: string) => 28,
  getMaxY: (_lid: string) => 28,
  getInteraction,
};
