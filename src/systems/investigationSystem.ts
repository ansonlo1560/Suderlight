import { ALL_CLUES } from '../data/verticalSlice';
import type { NpcId } from '../data/verticalSlice';

/**
 * 取得線索知識量
 */
export function getClueKnowledge(clueId: string, _npcId: NpcId = 'bridge_artist') {
  const clue = (ALL_CLUES as Record<string, { knowledge: number }>)[clueId];
  return clue?.knowledge ?? 0;
}

export function getClueData(clueId: string, _npcId: NpcId = 'bridge_artist') {
  return (ALL_CLUES as Record<string, unknown>)[clueId];
}

