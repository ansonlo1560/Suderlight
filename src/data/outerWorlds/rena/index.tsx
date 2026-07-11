// ============================================================
// 蕾娜 (Rena) 表世界資料 — 喜劇俱樂部與醫院
// ============================================================

import React from 'react';
import type { Building, CollisionZone, ElevationFn, EntityTemplate, LocationDisplay, RoadDef, SceneryItem } from '../types';
import { 
  MAP_WIDTH, MAP_HEIGHT, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, PLAYER_SPEED,
  isoToScreen, worldToScreen, distance, clamp, lerp
} from '../bridgePainter';
import type { Point } from '../bridgePainter/types';

export const locationDisplay: LocationDisplay = {
  id: 'comedy_club_entrance',
  name: '表世界：演藝區',
  subtitle: '霓虹燈、後台與遺憾',
  description: '繁華的演藝區隱藏著不為人知的悲劇。從霓虹閃爍的俱樂部入口，到寂靜的後台，再到那間遙遠的病房，蕾娜的故事在這些碎片中拼湊。',
  ambient: '爵士樂餘音、霓虹燈滋滋聲、醫院走廊的寂靜',
};

export const buildings: Building[] = [
  {
    id: 'comedy_club',
    name: '笑聲工廠俱樂部',
    pos: { x: 15, y: 15 },
    size: { x: 6, y: 5 },
    tall: 300,
    baseColor: '#2d3436',
    windows: [
      { side: 'left', x: 0.1, y: 0.2, w: 0.2, h: 0.1 },
      { side: 'left', x: 0.4, y: 0.2, w: 0.2, h: 0.1 },
      { side: 'right', x: 0.1, y: 0.2, w: 0.2, h: 0.1 },
      { side: 'right', x: 0.4, y: 0.2, w: 0.2, h: 0.1 },
    ],
    decorations: ({ points }) => (
      <div style={{
        position: 'absolute',
        left: points.s3.left - 50,
        top: points.s3.top - 150,
        color: '#ff7675',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0 0 10px #ff7675',
        transform: 'skewY(-26.5deg)',
      }}>
        COMEDY CLUB
      </div>
    ),
  },
  {
    id: 'hospital',
    name: '中心醫院',
    pos: { x: 5, y: 20 },
    size: { x: 5, y: 8 },
    tall: 400,
    baseColor: '#dfe6e9',
    windows: [
      { side: 'left', x: 0.2, y: 0.1, w: 0.1, h: 0.05 },
      { side: 'left', x: 0.2, y: 0.3, w: 0.1, h: 0.05 },
      { side: 'left', x: 0.2, y: 0.5, w: 0.1, h: 0.05 },
      { side: 'right', x: 0.2, y: 0.1, w: 0.1, h: 0.05 },
      { side: 'right', x: 0.2, y: 0.3, w: 0.1, h: 0.05 },
    ],
  },
];

export const roadDefs = (locationId: string): RoadDef => {
  // 基本十字路口或簡單連接
  return [
    [{ x: 0, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 12 }, { x: 0, y: 12 }],
    [{ x: 10, y: 0 }, { x: 12, y: 0 }, { x: 12, y: 30 }, { x: 10, y: 30 }],
  ];
};

export const collisionZones: Record<string, CollisionZone> = {
  comedy_club_entrance: { id: 'comedy_club_entrance', walkableRegions: [{ minX: 0, maxX: 30, minY: 0, maxY: 30 }], maxX: 30, maxY: 30 },
  comedy_club_backstage: { id: 'comedy_club_backstage', walkableRegions: [{ minX: 0, maxX: 20, minY: 0, maxY: 20 }], maxX: 20, maxY: 20 },
  hospital_ward: { id: 'hospital_ward', walkableRegions: [{ minX: 0, maxX: 20, minY: 0, maxY: 20 }], maxX: 20, maxY: 20 },
};

export function getEntities(ctx: {
  npcEnding: string;
  npcInnerWorldUnlocked: boolean;
  collectedClues: string[];
  locationId: string;
}): EntityTemplate[] {
  const list: EntityTemplate[] = [];
  const { locationId, npcEnding } = ctx;

  if (locationId === 'comedy_club_backstage') {
    list.push({
      id: 'rena', label: '蕾娜', type: 'npc',
      pos: { x: 5, y: 5 },
      color: npcEnding === 'success' ? '#7acc7a' : '#ff7675',
      icon: '蕾',
    });
    
    // 心理世界傳送門（如果是後台）
    list.push({
      id: 'inner_world_portal', label: '化妝鏡', type: 'clue',
      pos: { x: 5.5, y: 4.5 }, color: '#a29bfe', icon: '鏡',
    });
  }

  if (locationId === 'comedy_club_entrance') {
      list.push({
          id: 'club_door', label: '俱樂部大門', type: 'clue',
          pos: { x: 15, y: 14 }, color: '#ff7675', icon: '門'
      });
  }

  return list;
}

export const getElevation: ElevationFn = (pos: Point) => 0;

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
  if (entityId === 'rena') {
      if (ctx.npcEnding === 'success') {
          return {
              title: '成功結局：謝幕之後',
              content: '蕾娜靜靜地坐在梳妝台前，手裡拿著一支無色的護唇膏。\n「謝謝你，讓我發現不笑的時候，我也能在這裡。」',
              actions: [{ label: '查看餘波匯報', tone: 'primary', onClick: ctx.onOpenReport }],
          };
      }
      return null; // 開對話
  }

  if (entityId === 'inner_world_portal') {
      if (ctx.npcInnerWorldUnlocked && ctx.npcEnding === 'none') {
          return {
              title: '進入心理世界',
              content: '化妝鏡散發著奇異的光芒。是否進入蕾娜的心理世界：鏡面迷宮？',
              actions: [
                  { label: '進入迷宮', tone: 'primary', onClick: ctx.onEnterInnerWorld },
                  { label: '留在原地', onClick: () => ctx.onShowModal(null) }
              ]
          };
      }
  }

  return null;
}

export const renaOuterWorld = {
  id: 'rena_world',
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
  locationOffsets: {},
  getElevation,
  getMaxX: (lid: string) => collisionZones[lid]?.maxX || 30,
  getMaxY: (lid: string) => collisionZones[lid]?.maxY || 30,
  getInteraction,
};
