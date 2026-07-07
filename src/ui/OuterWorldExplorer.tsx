import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { GlimmerButton, GlassPanel } from '../components';
import { ALL_CLUES, ALL_CLUE_ORDER, locations, type ClueId, type LocationId, type NpcId } from '../data/verticalSlice';
import { getPlayerAuthHeaders } from '../lib/playerId';
import type { CollectClueResult } from '../store/gameStore';
import type { GameSave } from '../systems/saveSystem';
import { getWorldForLocation, getBoundsForLocation } from '../data/outerWorlds';
import type { OuterWorldModule } from '../data/outerWorlds';
import {isoToScreen, worldToScreen, distance, clamp, lerp,} from '../data/outerWorlds/bridgePainter';
import brushImage from '../../images/item/ChatGPT Image 2026年5月29日 下午10_49_08.png';
import newspaperImage from '../../images/item/ChatGPT Image 2026年5月29日 下午10_50_17.png';
import sketchbookImage from '../../images/item/ChatGPT Image 2026年5月29日 下午10_51_17.png';
import muddyRedDanceShoesImage from '../../images/aoi/map-danceShoe.png';
import demeritNoticeImage from '../../images/aoi/map-demeritNotice.png';
import tornDiaryImage from '../../images/aoi/map-brokenDairy.png';
import rubiksCubeImage from '../../images/aoi/map-cube.png';
import aoiImage from '../../images/aoi/Aoi.png';
import aoiGoneImage from '../../images/aoi/AoiGone.png';
import painterImage from '../../images/character/IMG_3556.png';
import painterUnlockedImage from '../../images/character/IMG_3562.png';
import painterGoneImage from '../../images/painter/painterGone.png';

import type { SceneryItem } from '../data/outerWorlds/types';

// ---- 型別 ----
type Point = { x: number; y: number };
type EntityId = string;
type ModalAction = { label: string; tone?: 'primary' | 'danger' | 'ghost'; onClick: () => void };
type ModalState = { title: string; content: string; actions?: ModalAction[]; discoveryContent?: string; discoveryTitle?: string; discoveryDesc?: string } | null;

type Entity = {
  id: EntityId;
  label: string;
  type: 'npc' | 'clue' | 'portal';
  pos: Point;
  color: string;
  icon: string;
};

type OuterWorldExplorerProps = {
  save: GameSave;
  collectClue: (clueId: ClueId) => CollectClueResult;
  setCurrentLocation: (locationId: LocationId) => void;
  resetSave: () => void;
  onOpenConversation: () => void;
  onOpenDictionary: () => void;
  onOpenTavern: () => void;
  onOpenReport: () => void;
  onEnterInnerWorld: () => void;
  addFlagToNpc: (npcId: NpcId, flag: string) => void;
  onOpenArcFailure: () => void;
  npcId?: NpcId;
  onSwitchNpc?: (npcId: NpcId) => void;
  setPlayerPos?: (x: number, y: number) => void;
};

// ---- 工具 ----
const CLUE_IMAGE_MAP: Partial<Record<ClueId, string>> = {
  brush: brushImage,
  newspaper: newspaperImage,
  sketchbook: sketchbookImage,
  accident_report: newspaperImage,
  muddy_red_dance_shoes: muddyRedDanceShoesImage,
  demerit_notice: demeritNoticeImage,
  torn_diary: tornDiaryImage,
  rubiks_cube: rubiksCubeImage,
};

function clueName(clueId: ClueId) {
  return (ALL_CLUES as Record<string, { label: string }>)[clueId]?.label ?? clueId;
}

function adjustColorBrightness(hex: string, percent: number) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  const cc = (v: number) => Math.max(0, Math.min(255, v));
  return `#${cc(R).toString(16).padStart(2, '0')}${cc(G).toString(16).padStart(2, '0')}${cc(B).toString(16).padStart(2, '0')}`;
}

// ---- 位置 → NPC 對應表（未來可移至註冊中心） ----
function getNpcIdForLocation(locationId: LocationId): NpcId {
  if (locationId === 'skybridge') return 'bridge_artist';
  if (locationId === 'comedy_club_entrance' || locationId === 'comedy_club_backstage' || locationId === 'hospital_ward') return 'rena';
  return 'bridge_artist';
}

function getNpcStateForLocation(locationId: LocationId, save: GameSave, entityId?: string) {
  if (entityId === 'rena') return save.npcs['rena'];
  if (entityId === 'aoi') return save.npcs['aoi'];
  const npcId = getNpcIdForLocation(locationId);
  return save.npcs[npcId];
}

// ---- 等角建築渲染 ----
type WindowDef = { side: 'left' | 'right'; x: number; y: number; w: number; h: number };
type Building = {
  id: string;
  name: string;
  pos: Point;
  size: { x: number; y: number };
  tall: number;
  baseColor: string;
  windows?: WindowDef[];
  decorations?: (ctx: {
    isRepaired: boolean;
    points: {
      s0: { left: number; top: number };
      s1: { left: number; top: number };
      s2: { left: number; top: number };
      s3: { left: number; top: number };
      t0: { left: number; top: number };
      t1: { left: number; top: number };
      t2: { left: number; top: number };
      t3: { left: number; top: number };
    };
  }) => React.ReactNode;
};

function getSurfacePoint(side: 'left' | 'right', rX: number, rY: number, s1: { left: number; top: number }, s2: { left: number; top: number }, s3: { left: number; top: number }, t1: { left: number; top: number }, t2: { left: number; top: number }, t3: { left: number; top: number }) {
  const bSide = side === 'left' ? s3 : s2;
  const bOther = side === 'left' ? s2 : s1;
  const tSide = side === 'left' ? t3 : t2;
  const tOther = side === 'left' ? t2 : t1;
  const bPt = { left: lerp(bSide.left, bOther.left, rX), top: lerp(bSide.top, bOther.top, rX) };
  const tPt = { left: lerp(tSide.left, tOther.left, rX), top: lerp(tSide.top, tOther.top, rX) };
  return { left: lerp(bPt.left, tPt.left, rY), top: lerp(bPt.top, tPt.top, rY) };
}

function getWindowPoints(win: WindowDef, s1: any, s2: any, s3: any, t1: any, t2: any, t3: any) {
  const p00 = getSurfacePoint(win.side, win.x, win.y, s1, s2, s3, t1, t2, t3);
  const p10 = getSurfacePoint(win.side, win.x + win.w, win.y, s1, s2, s3, t1, t2, t3);
  const p11 = getSurfacePoint(win.side, win.x + win.w, win.y + win.h, s1, s2, s3, t1, t2, t3);
  const p01 = getSurfacePoint(win.side, win.x, win.y + win.h, s1, s2, s3, t1, t2, t3);
  return `${p00.left},${p00.top} ${p10.left},${p10.top} ${p11.left},${p11.top} ${p01.left},${p01.top}`;
}

function IsometricBuilding({ building, isRepaired, mapWidth, mapHeight }: { building: Building; isRepaired: boolean; mapWidth: number; mapHeight: number }) {
  const p0 = { x: building.pos.x, y: building.pos.y };
  const p1 = { x: building.pos.x + building.size.x, y: building.pos.y };
  const p2 = { x: building.pos.x + building.size.x, y: building.pos.y + building.size.y };
  const p3 = { x: building.pos.x, y: building.pos.y + building.size.y };
  const s0 = isoToScreen(p0), s1 = isoToScreen(p1), s2 = isoToScreen(p2), s3 = isoToScreen(p3);
  const t0 = { left: s0.left, top: s0.top - building.tall }, t1 = { left: s1.left, top: s1.top - building.tall }, t2 = { left: s2.left, top: s2.top - building.tall }, t3 = { left: s3.left, top: s3.top - building.tall };
  const topFace = `${t0.left},${t0.top} ${t1.left},${t1.top} ${t2.left},${t2.top} ${t3.left},${t3.top}`;
  const leftFace = `${s3.left},${s3.top} ${s2.left},${s2.top} ${t2.left},${t2.top} ${t3.left},${t3.top}`;
  const rightFace = `${s2.left},${s2.top} ${s1.left},${s1.top} ${t1.left},${t1.top} ${t2.left},${t2.top}`;
  const c = building.baseColor;
  const mc = isRepaired ? c : '#3a3a3a';
  const lc = isRepaired ? adjustColorBrightness(c, 25) : '#5a5a5a';
  const dc = isRepaired ? adjustColorBrightness(c, -25) : '#222222';

  const gWin: WindowDef | null = building.id === 'gallery' ? { side: 'left', x: 0.36, y: 0.05, w: 0.28, h: 0.44 } : null;
  const gFrame: WindowDef | null = gWin ? { side: gWin.side, x: gWin.x - 0.03, y: gWin.y - 0.04, w: gWin.w + 0.06, h: gWin.h + 0.06 } : null;
  const gPts = gWin ? getWindowPoints(gWin, s1, s2, s3, t1, t2, t3) : null;
  const gFPts = gFrame ? getWindowPoints(gFrame, s1, s2, s3, t1, t2, t3) : null;
  const knob = gWin ? getSurfacePoint(gWin.side, gWin.x + gWin.w * 0.78, gWin.y + gWin.h * 0.58, s1, s2, s3, t1, t2, t3) : null;

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: mapWidth, height: mapHeight, pointerEvents: 'none', zIndex: Math.round(s2.top) }}>
      <svg width={mapWidth} height={mapHeight} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <polygon points={`${s0.left},${s0.top} ${s1.left},${s1.top} ${s2.left},${s2.top} ${s3.left},${s3.top}`} fill="rgba(0,0,0,0.45)" filter="blur(8px)" />
        <polygon points={leftFace} fill={mc} stroke={isRepaired ? adjustColorBrightness(c, -10) : '#1a1a1a'} strokeWidth="1.5" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease' }} />
        <polygon points={rightFace} fill={dc} stroke={isRepaired ? adjustColorBrightness(c, -30) : '#121212'} strokeWidth="1.5" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease' }} />
        <polygon points={topFace} fill={lc} stroke={isRepaired ? adjustColorBrightness(c, 10) : '#2a2a2a'} strokeWidth="1.5" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease' }} />
        {building.windows?.map((w, i) => {
          const pts = getWindowPoints(w, s1, s2, s3, t1, t2, t3);
          return <polygon key={i} points={pts} fill={isRepaired ? '#ffd54f' : 'rgba(255,255,255,0.05)'} style={{ transition: 'fill 1.5s ease', filter: isRepaired ? 'drop-shadow(0px 0px 4px rgba(255,213,79,0.85))' : 'none' }} />;
        })}
        {gFPts && <polygon points={gFPts} fill={isRepaired ? 'rgba(96,42,77,0.94)' : 'rgba(30,30,34,0.95)'} stroke={isRepaired ? 'rgba(255,214,150,0.45)' : 'rgba(255,255,255,0.12)'} strokeWidth="1.2" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease', filter: isRepaired ? 'drop-shadow(0 0 6px rgba(255,180,120,0.18))' : 'none' }} />}
        {gPts && <polygon points={gPts} fill={isRepaired ? 'rgba(62,22,48,0.96)' : 'rgba(16,16,18,0.96)'} stroke={isRepaired ? 'rgba(255,196,132,0.28)' : 'rgba(255,255,255,0.08)'} strokeWidth="1" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease' }} />}
        {gWin && <line x1={getSurfacePoint(gWin.side, gWin.x + gWin.w * 0.52, gWin.y, s1, s2, s3, t1, t2, t3).left} y1={getSurfacePoint(gWin.side, gWin.x + gWin.w * 0.52, gWin.y, s1, s2, s3, t1, t2, t3).top} x2={getSurfacePoint(gWin.side, gWin.x + gWin.w * 0.52, gWin.y + gWin.h, s1, s2, s3, t1, t2, t3).left} y2={getSurfacePoint(gWin.side, gWin.x + gWin.w * 0.52, gWin.y + gWin.h, s1, s2, s3, t1, t2, t3).top} stroke={isRepaired ? 'rgba(255,230,180,0.32)' : 'rgba(255,255,255,0.08)'} strokeWidth="0.9" style={{ transition: 'stroke 1.5s ease' }} />}
        {knob && <circle cx={knob.left} cy={knob.top} r={2.3} fill={isRepaired ? '#ffdca8' : '#8a8a92'} stroke={isRepaired ? 'rgba(120,74,22,0.7)' : 'rgba(25,25,28,0.9)'} strokeWidth="0.8" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease', filter: isRepaired ? 'drop-shadow(0 0 5px rgba(255,212,140,0.45))' : 'none' }} />}
      </svg>
      <div style={{ position: 'absolute', left: s2.left, top: s0.top - building.tall - 20, transform: 'translateX(-50%)', color: isRepaired ? '#fff' : '#888', fontSize: 11, padding: '2px 6px', background: isRepaired ? 'rgba(30,40,50,0.85)' : 'rgba(0,0,0,0.65)', border: `1px solid ${isRepaired ? '#ffe082' : '#444'}`, borderRadius: 4, boxShadow: isRepaired ? '0 0 10px rgba(255,224,130,0.3)' : 'none', pointerEvents: 'auto', userSelect: 'none' }}>{building.name}</div>
      {building.decorations?.({
        isRepaired,
        points: {
          s0, s1, s2, s3,
          t0, t1, t2, t3,
        },
      })}
    </div>
  );
}

// ---- 道路渲染 ----
const BRIDGE_RAIL_HEIGHT = 14;
const BRIDGE_DECK_ELEVATION = 76;

function IsometricRoads({ world, locationId, isRepaired }: { world: OuterWorldModule; locationId: LocationId; isRepaired: boolean }) {
  const rDefs = useMemo(() => world.roadDefs(locationId), [world, locationId]);
  const toElevatedScreen = (pt: Point) => {
    const b = isoToScreen(pt);
    return { left: b.left, top: b.top - world.getElevation(pt) };
  };
  const roadFill = isRepaired ? 'rgba(45,64,89,0.45)' : 'rgba(30,30,30,0.65)';
  const roadStroke = isRepaired ? 'rgba(255,224,130,0.35)' : 'rgba(255,255,255,0.06)';

  const bridgeDetails = useMemo(() => {
    if (locationId !== 'skybridge') return null;
    const piers = [
      { deck: toElevatedScreen({ x: 4.0, y: 10 }), base: isoToScreen({ x: 4.0, y: 10 }) },
      { deck: toElevatedScreen({ x: 7.5, y: 10 }), base: isoToScreen({ x: 7.5, y: 10 }) },
      { deck: toElevatedScreen({ x: 11.5, y: 10 }), base: isoToScreen({ x: 11.5, y: 10 }) },
      { deck: toElevatedScreen({ x: 15.5, y: 10 }), base: isoToScreen({ x: 15.5, y: 10 }) },
      { deck: toElevatedScreen({ x: 18.5, y: 10 }), base: isoToScreen({ x: 18.5, y: 10 }) },
      { deck: toElevatedScreen({ x: 17.0, y: 6.0 }), base: isoToScreen({ x: 17.0, y: 6.0 }) },
      { deck: toElevatedScreen({ x: 19.0, y: 6.0 }), base: isoToScreen({ x: 19.0, y: 6.0 }) },
    ];
    const railings: Array<Array<{ p1: { left: number; top: number }; p2: { left: number; top: number } }>> = [];
    const rA: typeof railings[0] = [];
    for (let x = 6.0; x <= 19.01; x += 0.8) { const p = toElevatedScreen({ x, y: 10 }); rA.push({ p1: p, p2: { left: p.left, top: p.top - BRIDGE_RAIL_HEIGHT } }); }
    railings.push(rA);
    const rB: typeof railings[0] = [];
    for (let x = 4.0; x <= 16.61; x += 0.8) { const p = toElevatedScreen({ x, y: 8 }); rB.push({ p1: p, p2: { left: p.left, top: p.top - BRIDGE_RAIL_HEIGHT } }); }
    const pLast = toElevatedScreen({ x: 17.0, y: 8.0 }); rB.push({ p1: pLast, p2: { left: pLast.left, top: pLast.top - BRIDGE_RAIL_HEIGHT } });
    railings.push(rB);
    const rC: typeof railings[0] = [];
    for (let y = 4.0; y <= 8.0; y += 0.8) { const p = toElevatedScreen({ x: 17, y }); rC.push({ p1: p, p2: { left: p.left, top: p.top - BRIDGE_RAIL_HEIGHT } }); }
    railings.push(rC);
    const rD: typeof railings[0] = [];
    for (let y = 4.0; y <= 9.61; y += 0.8) { const p = toElevatedScreen({ x: 19, y }); rD.push({ p1: p, p2: { left: p.left, top: p.top - BRIDGE_RAIL_HEIGHT } }); }
    const pLast2 = toElevatedScreen({ x: 19, y: 10.0 }); rD.push({ p1: pLast2, p2: { left: pLast2.left, top: pLast2.top - BRIDGE_RAIL_HEIGHT } });
    railings.push(rD);
    const rL: typeof railings[0] = []; for (let y = 10.0; y <= 16.01; y += 0.8) { const p = toElevatedScreen({ x: 4, y }); rL.push({ p1: p, p2: { left: p.left, top: p.top - BRIDGE_RAIL_HEIGHT } }); } railings.push(rL);
    const rR: typeof railings[0] = []; for (let y = 10.0; y <= 16.01; y += 0.8) { const p = toElevatedScreen({ x: 6, y }); rR.push({ p1: p, p2: { left: p.left, top: p.top - BRIDGE_RAIL_HEIGHT } }); } railings.push(rR);
    return { piers, railings };
  }, [locationId, toElevatedScreen]);

  return (
    <svg width={world.mapWidth} height={world.mapHeight} style={{ position: 'absolute', left: 0, top: 0, zIndex: 1, pointerEvents: 'none', overflow: 'visible' }}>
      {locationId === 'skybridge' && bridgeDetails && (
        <g>{bridgeDetails.piers.map((pier, i) => {
          const sh = Math.max(26, pier.base.top - pier.deck.top + 22);
          return (<g key={i}><rect x={pier.deck.left - 3} y={pier.deck.top} width={6} height={sh} rx={2} fill={isRepaired ? 'rgba(116,143,171,0.22)' : 'rgba(120,128,140,0.12)'} stroke={isRepaired ? 'rgba(255,224,130,0.10)' : 'rgba(255,255,255,0.05)'} strokeWidth="1" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease' }} /><rect x={pier.base.left - 6} y={pier.base.top + 20} width={12} height={4} rx={1} fill={isRepaired ? 'rgba(72,96,124,0.18)' : 'rgba(90,96,110,0.10)'} style={{ transition: 'fill 1.5s ease' }} /></g>);
        })}</g>
      )}
      {rDefs.map((pts, idx) => {
        const sp = pts.map(pt => toElevatedScreen(pt));
        const ptsStr = sp.map(p => `${p.left},${p.top}`).join(' ');
        const isStairs = locationId === 'skybridge' && idx === 2;
        return (<g key={idx}>
          {isRepaired && <polygon points={ptsStr} fill="none" stroke="rgba(255,224,130,0.12)" strokeWidth="12" style={{ filter: 'blur(4px)', transition: 'stroke 1.5s ease' }} />}
          <polygon points={ptsStr} fill={roadFill} stroke={roadStroke} strokeWidth="2.5" style={{ transition: 'fill 1.5s ease, stroke 1.5s ease' }} />
          {locationId === 'skybridge' && idx <= 1 && <polygon points={`${sp[2].left},${sp[2].top} ${sp[3].left},${sp[3].top} ${isoToScreen(pts[3]).left},${isoToScreen(pts[3]).top} ${isoToScreen(pts[2]).left},${isoToScreen(pts[2]).top}`} fill="rgba(22,30,40,0.24)" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />}
          {isStairs && <g>{Array.from({ length: 18 }).map((_, si) => { const t = si / 17; const sy = lerp(10.08, 15.92, t); const p1 = toElevatedScreen({ x: 4, y: sy }); const p2 = toElevatedScreen({ x: 6, y: sy }); return (<g key={si}><line x1={p1.left} y1={p1.top} x2={p2.left} y2={p2.top} stroke={isRepaired ? 'rgba(255,224,130,0.52)' : 'rgba(255,255,255,0.22)'} strokeWidth="1.6" /><line x1={p1.left} y1={p1.top + 3} x2={p2.left} y2={p2.top + 3} stroke="rgba(0,0,0,0.28)" strokeWidth="1" /></g>); })}</g>}
        </g>);
      })}
      {locationId === 'skybridge' && bridgeDetails && (
        <g>{bridgeDetails.railings.map((rg, gi) => (<g key={gi}>{rg.map((l, i) => (<line key={i} x1={l.p1.left} y1={l.p1.top} x2={l.p2.left} y2={l.p2.top} stroke={isRepaired ? 'rgba(255,224,130,0.45)' : 'rgba(255,255,255,0.15)'} strokeWidth="1" style={{ transition: 'stroke 1.5s ease' }} />))}{rg.length > 0 && <path d={`M ${rg[0].p2.left} ${rg[0].p2.top} ` + rg.slice(1).map(l => `L ${l.p2.left} ${l.p2.top}`).join(' ')} fill="none" stroke={isRepaired ? 'rgba(255,224,130,0.65)' : 'rgba(255,255,255,0.25)'} strokeWidth="1.5" style={{ transition: 'stroke 1.5s ease' }} />}</g>))}</g>
      )}
    </svg>
  );
}

// ---- 公園場景裝飾 ----
function ParkScenery({ world, locationId, scenery, isRepaired }: { world: OuterWorldModule; locationId: LocationId; scenery?: SceneryItem[]; isRepaired?: boolean }) {
  if (!scenery || scenery.length === 0) return null;
  const items = useMemo(() => {
    return [...scenery].sort((a, b) => a.pos.y - b.pos.y || a.pos.x - b.pos.x);
  }, [scenery]);

  const renderItem = (item: SceneryItem) => {
    const s = isoToScreen(item.pos);
    const elev = world.getElevation(item.pos);
    const top = s.top - elev;
    const left = s.left;
    const scale = item.size ?? 1;
    const key = `${item.id}-${locationId}`;

    switch (item.type) {
      case 'tree': {
        const trunkW = 6 * scale;
        const trunkH = 26 * scale;
        const crownR = 20 * scale;
        const trunkFill = isRepaired ? '#4a3728' : '#5a5a5a';
        const crownFills = isRepaired
          ? ['#2e7d32', '#388e3c', '#1b5e20']
          : ['#555555', '#444444', '#333333'];
        return (
          <g key={key} transform={`translate(${left}, ${top})`}>
            <rect x={-trunkW / 2} y={-trunkH} width={trunkW} height={trunkH} fill={trunkFill} />
            <circle cx={0} cy={-trunkH - crownR * 0.4} r={crownR} fill={crownFills[0]} opacity="0.95" />
            <circle cx={-crownR * 0.3} cy={-trunkH - crownR * 0.7} r={crownR * 0.7} fill={crownFills[1]} opacity="0.9" />
            <circle cx={crownR * 0.3} cy={-trunkH - crownR * 0.6} r={crownR * 0.75} fill={crownFills[2]} opacity="0.85" />
          </g>
        );
      }
      case 'grass': {
        const h = 12 * scale;
        const offsets = [-5, 0, 5];
        const tilts = [-3, 0, 3];
        const stroke = isRepaired ? '#4caf50' : '#666666';
        return (
          <g key={key} transform={`translate(${left}, ${top})`}>
            {offsets.map((off, i) => (
              <line key={i} x1={off} y1={0} x2={off + tilts[i]} y2={-h} stroke={stroke} strokeWidth="1.5" opacity="0.7" />
            ))}
          </g>
        );
      }
      case 'swing': {
        const frameW = 40 * scale;
        const frameH = 48 * scale;
        const frameStroke = isRepaired ? '#5d4037' : '#555555';
        const ropeStroke = isRepaired ? '#8d6e63' : '#666666';
        const seatFill = isRepaired ? '#a1887f' : '#777777';
        return (
          <g key={key} transform={`translate(${left}, ${top})`}>
            <line x1={-frameW / 2} y1={0} x2={-frameW / 2} y2={-frameH} stroke={frameStroke} strokeWidth="2" />
            <line x1={frameW / 2} y1={0} x2={frameW / 2} y2={-frameH} stroke={frameStroke} strokeWidth="2" />
            <line x1={-frameW / 2} y1={-frameH} x2={frameW / 2} y2={-frameH} stroke={frameStroke} strokeWidth="2" />
            <line x1={-10} y1={-frameH} x2={-10} y2={-frameH + 18} stroke={ropeStroke} strokeWidth="2" />
            <line x1={10} y1={-frameH} x2={10} y2={-frameH + 18} stroke={ropeStroke} strokeWidth="2" />
            <rect x={-12} y={-frameH + 18} width={24} height={7} rx={2} fill={seatFill} />
          </g>
        );
      }
      case 'slide': {
        const w = 44 * scale;
        const h = 34 * scale;
        const slideFill = isRepaired ? '#ef5350' : '#555555';
        const frameStroke = isRepaired ? '#5d4037' : '#444444';
        return (
          <g key={key} transform={`translate(${left}, ${top})`}>
            <path d={`M ${-w / 2} 0 L ${w / 2} ${-h} L ${w / 2 + 4} ${-h} L ${-w / 2 + 4} 0 Z`} fill={slideFill} opacity="0.9" />
            <line x1={-w / 2 + 4} y1={0} x2={-w / 2 + 4} y2={-h - 8} stroke={frameStroke} strokeWidth="3" />
            <line x1={w / 2 + 4} y1={-h} x2={w / 2 + 4} y2={-h - 8} stroke={frameStroke} strokeWidth="3" />
            <line x1={-w / 2 + 4} y1={-h - 8} x2={w / 2 + 4} y2={-h - 8} stroke={frameStroke} strokeWidth="3" />
            <line x1={-w / 2 + 6} y1={-2} x2={-w / 2 + 6} y2={-h - 6} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={-w / 2 + 4} y1={-i * 7 - 4} x2={w / 2 + 4} y2={-h - i * 7 - 4} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
            ))}
          </g>
        );
      }
      default:
        return null;
    }
  };

  return (
    <svg width={world.mapWidth} height={world.mapHeight} style={{ position: 'absolute', left: 0, top: 0, zIndex: 2, pointerEvents: 'none', overflow: 'visible' }}>
      {items.map(renderItem)}
    </svg>
  );
}

// ============================================================
export default function OuterWorldExplorer({
  save, collectClue, setCurrentLocation, resetSave, onOpenConversation, onOpenDictionary, onOpenTavern, onOpenReport, onEnterInnerWorld, addFlagToNpc, onOpenArcFailure, npcId: _npcId, onSwitchNpc, setPlayerPos,
}: OuterWorldExplorerProps) {
  const spawnPoint = locations[save.currentLocation].spawn;
  const [playerPos, setPlayerPosState] = useState<Point>(
    (save.playerX != null && save.playerY != null)
      ? { x: save.playerX, y: save.playerY }
      : spawnPoint
  );
  const [isDragging, setIsDragging] = useState(false);
  const [mapPos, setMapPos] = useState({ x: -320, y: -160 });
  const [modal, setModal] = useState<ModalState>(null);
  const [ghostFlash, setGhostFlash] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const keys = useRef(new Set<string>());

  // ---- 動態取得當前世界模組 ----
  const world = useMemo<OuterWorldModule>(() => getWorldForLocation(save.currentLocation), [save.currentLocation]);
  const bounds = useMemo(() => getBoundsForLocation(save.currentLocation), [save.currentLocation]);
  
  // 1. 取得場景主導的 NPC 狀態（用於場景渲染）
  const primaryNpcId = useMemo(() => getNpcIdForLocation(save.currentLocation), [save.currentLocation]);
  const primaryNpcState = useMemo(() => save.npcs[primaryNpcId], [save, primaryNpcId]);
  const isRepaired = primaryNpcState?.ending === 'success';

  const displayLoc = useMemo(() => {
    return { ...world.locationDisplay, id: save.currentLocation as LocationId, spawn: locations[save.currentLocation].spawn };
  }, [world, save.currentLocation]);

  const entities = useMemo<Entity[]>(() => {
    const list: Entity[] = [];

    // 由世界模組提供實體
    const worldEntities = world.getEntities({
      npcEnding: primaryNpcState?.ending ?? 'none',
      npcInnerWorldUnlocked: primaryNpcState?.innerWorldUnlocked ?? false,
      collectedClues: save.collectedClues,
      locationId: save.currentLocation,
      save, // 傳入完整的 save 供 map 模組獲取其他 NPC 狀態
    } as any);

    list.push(...worldEntities.map(e => ({ ...e, type: e.type as 'npc' | 'clue' | 'portal' })));

    // 線索實體
    ALL_CLUE_ORDER.forEach(clueId => {
      const clue = (ALL_CLUES as Record<string, { locationId: string; pos: Point; label: string; color: string; icon: string }>)[clueId];
      if (!clue) return;
      const isVisible = clue.locationId === save.currentLocation;
      if (isVisible && !save.collectedClues.includes(clueId as ClueId)) {
        list.push({ id: clueId as ClueId, label: clue.label, type: 'clue', pos: clue.pos, color: clue.color, icon: clue.icon });
      }
    });

    return list;
  }, [world, primaryNpcState, save.collectedClues, save.currentLocation]);

  const nearbyEntity = entities.find(e => distance(e.pos, playerPos) <= 1.35);

  // 2. 計算當前活躍的 NPC 狀態（用於 HUD 顯示）
  const activeNpcState = useMemo(() => getNpcStateForLocation(save.currentLocation, save, nearbyEntity?.id), [save.currentLocation, save, nearbyEntity?.id]);



  const focusCameraOnPlayer = (pos: Point) => {
    const base = isoToScreen(pos);
    const elev = world.getElevation(pos);
    const s = { left: base.left, top: base.top - elev };
    setMapPos({ x: clamp(window.innerWidth / 2 - s.left, window.innerWidth - world.mapWidth, 0), y: clamp(window.innerHeight / 2 - s.top + 80, window.innerHeight - world.mapHeight, 0) });
  };

  const maybeTriggerGhost = () => {
    if (save.ghosts.length === 0 || Math.random() >= 0.1) return;
    setGhostFlash(save.ghosts[0].memoryText);
    setTimeout(() => setGhostFlash(null), 1800);
  };

  // ---- 輔助：立即保存座標 ----
  const playerPosRef = useRef(playerPos);
  const lastSavedPos = useRef(playerPos);
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);

  const saveCurrentPos = () => {
    if (setPlayerPos && (playerPosRef.current.x !== lastSavedPos.current.x || playerPosRef.current.y !== lastSavedPos.current.y)) {
      setPlayerPos(playerPosRef.current.x, playerPosRef.current.y);
      lastSavedPos.current = playerPosRef.current;
    }
  };

  const interact = (targetId: EntityId) => {
    // 立即保存當前位置，避免互動後退出回檔
    saveCurrentPos();

    const entity = entities.find(e => e.id === targetId);


    // 傳送點處理（通用）
    if (entity?.type === 'portal') {
      return;
    }

    // 委派給世界模組的互動邏輯
    const targetNpcState = getNpcStateForLocation(save.currentLocation, save, entity?.id);
    const interaction = world.getInteraction?.(targetId, {

      npcEnding: targetNpcState?.ending ?? 'none',
      npcInnerWorldUnlocked: targetNpcState?.innerWorldUnlocked ?? false,
      npcFlags: targetNpcState?.flags ?? [],
      collectedClues: save.collectedClues,
      onOpenConversation,
      onEnterInnerWorld,
      onOpenArcFailure,
      onOpenReport,
      onShowModal: (modalContent) => {
        if (!modalContent) { setModal(null); return; }
        setModal({
          title: modalContent.title,
          content: modalContent.content,
          actions: modalContent.actions?.map(a => ({ ...a, tone: a.tone as 'primary' | 'danger' | 'ghost' })),
        });
      },
    });

    if (interaction) {
      if (typeof interaction === 'string') {
        setModal({ title: '互動', content: interaction });
      } else {
        setModal({
          title: interaction.title,
          content: interaction.content,
          actions: interaction.actions?.map(a => ({ ...a, tone: a.tone as 'primary' | 'danger' | 'ghost' })),
        });
      }
      return;
    }

    // NPC 實體：根據 entity.id 切換到對應 NPC
    if (entity?.type === 'npc') {
      if (entity.id === 'aoi') {
        onSwitchNpc?.('aoi');
      } else if (entity.id === 'rena') {
        onSwitchNpc?.('rena');
      } else {
        onSwitchNpc?.('bridge_artist');
      }
      onOpenConversation();
      return;
    }

    // 撕碎畫布：不應被拾取
    if (targetId === 'torn_canvas') {
      return;
    }

    // 通用線索處理
    const result = collectClue(targetId as ClueId);
    const clue = (ALL_CLUES as Record<string, { content: string; dictionaryHint: string; label: string; insightTitle?: string; insightDesc?: string }>)[targetId as string];
    maybeTriggerGhost();
    const buildContent = () => { let c = `${clue.content}`; if (result.unlockedNow) c += '\n\n天橋盡頭傳來一聲很輕的門軸聲。某個通往內心深處的入口，似乎鬆動了。'; return c; };
    const openCm = (extra?: { title?: string; desc?: string }) => {
      const hint = `情緒詞典浮現：${clue?.dictionaryHint ?? ''}`;
      // 如果 API 没有返回詞典條目，使用線索的 insightTitle/insightDesc 作為 fallback
      const fallbackTitle = !extra?.title && !extra?.desc ? clue?.insightTitle : undefined;
      const fallbackDesc = !extra?.title && !extra?.desc ? clue?.insightDesc : undefined;
      setModal({
        title: `獲得線索：${result.label}`,
        content: buildContent(),
        discoveryContent: hint,
        discoveryTitle: extra?.title ?? fallbackTitle,
        discoveryDesc: extra?.desc ?? fallbackDesc,
      });
    };
    if (!result.alreadyCollected) {
      getPlayerAuthHeaders().then(h => fetch('/api/investigation/collect', { method: 'POST', headers: { 'Content-Type': 'application/json', ...h }, body: JSON.stringify({ clueId: targetId }) }).then(r => r.json()).then(data => { const unlocked = Array.isArray(data.unlockedEntries) ? data.unlockedEntries : Array.isArray(data.newlyUnlockedDictionary) ? data.newlyUnlockedDictionary : []; if (unlocked.length === 0) { openCm(); return; } fetch('/api/dictionary').then(r => r.json()).then(dict => { const entry = (dict.entries as Array<{ id: string; name: string; description?: string }>).find(item => unlocked.includes(item.id)); openCm(entry ? { title: entry.name, desc: entry.description ?? clue?.dictionaryHint } : undefined); }).catch(() => openCm()); }).catch(() => openCm()));
      return;
    }
    openCm();
  };

  const interactRef = useRef(interact);
  interactRef.current = interact;

  useEffect(() => { focusCameraOnPlayer(playerPos); window.addEventListener('resize', () => focusCameraOnPlayer(playerPos)); return () => window.removeEventListener('resize', () => focusCameraOnPlayer(playerPos)); }, []);
  useEffect(() => {
    const hkd = (e: KeyboardEvent) => { if (e.key === 'Escape' && modal) { setModal(null); return; } if (modal) return; if (['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'].includes(e.key.toLowerCase())) { e.preventDefault(); keys.current.add(e.key.toLowerCase()); } if ((e.key === 'e' || e.key === ' ') && nearbyEntity) { e.preventDefault(); interactRef.current(nearbyEntity.id); } };
    const hku = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', hkd); window.addEventListener('keyup', hku);
    return () => { window.removeEventListener('keydown', hkd); window.removeEventListener('keyup', hku); };
  }, [modal, nearbyEntity]);
  const wasMoving = useRef(false);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (!modal) {
        let dx = 0, dy = 0;
        if (keys.current.has('w') || keys.current.has('arrowup')) dy -= 1;
        if (keys.current.has('s') || keys.current.has('arrowdown')) dy += 1;
        if (keys.current.has('a') || keys.current.has('arrowleft')) dx -= 1;
        if (keys.current.has('d') || keys.current.has('arrowright')) dx += 1;
        
        if (dx !== 0 || dy !== 0) {
          wasMoving.current = true;
          const len = Math.hypot(dx, dy);
          setPlayerPosState(prev => {
            const sx = (dx / len) * world.playerSpeed, sy = (dy / len) * world.playerSpeed;
            const buffer = 0.4;
            const maxX = world.getMaxX(save.currentLocation);
            const maxY = world.getMaxY(save.currentLocation);
            const collisionZone = world.collisionZones[save.currentLocation];
            const checkCol = (pt: Point) => {
              if (pt.x < 1 || pt.x > maxX || pt.y < 1 || pt.y > maxY) return true;
              const bc = world.buildings.some(b => {
                return pt.x >= b.pos.x - buffer && pt.x <= b.pos.x + b.size.x + buffer && pt.y >= b.pos.y - buffer && pt.y <= b.pos.y + b.size.y + buffer;
              });
              if (bc) return true;
              if (collisionZone) {
                const inRegion = collisionZone.walkableRegions.some(r => pt.x >= r.minX && pt.x <= r.maxX && pt.y >= r.minY && pt.y <= r.maxY);
                if (!inRegion) return true;
              }
              return false;
            };
            const nb = { x: clamp(prev.x + sx, 1, maxX), y: clamp(prev.y + sy, 1, maxY) };
            if (!checkCol(nb)) { focusCameraOnPlayer(nb); return nb; }
            const nx = { x: clamp(prev.x + sx, 1, maxX), y: prev.y };
            if (!checkCol(nx)) { focusCameraOnPlayer(nx); return nx; }
            const ny = { x: prev.x, y: clamp(prev.y + sy, 1, maxY) };
            if (!checkCol(ny)) { focusCameraOnPlayer(ny); return ny; }
            return prev;
          });
        } else if (wasMoving.current) {
          // 剛剛停止移動，立即保存
          wasMoving.current = false;
          saveCurrentPos();
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [modal, save.currentLocation, world]);

  // 玩家座標變更時，防抖寫入存檔
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCurrentPos();
    }, 500);
    return () => {
      clearTimeout(timer);
      // 組件卸載前，如果還有未保存的變動，強制保存
      if (setPlayerPos && (playerPosRef.current.x !== lastSavedPos.current.x || playerPosRef.current.y !== lastSavedPos.current.y)) {
        setPlayerPos(playerPosRef.current.x, playerPosRef.current.y);
      }
    };
  }, [playerPos, setPlayerPos]);


  const handleMouseDown = (e: MouseEvent) => { setIsDragging(true); hasMoved.current = false; dragStart.current = { x: e.clientX - mapPos.x, y: e.clientY - mapPos.y }; };
  const handleMouseMove = (e: MouseEvent) => { if (!isDragging) return; hasMoved.current = true; setMapPos({ x: clamp(e.clientX - dragStart.current.x, window.innerWidth - world.mapWidth, 0), y: clamp(e.clientY - dragStart.current.y, window.innerHeight - world.mapHeight, 0) }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleEntityClick = (e: MouseEvent, entity: Entity) => { e.stopPropagation(); if (hasMoved.current) return; if (distance(entity.pos, playerPos) > 1.35) { setModal({ title: entity.label, content: '距離太遠了。也許你應該親自走近一點，再試著理解他。' }); return; } interact(entity.id); };

  const pb = isoToScreen(playerPos);
  const ps = { left: pb.left, top: pb.top - world.getElevation(playerPos) };
  const traumaFilter = save.ghosts.length > 0 ? 'grayscale(0.22) contrast(0.95)' : 'none';

  // 可見建築物
  const visibleBuildings = useMemo(() => world.buildings, [world]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab', background: '#080a0d', filter: traumaFilter }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <GlassPanel title="提燈筆記" variant="dark" style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, width: 270 }} contentStyle={{ display: 'grid', gap: 12, padding: 16 }}>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: '#bbb' }}>
          {activeNpcState?.innerWorldUnlocked
            ? '天橋盡頭出現了微弱的門縫光。'
            : '雨聲仍很密，故事還沒有拼合。'}
          <br />
          {activeNpcState?.ending === 'success' && (
            <span style={{ color: '#b8ffd6' }}>
              畫家終於聽見了雨聲。
            </span>
          )}
          {(activeNpcState?.ending === 'failed' || save.npcs['aoi']?.ending === 'failed') && (
            <span style={{ color: '#ffd0d0' }}>
              {save.npcs['aoi']?.ending === 'failed' ? '公園的鞦韆上，只剩風還在輕輕推著空盪的座位。' : '天橋上只剩下一張被撕碎的空白畫布。'}
            </span>
          )}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
          <div style={{ color: '#eee', fontSize: 13, marginBottom: 8 }}>線索</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#aaa', fontSize: 13, lineHeight: 1.6 }}>
            {save.collectedClues.length === 0 && <li>尚未收集</li>}
            {save.collectedClues.map(cid => <li key={cid}>{clueName(cid)}</li>)}
          </ul>
        </div>
        {save.ghosts.length > 0 && <div style={{ color: '#ffb0b0', fontSize: 12, lineHeight: 1.5 }}>Ghost：{save.ghosts.length} 個殘影正在城市雨中徘徊。</div>}
        <GlimmerButton fullWidth onClick={onOpenDictionary}>情緒詞典</GlimmerButton>
        <GlimmerButton fullWidth onClick={onOpenTavern}>潛意識酒館</GlimmerButton>
        <GlimmerButton fullWidth onClick={onOpenReport}>餘波匯報</GlimmerButton>
        <GlimmerButton fullWidth tone="quiet" onClick={resetSave}>重置進度</GlimmerButton>
      </GlassPanel>

      <GlassPanel variant="dark" style={{ position: 'absolute', top: 20, right: 20, zIndex: 100, maxWidth: 330, pointerEvents: 'none' }} contentStyle={{ padding: '12px 16px', color: '#bbb', fontSize: 13, lineHeight: 1.7 }}>
        <strong style={{ color: '#eee' }}>{displayLoc.name}</strong> · {displayLoc.subtitle}<br />
        {displayLoc.ambient}<br />
        WASD / 方向鍵：移動<br />
        E / Space：互動
      </GlassPanel>

      {nearbyEntity && !modal && <div style={{ position: 'absolute', bottom: 34, left: '50%', transform: 'translateX(-50%)', zIndex: 100, color: '#f4d99d', fontSize: 14, pointerEvents: 'none', background: 'rgba(0,0,0,0.72)', border: '1px solid rgba(244,217,157,0.28)', borderRadius: 999, padding: '8px 16px' }}>按 E 觀察：{nearbyEntity.label}</div>}
      {ghostFlash && <div style={{ position: 'absolute', inset: 0, zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffd0d0', background: 'rgba(80,0,0,0.16)', textShadow: '0 0 18px rgba(255,80,80,0.9)', fontSize: 24, letterSpacing: 2, pointerEvents: 'none' }}>{ghostFlash}</div>}

      <div style={{ position: 'absolute', transform: `translate(${mapPos.x}px, ${mapPos.y}px)`, width: world.mapWidth, height: world.mapHeight }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 45% 35%, rgba(45,55,65,0.95), rgba(5,7,10,1) 70%)' }} />
        <div style={{ position: 'absolute', left: world.originX - 920, top: world.originY - 90, width: 1840, height: 1840, transform: 'rotateX(60deg) rotateZ(-45deg)', transformOrigin: 'center center', backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 50% 50%, rgba(120,140,160,0.16), rgba(30,34,40,0.86) 58%, rgba(10,12,16,0.96) 100%)', backgroundSize: '96px 96px, 96px 96px, cover', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 90px rgba(0,0,0,0.85) inset' }} />
        <IsometricRoads world={world} locationId={save.currentLocation} isRepaired={isRepaired} />
        <ParkScenery world={world} locationId={save.currentLocation} scenery={world.scenery} isRepaired={save.npcs['aoi']?.ending === 'success'} />
        <div style={{ position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)', width: 720, textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{ color: 'rgba(255,255,255,0.16)', fontSize: 28, letterSpacing: 8, fontWeight: 'bold' }}>{displayLoc.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>{displayLoc.description}</div>
        </div>
        {visibleBuildings.map(b => (
          <IsometricBuilding key={b.id} building={b} isRepaired={b.id === 'pavilion' ? save.npcs['aoi']?.ending === 'success' : isRepaired} mapWidth={world.mapWidth} mapHeight={world.mapHeight} />
        ))}
        {entities.map(entity => {
          const es = isoToScreen(entity.pos); const s = { left: es.left, top: es.top - world.getElevation(entity.pos) };
          const isNear = nearbyEntity?.id === entity.id;
          const isGDoor = entity.id === 'gallery_door';
          const cImg = entity.type === 'clue' ? CLUE_IMAGE_MAP[entity.id as ClueId] : undefined;
          const isImg = entity.type === 'clue' && Boolean(cImg);
          const isPtr = entity.id === 'painter';
          const isAoi = entity.id === 'aoi';
          const isTC = entity.id === 'torn_canvas';
          const isPill = !isImg && !isPtr && !isAoi && !isTC && (isGDoor || entity.type === 'clue');
          const bw = isTC ? 82 : (isImg ? 88 : (isPill ? 94 : (isAoi ? 100 : (entity.type === 'npc' ? 64 : 48))));
          const bh = isTC ? 82 : (isImg ? 112 : (isPill ? 36 : (isAoi ? 140 : (entity.type === 'npc' ? 84 : 48))));
          return (
            <button key={entity.id} onClick={e => handleEntityClick(e, entity)} style={{ position: 'absolute', left: s.left, top: s.top, transform: 'translate(-50%, -100%)', width: bw, height: bh, border: isTC ? '2px dashed #5a5a6e' : ((isPtr || isAoi) ? 'none' : `2px solid ${entity.color}`), borderRadius: (isPtr || isAoi) ? '0' : isTC ? '8px 14px 10px 4px' : isImg ? '14px' : isPill ? '999px' : entity.type === 'npc' ? '36px 36px 18px 18px' : '50%', padding: (isPtr || isAoi) ? '0' : isTC ? '4px' : isImg ? '4px' : isPill ? '0 8px' : '0', background: isTC ? 'rgba(20,22,30,0.94)' : (isPtr || isAoi) ? 'transparent' : isImg ? 'rgba(14,18,25,0.92)' : entity.type === 'npc' ? 'rgba(255,170,51,0.12)' : 'rgba(255,255,255,0.08)', color: isTC ? '#8a8a9c' : entity.color, cursor: 'pointer', zIndex: Math.round(s.top) + (isGDoor ? 500 : 0), boxShadow: isTC ? (isNear ? '0 0 28px rgba(120,120,140,0.35)' : '0 0 10px rgba(120,120,140,0.15)') : isPtr ? (isNear ? '0 0 26px rgba(255,196,132,0.65)' : 'none') : isAoi ? 'none' : (isNear ? `0 0 36px ${entity.color}` : `0 0 18px ${entity.color}55`), fontWeight: 'bold', userSelect: 'none', transition: 'box-shadow 0.18s, transform 0.18s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} title={entity.label}>
              {isPtr ? <img src={save.npcs['bridge_artist']?.ending === 'success' ? painterUnlockedImage : save.npcs['bridge_artist']?.ending === 'failed' ? painterGoneImage : painterImage} alt={entity.label} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center bottom', border: 'none', borderRadius: 0, filter: isNear ? 'drop-shadow(0 0 20px rgba(255,196,132,0.45))' : 'none' }} />
              : isAoi ? <img src={save.npcs['aoi']?.ending === 'failed' ? aoiGoneImage : aoiImage} alt={entity.label} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center bottom', border: 'none', borderRadius: 0, filter: save.npcs['aoi']?.ending === 'success' ? (isNear ? 'drop-shadow(0 0 20px rgba(255,170,51,0.45))' : 'none') : save.npcs['aoi']?.ending === 'failed' ? 'none' : 'grayscale(1)' }} />
              : isImg && cImg ? <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', width: '100%', height: '100%' }}><img src={cImg} alt={entity.label} style={{ width: '100%', height: 72, objectFit: 'cover', borderRadius: 9, border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 3px 10px rgba(0,0,0,0.35)' }} /><span style={{ fontSize: 11, lineHeight: 1.2, letterSpacing: 0.2, color: '#f7f0dc', textShadow: '0 0 6px rgba(0,0,0,0.45)' }}>{entity.label}</span></div>
              : isPill ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', height: '100%', whiteSpace: 'nowrap' }}><span style={{ fontSize: 13, fontWeight: 'bold', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: 22, height: 22, minWidth: 22, minHeight: 22, flexShrink: 0, flexGrow: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{entity.icon}</span><span style={{ fontSize: 11, letterSpacing: 0.5, fontWeight: 'bold' }}>{entity.label}</span></div>
              : isTC ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, width: '100%', height: '100%' }}><div style={{ fontSize: 22, opacity: 0.55, filter: 'grayscale(1)', lineHeight: 1 }}>🧩</div><span style={{ fontSize: 9, letterSpacing: 0.3, color: '#7a7a8c', textAlign: 'center', lineHeight: 1.3, maxWidth: 70 }}>{entity.label}</span></div>
              : <><div style={{ fontSize: entity.type === 'npc' ? 18 : 14 }}>{entity.icon}</div><div style={{ fontSize: 11, marginTop: 2 }}>{entity.label}</div></>}
            </button>
          );
        })}
        <div style={{ position: 'absolute', left: ps.left, top: ps.top, transform: 'translate(-50%, -100%)', width: 56, height: 86, zIndex: 9999, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', bottom: 4, transform: 'translateX(-50%)', width: 86, height: 34, background: 'radial-gradient(ellipse, rgba(0,0,0,0.5), transparent 68%)' }} />
          <div style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', width: 44, height: 52, borderRadius: '22px 22px 14px 14px', background: 'linear-gradient(#263341, #10151d)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 0 28px rgba(116,180,255,0.22)' }} />
          <div style={{ position: 'absolute', left: '50%', bottom: 68, transform: 'translateX(-50%)', width: 26, height: 26, borderRadius: '50%', background: '#c8d4df', border: '1px solid rgba(255,255,255,0.42)' }} />
          <div style={{ position: 'absolute', right: -4, bottom: 30, width: 16, height: 24, borderRadius: 8, background: 'rgba(255,217,132,0.86)', boxShadow: '0 0 34px rgba(255,206,103,0.8)' }} />
        </div>
      </div>

      {modal && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540, width: '100%' }}>
            <GlassPanel title={modal.title} variant="dark" contentStyle={{ color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {modal.content}
            {modal.discoveryContent && <div style={{ marginTop: 14, color: '#d0c8ba', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{modal.discoveryContent}</div>}
            {(modal.discoveryTitle || modal.discoveryDesc) && <div style={{ marginTop: 10, padding: '14px 16px', borderRadius: 8, background: 'rgba(214,163,94,0.1)', border: '1px solid rgba(214,163,94,0.15)', color: '#d0a050' }}>{modal.discoveryTitle && <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>獲得新理解：{modal.discoveryTitle}</div>}{modal.discoveryDesc && <div>{modal.discoveryDesc}</div>}</div>}
            {modal.actions && modal.actions.length > 0 && <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>{modal.actions.map((a, i) => <GlimmerButton key={i} tone={a.tone as any} onClick={a.onClick}>{a.label}</GlimmerButton>)}</div>}
            {(!modal.actions || modal.actions.length === 0) && <div style={{ marginTop: 14, textAlign: 'center' }}><GlimmerButton tone="quiet" onClick={() => setModal(null)} fullWidth>關閉</GlimmerButton></div>}
            </GlassPanel>
          </div>
        </div>
      )}
    </div>
  );
}
