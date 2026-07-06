// ============================================================
// 場景 / 地點定義
// 從 verticalSlice.ts 拆出
// ============================================================

export type LocationId = 'skybridge';

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
    spawn: { x: 10, y: 9 },
  },
};

export const locationOrder: LocationId[] = ['skybridge'];
