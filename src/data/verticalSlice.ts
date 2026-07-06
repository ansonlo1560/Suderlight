// ============================================================
// verticalSlice.ts — 保留類型定義 + 向後相容 re-export
// 線索資料已遷移至 src/data/clues/bridgeArtistClues.ts
// 地點資料已遷移至 src/data/locations.ts
// ============================================================

export type NpcId = 'bridge_artist' | 'victor' | 'aoi';

// ---- 向後相容 re-export（避免 import 路徑破壞舊引用） ----

export type { LocationId, LocationData } from './locations';
export { locations, locationOrder } from './locations';

import type { ClueDefinition } from './npcs/types';
import { bridgeArtistClueOrder } from './npcs/bridgePainter';
import { aoiClueOrder } from './npcs/aoi';

import type { BridgeArtistClueId } from './npcs/bridgePainter';
import type { AoiClueId } from './npcs/aoi';

export type { BridgeArtistClueId, AoiClueId };

export type ClueId = BridgeArtistClueId | AoiClueId;

export { bridgeArtistClues, bridgeArtistClueOrder } from './npcs/bridgePainter';
export { aoiClues, aoiClueOrder } from './npcs/aoi';
export { bridgeArtistClueOrder as clueOrder } from './npcs/bridgePainter';

// 通用線索查詢表（用於 gameStore collectClue）
import { bridgeArtistClues } from './npcs/bridgePainter';
import { aoiClues } from './npcs/aoi';

export const ALL_CLUE_ORDER: ClueId[] = [...bridgeArtistClueOrder, ...aoiClueOrder] as ClueId[];

export const ALL_CLUES: Record<ClueId, import('./npcs/types').ClueDefinition> = {
  ...bridgeArtistClues,
  ...aoiClues,
};

export function getNpcIdForClue(clueId: string): NpcId {
  const clue = ALL_CLUES[clueId as ClueId];
  if (clue?.worldId) return clue.worldId as NpcId;
  
  // 後備邏輯：根據線索 ID 前綴或特定關鍵字判斷
  const cid = clueId.toLowerCase();
  if (cid.includes('brush') || cid.includes('newspaper') || cid.includes('sketchbook') || cid.includes('accident')) {
    return 'bridge_artist';
  }
  if (cid.includes('dance') || cid.includes('shoes') || cid.includes('demerit') || cid.includes('diary') || cid.includes('cube')) {
    return 'aoi';
  }
  if (cid.includes('perfume') || cid.includes('smell') || cid.includes('lab') || cid.includes('lilac')) {
    return 'victor';
  }

  
  return 'bridge_artist';
}


// ClueData 向後相容（使用 ClueDefinition 的 alias）
export type { ClueDefinition as ClueData } from './npcs/types';
