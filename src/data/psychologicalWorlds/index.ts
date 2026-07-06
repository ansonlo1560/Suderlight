// ============================================================
// 心理世界通用 API
// getAllPsychLayers(npcId) — 接收 npcId，返回對應世界層列表
// ============================================================

import type { NpcId } from '../verticalSlice';
import { ALL_PSYCH_LAYERS } from './bridgePainter/index';
import { victorPsychLayers } from './victor/index';
import type { PsychLayerData, PsychInteractable, UnderstandingReward } from './bridgePainter/index';

// 向後相容：保留 ALL_PSYCH_LAYERS re-export
export { ALL_PSYCH_LAYERS } from './bridgePainter/index';
export type {
  PsychLayerId,
  PsychLayerNumber,
  LayerColorScheme,
  ReflectionChoice,
  PsychInteractable,
  GalleryInteractable,
  PsychLayerData,
  UnderstandingReward,
} from './bridgePainter/index';
// 保留 bridgePainter 的舊版函數（向後相容）
export {
  getPsychLayer,
} from './bridgePainter/index';

import { aoiPsychLayers } from './aoi/index';
import { renaPsychLayers } from './rena/index';

const psychWorldRegistry: Record<NpcId, PsychLayerData[]> = {
  bridge_artist: ALL_PSYCH_LAYERS,
  victor: victorPsychLayers,
  aoi: aoiPsychLayers,
  rena: renaPsychLayers,
};


/**
 * 根據 npcId 取得對應的心理世界層列表
 * 向後相容：保留同名 ALL_PSYCH_LAYERS export（bridge_artist 專用）
 */
export function getAllPsychLayers(npcId: NpcId): PsychLayerData[] {
  return psychWorldRegistry[npcId] ?? [];
}

/**
 * 根據 npcId + 層級編號取得單層資料
 */
export function getPsychLayerForNpc(npcId: NpcId, layerNumber: number): PsychLayerData | undefined {
  return getAllPsychLayers(npcId).find(l => l.layerNumber === layerNumber);
}

/**
 * 通用：根據互動物件 ID 取得理解度獎勵
 * 優先搜索指定 npcId 的資料；若未指定則搜索所有 NPC 資料（向後相容）
 */
export function getUnderstandingReward(
  interactableId: string,
  choseInsight: boolean,
  layerNumber?: number,
  npcId?: NpcId,
): UnderstandingReward | null {
  if (!choseInsight) return null;
  const npcLayers = npcId ? (psychWorldRegistry[npcId] ?? []) : Object.values(psychWorldRegistry).flat();
  const layers = layerNumber ? npcLayers.filter(l => l.layerNumber === layerNumber) : npcLayers;
  for (const layer of layers) {
    const obj = layer.interactables.find((o) => o.id === interactableId);
    if (obj) {
      return {
        interactableId: obj.id,
        amount: obj.understandingReward,
        reason: obj.insight,
        layerId: layer.layerId,
      };
    }
  }
  return null;
}

/**
 * 通用：根據 ID 取得互動物件
 * 優先搜索指定 npcId 的資料；若未指定則搜索所有 NPC 資料（向後相容）
 */
export function getInteractable(id: string, npcId?: NpcId): PsychInteractable | undefined {
  const npcLayers = npcId ? (psychWorldRegistry[npcId] ?? []) : Object.values(psychWorldRegistry).flat();
  for (const layer of npcLayers) {
    const obj = layer.interactables.find((o) => o.id === id);
    if (obj) return obj;
  }
  return undefined;
}

/**
 * 通用：根據層級編號取得所有互動物件（搜索所有 NPC 資料）
 */
export function getLayerInteractables(layerNumber: number, npcId?: NpcId): PsychInteractable[] {
  const npcLayers = npcId ? (psychWorldRegistry[npcId] ?? []) : Object.values(psychWorldRegistry).flat();
  const layer = npcLayers.find(l => l.layerNumber === layerNumber);
  return layer?.interactables ?? [];
}
