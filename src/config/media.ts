export type MediaKey =
  | 'og-cover'
  | 'founder'
  | 'world-hero'
  | 'world-valley'
  | 'world-courtyard'
  | 'world-interior-hall'
  | 'world-skyrealm'
  | 'world-battle'
  | 'world-cosmos'
  | 'world-beasts'
  | 'character-01'
  | 'character-02'
  | 'character-03'
  | 'character-04'
  | 'glasses-hero'
  | 'glasses-detail-1'
  | 'glasses-detail-2'
  | 'glasses-detail-3'
  | 'realm-01'
  | 'realm-02'
  | 'realm-03'
  | 'realm-04'
  | 'realm-05'
  | 'realm-06';

export interface MediaEntry {
  key: MediaKey;
  src: string;
  alt: string;
  ratio: string;
  focal: string;
  priority?: boolean;
}

export const MEDIA: Record<MediaKey, MediaEntry> = {
  'og-cover': {
    key: 'og-cover',
    src: '/images/brand/og-cover.jpg',
    alt: 'Arkvoid — A living fantasy world where the people remember you',
    ratio: '1200/630',
    focal: '50% 50%',
  },
  founder: {
    key: 'founder',
    src: '/images/brand/founder.webp',
    alt: 'Manish Talukdar, Founder of Arkvoid Inc.',
    ratio: '4/5',
    focal: '50% 30%',
  },
  'world-hero': {
    key: 'world-hero',
    src: '/images/world/world-hero.webp',
    alt: 'A sunlit mountain sanctuary above mist valleys in the living world of Arkvoid',
    ratio: '16/10',
    focal: '50% 42%',
    priority: true,
  },
  'world-valley': {
    key: 'world-valley',
    src: '/images/world/world-valley.webp',
    alt: 'Mist valleys with stone bridges and quiet mountain streams at dawn',
    ratio: '16/10',
    focal: '50% 50%',
  },
  'world-courtyard': {
    key: 'world-courtyard',
    src: '/images/world/world-courtyard.webp',
    alt: 'Sect courtyard where disciples train at first light',
    ratio: '3/2',
    focal: '50% 45%',
  },
  'world-interior-hall': {
    key: 'world-interior-hall',
    src: '/images/world/world-interior-hall.webp',
    alt: 'Quiet timber hall lit by warm lanterns and morning light',
    ratio: '3/2',
    focal: '50% 50%',
  },
  'world-skyrealm': {
    key: 'world-skyrealm',
    src: '/images/world/world-skyrealm.webp',
    alt: 'High sky realm of floating stone terraces above clouds',
    ratio: '16/9',
    focal: '50% 40%',
  },
  'world-battle': {
    key: 'world-battle',
    src: '/images/world/world-battle.webp',
    alt: 'Two cultivators testing their discipline across a windswept ridge',
    ratio: '16/9',
    focal: '50% 45%',
  },
  'world-cosmos': {
    key: 'world-cosmos',
    src: '/images/world/world-cosmos.webp',
    alt: 'High celestial plain where immortals look back over the mortal world',
    ratio: '16/9',
    focal: '50% 50%',
  },
  'world-beasts': {
    key: 'world-beasts',
    src: '/images/world/world-beasts.webp',
    alt: 'Ancient spirit beasts resting near a high mountain lake',
    ratio: '3/2',
    focal: '50% 45%',
  },
  'character-01': {
    key: 'character-01',
    src: '/images/characters/character-01.webp',
    alt: 'Seren Vael, Warden of the East Gate',
    ratio: '3/4',
    focal: '50% 30%',
  },
  'character-02': {
    key: 'character-02',
    src: '/images/characters/character-02.webp',
    alt: 'Ione Marrow, Alchemist of the Lantern Terrace',
    ratio: '3/4',
    focal: '50% 30%',
  },
  'character-03': {
    key: 'character-03',
    src: '/images/characters/character-03.webp',
    alt: 'Veyra Ashgrove, Keeper of the Spirit Beasts',
    ratio: '3/4',
    focal: '50% 30%',
  },
  'character-04': {
    key: 'character-04',
    src: '/images/characters/character-04.webp',
    alt: 'Mirel Dawnquill, Archivist of the Hall of Records',
    ratio: '3/4',
    focal: '50% 30%',
  },
  'glasses-hero': {
    key: 'glasses-hero',
    src: '/images/hardware/glasses-hero.webp',
    alt: 'Arkvoid hardware design concept for lightweight optical glasses',
    ratio: '16/10',
    focal: '50% 50%',
  },
  'glasses-detail-1': {
    key: 'glasses-detail-1',
    src: '/images/hardware/glasses-detail-1.webp',
    alt: 'The arch mark detail on the Arkvoid glasses design concept',
    ratio: '1/1',
    focal: '50% 50%',
  },
  'glasses-detail-2': {
    key: 'glasses-detail-2',
    src: '/images/hardware/glasses-detail-2.webp',
    alt: 'Bridge and temple fit profile of the Arkvoid glasses design concept',
    ratio: '1/1',
    focal: '50% 50%',
  },
  'glasses-detail-3': {
    key: 'glasses-detail-3',
    src: '/images/hardware/glasses-detail-3.webp',
    alt: 'Optical lens profile of the Arkvoid glasses design concept',
    ratio: '1/1',
    focal: '50% 50%',
  },
  'realm-01': {
    key: 'realm-01',
    src: '/images/realms/realm-01.webp',
    alt: 'Origin Veil Realm — where every path begins',
    ratio: '1/1',
    focal: '50% 45%',
  },
  'realm-02': {
    key: 'realm-02',
    src: '/images/realms/realm-02.webp',
    alt: 'Spirit Abyss Realm — the first descent inward',
    ratio: '1/1',
    focal: '50% 45%',
  },
  'realm-03': {
    key: 'realm-03',
    src: '/images/realms/realm-03.webp',
    alt: 'Astral Crucible Realm — the body tested by starlight',
    ratio: '1/1',
    focal: '50% 45%',
  },
  'realm-04': {
    key: 'realm-04',
    src: '/images/realms/realm-04.webp',
    alt: 'Eternal Soul Realm — memory becomes power',
    ratio: '1/1',
    focal: '50% 45%',
  },
  'realm-05': {
    key: 'realm-05',
    src: '/images/realms/realm-05.webp',
    alt: 'Law Dominion Realm — rules become tools',
    ratio: '1/1',
    focal: '50% 45%',
  },
  'realm-06': {
    key: 'realm-06',
    src: '/images/realms/realm-06.webp',
    alt: 'Void Sovereignty Realm — mastery over emptiness',
    ratio: '1/1',
    focal: '50% 45%',
  },
};
