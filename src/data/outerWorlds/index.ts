// ============================================================
// 表世界模組註冊中心
// 每個 LocationId 對應一個 outerWorld 模組
// OuterWorldExplorer.tsx 透過此處動態取得當前地點的世界資料
// ============================================================

import type { LocationId } from '../locations';
import type { Building, CollisionZone, ElevationFn, EntityTemplate, LocationDisplay, RoadDef, SceneryItem } from './types';
import type { Point } from './bridgePainter/types';

// ---- 引入各角色表世界 ----
import {
  bridgePainterOuterWorld,
  MAP_WIDTH, MAP_HEIGHT, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, PLAYER_SPEED,
  isoToScreen, worldToScreen, distance, clamp, lerp,
} from './bridgePainter';

// ---- 統一工具函數（以 bridgePainter 為基準座標系） ----
export {
  MAP_WIDTH, MAP_HEIGHT, TILE_W, TILE_H, ORIGIN_X, ORIGIN_Y, PLAYER_SPEED,
  isoToScreen, worldToScreen, distance, clamp, lerp,
} from './bridgePainter';

// ---- 模組型別 ----
export type OuterWorldModule = {
  id: string;
  mapWidth: number;
  mapHeight: number;
  tileW: number;
  tileH: number;
  originX: number;
  originY: number;
  playerSpeed: number;
  buildings: Building[];
  roadDefs: (locationId: string) => RoadDef;
  collisionZones: Record<string, CollisionZone>;
  getEntities: (ctx: {
    npcEnding: string;
    npcInnerWorldUnlocked: boolean;
    collectedClues: string[];
    locationId: string;
  }) => EntityTemplate[];
  locationDisplay: LocationDisplay;
  locationOffsets: Record<string, { x: number; y: number }>;
  /** 場景裝飾：不具互動性的地圖元素，例如公園的樹、草、鞦韆、滑梯 */
  scenery?: SceneryItem[];
  getElevation: ElevationFn;
  getMaxX: (locationId: string) => number;
  getMaxY: (locationId: string) => number;
  getInteraction?: (
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
  ) => { title: string; content: string; actions?: Array<{ label: string; tone?: string; onClick: () => void }> } | null;
};

// ---- 註冊表：LocationId → 世界模組 ----
const worldRegistry: Record<LocationId, OuterWorldModule> = {
  skybridge: bridgePainterOuterWorld as OuterWorldModule,
};

// ---- 輔助函數 ----

/** 根據 LocationId 取得對應的表世界模組 */
export function getWorldForLocation(locationId: LocationId): OuterWorldModule {
  return worldRegistry[locationId] ?? bridgePainterOuterWorld as OuterWorldModule;
}

/** 根據 LocationId 取得該地點的顯示資訊 */
export function getLocationDisplay(locationId: LocationId): LocationDisplay {
  const world = getWorldForLocation(locationId);
  return world.locationDisplay;
}

/** 根據 LocationId 取得該地點的建築物 */
export function getBuildingsForLocation(locationId: LocationId): Building[] {
  return getWorldForLocation(locationId).buildings;
}

/** 根據 LocationId 取得該地點的道路定義 */
export function getRoadDefsForLocation(locationId: LocationId): RoadDef {
  const world = getWorldForLocation(locationId);
  return world.roadDefs(locationId);
}

/** 根據 LocationId 取得該地點的碰撞區域 */
export function getCollisionZoneForLocation(locationId: LocationId): CollisionZone | undefined {
  const world = getWorldForLocation(locationId);
  return world.collisionZones[locationId];
}

/** 根據 LocationId 取得該地點的最大邊界 */
export function getBoundsForLocation(locationId: LocationId): { maxX: number; maxY: number } {
  const world = getWorldForLocation(locationId);
  return { maxX: world.getMaxX(locationId), maxY: world.getMaxY(locationId) };
}

/** 根據 LocationId 取得海拔函數 */
export function getElevationForLocation(locationId: LocationId): ElevationFn {
  const world = getWorldForLocation(locationId);
  return world.getElevation;
}

/** 取得所有註冊的世界模組 ID */
export function getRegisteredWorldIds(): string[] {
  return [...new Set(Object.values(worldRegistry).map(w => w.id))];
}

// ---- 向後相容：直接 re-export bridgePainter 的 utilities（避免破壞既有引用） ----
export { getSkybridgeElevation } from './bridgePainter';
