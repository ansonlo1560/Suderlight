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

import type { BridgeArtistClueId } from './npcs/bridgePainter';

export type { BridgeArtistClueId };

export type ClueId = BridgeArtistClueId;

export { bridgeArtistClues, bridgeArtistClueOrder } from './npcs/bridgePainter';
export { bridgeArtistClueOrder as clueOrder } from './npcs/bridgePainter';

// 通用線索查詢表（用於 gameStore collectClue）
import { bridgeArtistClues } from './npcs/bridgePainter';

export const ALL_CLUE_ORDER: ClueId[] = [...bridgeArtistClueOrder] as ClueId[];

export const ALL_CLUES: Record<ClueId, import('./npcs/types').ClueDefinition> = {
  ...bridgeArtistClues,
};

export function getNpcIdForClue(clueId: ClueId): NpcId {
  const clue = ALL_CLUES[clueId];
  return (clue?.worldId as NpcId) ?? 'bridge_artist';
}

// ClueData 向後相容（使用 ClueDefinition 的 alias）
export type { ClueDefinition as ClueData } from './npcs/types';
