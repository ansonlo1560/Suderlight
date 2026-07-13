// ============================================================
// 場景 / 地點定義
// 從 verticalSlice.ts 拆出
// ============================================================

export type LocationId = 'skybridge' | 'comedy_club_entrance' | 'comedy_club_backstage' | 'hospital_ward';

export type LocationData = {
  id: LocationId;
  name: string;
  subtitle: string;
  description: string;
  ambient: string;
  spawn: { x: number; y: number };
};

export const locations: Record<LocationId, LocationData> = {
  skybridge: {
    id: 'skybridge',
    name: '天橋',
    subtitle: '雨後的過街天橋',
    description: '鏽蝕欄杆掛滿被雨浸透的展覽海報，橋下車流聲像遙遠海浪。天橋畫家站在空白畫布前，像守著一塊沒有色彩的墓碑。',
    ambient: '鐵鏽、濕顏料、車流低鳴',
    spawn: { x: 20, y: 17.5 },
  },
  comedy_club_entrance: {
    id: 'comedy_club_entrance',
    name: '俱樂部入口',
    subtitle: '深夜的霓虹燈下',
    description: '巨大的霓虹燈招牌閃爍著「全場笑聲保證」。海報上的蕾娜笑容燦爛，與周圍陰暗的巷弄形成強烈對比。',
    ambient: '遠處的爵士樂、霓虹燈的滋滋聲、濕潤的街道',
    spawn: { x: 10, y: 10 },
  },
  comedy_club_backstage: {
    id: 'comedy_club_backstage',
    name: '俱樂部後台',
    subtitle: '鏡子與面具的狹縫',
    description: '化妝鏡前的燈泡散發著微熱，桌上散落著笑話集與口紅。這裡的空氣凝固在表演結束後的寂靜中。',
    ambient: '散場後的餘音、化妝品的香氣、老舊時鐘的滴答聲',
    spawn: { x: 5, y: 5 },
  },
  hospital_ward: {
    id: 'hospital_ward',
    name: '醫院病房',
    subtitle: '靜止的白與灰',
    description: '慘白的牆壁，空氣中瀰漫著消毒水的味道。這裡曾有一通被接起卻無法承受的電話。',
    ambient: '醫療儀器的規律跳動聲、消毒水味、極度的安靜',
    spawn: { x: 15, y: 15 },
  },
};

export const locationOrder: LocationId[] = ['skybridge', 'comedy_club_entrance', 'comedy_club_backstage', 'hospital_ward'];

