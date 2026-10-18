import type { MediaKey } from '../config/media';
import { SECTION_IDS, type SectionId } from '../config/site.config';

export interface NavItem {
  label: string;
  id: SectionId;
  href: string;
}

export interface HeroFact {
  stage: string;
  detail: string;
}

export interface LayerCardContent {
  number: '01' | '02' | '03';
  layerLabel: string;
  status: 'Building now' | 'Next' | 'Later';
  title: string;
  body: string;
  lines: [string, string, string];
  theme: 'white' | 'ink' | 'mist';
}

export interface WorldCardContent {
  mediaKey: MediaKey;
  number: string;
  title: string;
  pill: string;
  caption: string;
}

export interface CharacterCardContent {
  mediaKey: MediaKey;
  name: string;
  role: string;
  remembers: string;
  wants: string;
}

export interface RealmItemContent {
  number: string;
  name: string;
  description: string;
  known: boolean;
  mediaKey?: MediaKey;
}

export interface HowSceneContent {
  stepNumber: string;
  stepShort: string;
  dayLabel: string;
  subLabel?: string;
  title: string;
  body: string;
}

export interface HowIdeaContent {
  number: string;
  title: string;
  body: string;
  illustration: 'ledger' | 'gate' | 'rings';
}

export interface ResearchTrackContent {
  number: string;
  title: string;
  paragraph: string;
  targetValue: number;
  targetUnit: string;
  targetCaption: string;
  test: string;
  progressRatio: number;
  segmentedDevices?: [string, string, string, string];
}

export interface HardwareLadderItem {
  number: string;
  device: string;
  sentence: string;
  chip: 'In development' | 'Exploring' | 'Concept';
}

export interface HardwareHotspot {
  label: string;
  xPercent: number;
  yPercent: number;
  anchorX: number;
  anchorY: number;
}

export interface RoadmapStageItem {
  stageNumber: string;
  title: string;
  window: string;
  status: 'Now' | 'Next' | 'Later';
  body: string;
  isNow?: boolean;
  isDashed?: boolean;
}

export interface WhyNowTile {
  id: string;
  displayValue: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description: string;
  theme: 'white' | 'ink';
  sources: Array<{ label: string; url: string }>;
}

export interface InvestorBarItem {
  label: string;
  percent: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  nav: {
    links: NavItem[];
    cta: string;
  };
  hero: {
    eyebrow: string;
    h1Lines: [string, string, string];
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    statusLine: string;
    scrollLabel: string;
    facts: HeroFact[];
    portalChips: [string, string, string];
    portalEndTitle: string;
    portalEndSubline: string;
  };
  manifesto: {
    eyebrow: string;
    paragraph: string;
  };
  about: {
    heading: string;
    lead: string;
    cards: [LayerCardContent, LayerCardContent, LayerCardContent];
    diagramSteps: [
      { label: string; locked?: boolean },
      { label: string; locked?: boolean },
      { label: string; locked?: boolean },
      { label: string; locked?: boolean },
      { label: string; locked?: boolean }
    ];
    devices: [
      { name: string; status: string; solid: boolean },
      { name: string; status: string; solid: boolean },
      { name: string; status: string; solid: boolean },
      { name: string; status: string; solid: boolean }
    ];
  };
  marquee: {
    words: [string, string, string];
  };
  world: {
    eyebrow: string;
    heading: string;
    lead: string;
    footnote: string;
    swipeHint: string;
    cards: WorldCardContent[];
  };
  characters: {
    eyebrow: string;
    heading: string;
    lead: string;
    footnote: string;
    remembersLabel: string;
    wantsLabel: string;
    cards: CharacterCardContent[];
    bottomStatement: string;
    bottomLinkLabel: string;
  };
  realms: {
    eyebrow: string;
    heading: string;
    lead: string;
    footnote: string;
    items: RealmItemContent[];
    finalBeatTitle: string;
    finalBeatMarks: string;
  };
  how: {
    eyebrow: string;
    heading: string;
    lead: string;
    footnote: string;
    scenes: [HowSceneContent, HowSceneContent, HowSceneContent];
    chatScene1: {
      speakerName: string;
      speakerRole: string;
      serenLine: string;
      youLine: string;
      chip: string;
    };
    awayJournal: {
      header: string;
      entries: [
        { time: string; event: string },
        { time: string; event: string },
        { time: string; event: string }
      ];
    };
    chatScene3: {
      speakerName: string;
      speakerRole: string;
      serenLine: string;
      sourceLabel: string;
      sources: [string, string];
    };
    ideas: [HowIdeaContent, HowIdeaContent, HowIdeaContent];
    trio: {
      caption: string;
      screens: [
        {
          id: 'courtyard';
          label: string;
          placeTitle: string;
          placeSubtitle: string;
          nearbyLabel: string;
          nearbyPeople: [string, string, string];
        },
        {
          id: 'conversation';
          label: string;
          speaker: string;
          role: string;
          message: string;
          reply: string;
          memoryChips: [string, string];
        },
        {
          id: 'journal';
          label: string;
          heading: string;
          items: [
            { time: string; text: string },
            { time: string; text: string },
            { time: string; text: string }
          ];
        }
      ];
    };
  };
  research: {
    eyebrow: string;
    heading: string;
    lead: string;
    targetTag: string;
    testPrefix: string;
    tracks: [
      ResearchTrackContent,
      ResearchTrackContent,
      ResearchTrackContent,
      ResearchTrackContent
    ];
    panelHeading: string;
    panelColumns: [
      { number: string; title: string; body: string },
      { number: string; title: string; body: string },
      { number: string; title: string; body: string }
    ];
    plainStatement: string;
  };
  hardware: {
    eyebrow: string;
    heading: string;
    lead: string;
    ladder: [
      HardwareLadderItem,
      HardwareLadderItem,
      HardwareLadderItem,
      HardwareLadderItem
    ];
    showcase: {
      hotspots: [HardwareHotspot, HardwareHotspot, HardwareHotspot];
      title: string;
      disclaimer: string;
      details: [
        { mediaKey: MediaKey; caption: string },
        { mediaKey: MediaKey; caption: string },
        { mediaKey: MediaKey; caption: string }
      ];
    };
    honestLine: string;
  };
  roadmap: {
    eyebrow: string;
    heading: string;
    lead: string;
    stages: RoadmapStageItem[];
    footnote: string;
  };
  whyNow: {
    eyebrow: string;
    heading: string;
    lead: string;
    tiles: [WhyNowTile, WhyNowTile, WhyNowTile];
    footnote: string;
  };
  investors: {
    eyebrow: string;
    heading: string;
    lead: string;
    gates: [
      { number: string; title: string; test: string },
      { number: string; title: string; test: string },
      { number: string; title: string; test: string }
    ];
    roundPanel: {
      heading: string;
      leftBody: string;
      leftMono: string;
      bars: InvestorBarItem[];
    };
    risks: {
      title: string;
      items: [string, string, string, string];
      closing: string;
    };
    actions: {
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
      caption: string;
    };
  };
  founder: {
    eyebrow: string;
    name: string;
    role: string;
    monogram: string;
    noteLines: [string, string, string];
    devNotice: string;
    xLabel: string;
    emailLabel: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: FaqItem[];
  };
  join: {
    heading: string;
    lead: string;
    form: {
      label: string;
      placeholder: string;
      submitLabel: string;
      errorInvalid: string;
      errorNetwork: string;
      successTitle: string;
      successSubEndpoint: string;
      successSubMailto: string;
      smallPrint: string;
    };
    facts: [string, string, string];
  };
  footer: {
    tagline: string;
    exploreHeading: string;
    exploreLinks: Array<{ label: string; href: string }>;
    connectHeading: string;
    legalHeading: string;
    legalLinks: [
      { key: 'privacy'; label: string; title: string; body: string },
      { key: 'terms'; label: string; title: string; body: string },
      { key: 'notices'; label: string; title: string; body: string }
    ];
    devLegalNote: string;
    copyright: string;
    backToTop: string;
    disclaimer: string;
  };
}

export const CONTENT: SiteContent = {
  nav: {
    links: [
      { label: 'World', id: SECTION_IDS.world, href: `#${SECTION_IDS.world}` },
      { label: 'Realms', id: SECTION_IDS.realms, href: `#${SECTION_IDS.realms}` },
      { label: 'How it works', id: SECTION_IDS.how, href: `#${SECTION_IDS.how}` },
      { label: 'Research', id: SECTION_IDS.research, href: `#${SECTION_IDS.research}` },
      { label: 'Hardware', id: SECTION_IDS.hardware, href: `#${SECTION_IDS.hardware}` },
      { label: 'Roadmap', id: SECTION_IDS.roadmap, href: `#${SECTION_IDS.roadmap}` },
      { label: 'Investors', id: SECTION_IDS.investors, href: `#${SECTION_IDS.investors}` },
    ],
    cta: 'Join the waitlist',
  },
  hero: {
    eyebrow: 'ARKVOID INC. · COMING SOON',
    h1Lines: ['A world that', '*remembers*', 'you.'],
    lead: 'Arkvoid is a living world of immortals, sects and spirit beasts. The people in it remember what you did, live their own lives while you are away, and are still there when you come back.',
    primaryCta: 'Join the waitlist',
    secondaryCta: 'See how it works',
    statusLine: 'In development. The waitlist gets early access first.',
    scrollLabel: 'Scroll',
    facts: [
      { stage: 'Today', detail: 'The first world, in development' },
      { stage: 'Next', detail: 'The engine behind it' },
      { stage: 'Later', detail: 'Any screen you own' },
    ],
    portalChips: ['Mist valleys', 'Sect courtyards', 'Sky realms'],
    portalEndTitle: 'Step inside.',
    portalEndSubline: 'A world with its own memory, its own time, and people who live in it.',
  },
  manifesto: {
    eyebrow: '01 — WHY ARKVOID',
    paragraph:
      'Most digital worlds stop the moment you leave. Characters repeat the same lines. Nothing you do really lasts. Arkvoid is being built differently: a world with its own *memory*, its own time, and people who live in it, whether you are watching or not.',
  },
  about: {
    heading: 'One world today. A *platform* tomorrow.',
    lead: 'Arkvoid is built in three layers. We finish each one before we start the next.',
    cards: [
      {
        number: '01',
        layerLabel: 'THE WORLD',
        status: 'Building now',
        title: 'A cultivation world that keeps its promises.',
        body: 'Cultivation is the old fantasy idea of people training body and spirit to climb through realms of power. We are starting small: one sect, a handful of people, and a world that remembers what you did.',
        lines: [
          'Five to ten people with real routines',
          'Actions that change things and stay changed',
          'A world that is still there when you return',
        ],
        theme: 'white',
      },
      {
        number: '02',
        layerLabel: 'THE ENGINE',
        status: 'Next',
        title: 'The part that makes it work.',
        body: 'Under the world is a permanent record of everything that happens, characters that read from it, and rules the world always enforces. Once this works for one world, other builders may be able to use it for theirs.',
        lines: [
          'A permanent record of events',
          'Characters that remember from the record',
          'Rules that cannot be broken by a clever reply',
        ],
        theme: 'ink',
      },
      {
        number: '03',
        layerLabel: 'THE PLATFORM',
        status: 'Later',
        title: 'The same world on any screen.',
        body: 'Browser and phone come first. Headsets and glasses come only when they make the world better, not just newer. The world stays the same. Only the way you step into it changes.',
        lines: [
          'Browser and phone first',
          'Headsets and glasses when they add something real',
          'One world, one record, every device',
        ],
        theme: 'mist',
      },
    ],
    diagramSteps: [
      { label: 'You act' },
      { label: 'A character proposes' },
      { label: 'The world checks the rules' },
      { label: 'The record is updated', locked: true },
      { label: 'Memory is written' },
    ],
    devices: [
      { name: 'Browser', status: 'First', solid: true },
      { name: 'Phone', status: 'First', solid: true },
      { name: 'Headset', status: 'Exploring', solid: false },
      { name: 'Glasses', status: 'Concept', solid: false },
    ],
  },
  marquee: {
    words: ['Remember', 'Return', 'Rise'],
  },
  world: {
    eyebrow: '02 — THE WORLD',
    heading: 'Step *inside*.',
    lead: 'Concept art for the world of Arkvoid. Every place below is somewhere we are building toward.',
    footnote: 'Concept art. Not final in-game footage.',
    swipeHint: 'Swipe',
    cards: [
      {
        mediaKey: 'world-valley',
        number: '01',
        title: 'The Mist Valleys',
        pill: 'Landscape',
        caption: 'Rivers of cloud between mountains no one has finished climbing.',
      },
      {
        mediaKey: 'world-courtyard',
        number: '02',
        title: 'The Sect Courtyard',
        pill: 'Home',
        caption: 'Where the first world begins, and where the first people live.',
      },
      {
        mediaKey: 'world-interior-hall',
        number: '03',
        title: 'The Hall of Records',
        pill: 'Inside',
        caption: 'Quiet rooms where the world keeps what it has learned.',
      },
      {
        mediaKey: 'world-skyrealm',
        number: '04',
        title: 'The Sky Realms',
        pill: 'Above',
        caption: 'Floating halls for those who have climbed high enough to leave the ground.',
      },
      {
        mediaKey: 'world-battle',
        number: '05',
        title: 'The War Above the Clouds',
        pill: 'Conflict',
        caption: 'When cultivators fight, the sky pays for it.',
      },
      {
        mediaKey: 'world-beasts',
        number: '06',
        title: 'The Spirit Beasts',
        pill: 'Creatures',
        caption: 'Old creatures with their own memories, and their own terms.',
      },
      {
        mediaKey: 'world-cosmos',
        number: '07',
        title: 'The Open Cosmos',
        pill: 'Beyond',
        caption: 'At the highest realms, the world is no longer the limit.',
      },
    ],
  },
  characters: {
    eyebrow: '03 — THE PEOPLE',
    heading: 'People, not *props*.',
    lead: 'Each person in Arkvoid has a personality, goals, relationships and a daily routine. They remember what happened between you.',
    footnote: 'Concept portraits. Names and details are working drafts.',
    remembersLabel: 'Remembers',
    wantsLabel: 'Wants',
    cards: [
      {
        mediaKey: 'character-01',
        name: 'Seren Vael',
        role: 'Warden of the East Gate',
        remembers: 'You carried her wounded student down the mountain.',
        wants: "To earn back her master's trust.",
      },
      {
        mediaKey: 'character-02',
        name: 'Ione Marrow',
        role: 'Alchemist of the Lantern Terrace',
        remembers: 'The herb you promised to bring.',
        wants: 'To finish the elixir her teacher left unfinished.',
      },
      {
        mediaKey: 'character-03',
        name: 'Veyra Ashgrove',
        role: 'Keeper of the Spirit Beasts',
        remembers: 'Which beast let you come near.',
        wants: 'To find the nest that went missing.',
      },
      {
        mediaKey: 'character-04',
        name: 'Mirel Dawnquill',
        role: 'Archivist of the Hall of Records',
        remembers: 'Every question you have asked her.',
        wants: 'To protect a record someone wants erased.',
      },
    ],
    bottomStatement: 'Five to ten people like these will live in our first world.',
    bottomLinkLabel: 'How their memory works',
  },
  realms: {
    eyebrow: '04 — THE REALMS',
    heading: 'Nine realms. Six are *known*.',
    lead: 'Cultivation is the long climb from ordinary life toward something close to a god. Each realm changes what a person can do, and what the world asks of them.',
    footnote: 'Realm names are working titles and may change.',
    items: [
      {
        number: '01',
        name: 'ORIGIN VEIL REALM',
        description:
          'Where every path begins. The first breath of spirit, felt but not yet controlled.',
        known: true,
        mediaKey: 'realm-01',
      },
      {
        number: '02',
        name: 'SPIRIT ABYSS REALM',
        description:
          'The first descent inward. Spirit deepens, and so does the risk.',
        known: true,
        mediaKey: 'realm-02',
      },
      {
        number: '03',
        name: 'ASTRAL CRUCIBLE REALM',
        description:
          'The body is tested by starlight. Many climbers stop here.',
        known: true,
        mediaKey: 'realm-03',
      },
      {
        number: '04',
        name: 'ETERNAL SOUL REALM',
        description:
          'Life stretches past a single lifetime. Memory becomes power.',
        known: true,
        mediaKey: 'realm-04',
      },
      {
        number: '05',
        name: 'LAW DOMINION REALM',
        description:
          'The rules of the world stop being obstacles and start being tools.',
        known: true,
        mediaKey: 'realm-05',
      },
      {
        number: '06',
        name: 'VOID SOVEREIGNTY REALM',
        description:
          'Mastery over emptiness itself. Few have returned to describe it.',
        known: true,
        mediaKey: 'realm-06',
      },
      {
        number: '07',
        name: 'UNKNOWN REALM',
        description: 'Sealed. Not yet revealed.',
        known: false,
      },
      {
        number: '08',
        name: 'UNKNOWN REALM',
        description: 'Sealed. Not yet revealed.',
        known: false,
      },
      {
        number: '09',
        name: 'UNKNOWN REALM',
        description: 'Sealed. Not yet revealed.',
        known: false,
      },
    ],
    finalBeatTitle: 'Beyond the ninth',
    finalBeatMarks: '? ? ?',
  },
  how: {
    eyebrow: '05 — HOW IT WORKS',
    heading: 'Memory, not *scripts*.',
    lead: 'Here is what happens when you leave the world, and when you come back.',
    footnote: 'Illustrative concept. Not final product screens.',
    scenes: [
      {
        stepNumber: '01',
        stepShort: '01 Day 1',
        dayLabel: 'Day 1, evening',
        subLabel: 'Memory written',
        title: 'You help someone.',
        body: "You spend an hour with Seren, the warden of the east gate. She trusts you with a worry: the gate's old lock is failing. You promise to come back.",
      },
      {
        stepNumber: '02',
        stepShort: '02 Away',
        dayLabel: 'Day 2 and 3, while you are away',
        title: 'The world keeps going.',
        body: 'Nobody waits for you. Seren trains. A merchant arrives. Someone repairs the gate. The world only works hard on what matters, so this costs almost nothing.',
      },
      {
        stepNumber: '03',
        stepShort: '03 Return',
        dayLabel: 'Day 3, you return',
        title: 'She remembers.',
        body: 'Seren greets you by what you did, not by a script. The gate was mended, and she tells you who did it, and why. Everything she says can be traced to something that really happened.',
      },
    ],
    chatScene1: {
      speakerName: 'Seren Vael',
      speakerRole: 'Warden of the East Gate',
      serenLine: 'The lock on the east gate is failing. I did not want to say it aloud.',
      youLine: 'I will come back and help.',
      chip: 'Promise saved',
    },
    awayJournal: {
      header: 'While you were away',
      entries: [
        { time: 'Day 2 · Morning', event: 'Seren completes morning drill at the East Gate.' },
        { time: 'Day 2 · Dusk', event: 'A timber merchant arrives from the lower valley.' },
        { time: 'Day 3 · Dawn', event: 'Orin from the lower court repairs the gate lock.' },
      ],
    },
    chatScene3: {
      speakerName: 'Seren Vael',
      speakerRole: 'Warden of the East Gate',
      serenLine:
        'You came back. The gate is mended. Orin from the lower court did it, after you left.',
      sourceLabel: 'Source',
      sources: ['Day 1 · Promise', 'Day 3 · Gate repaired'],
    },
    ideas: [
      {
        number: '01',
        title: 'The world keeps the truth.',
        body: 'Everything that happens is written to a permanent record. Who owns what, where people are, what was promised. If it is not in the record, it did not happen.',
        illustration: 'ledger',
      },
      {
        number: '02',
        title: 'Characters suggest. The world decides.',
        body: 'A character can propose an action. The world checks it against the rules before it happens. That keeps stories surprising without letting them break.',
        illustration: 'gate',
      },
      {
        number: '03',
        title: 'Quiet when nothing happens. Rich when it matters.',
        body: 'People far from you follow simple routines that cost almost nothing. The ones you are talking to get our full attention. That is how a whole world stays affordable.',
        illustration: 'rings',
      },
    ],
    trio: {
      caption: 'Concept screens. Everything here will change as we build and test.',
      screens: [
        {
          id: 'courtyard',
          label: 'The Courtyard',
          placeTitle: 'East Gate Courtyard',
          placeSubtitle: 'Dawn · Clear mist',
          nearbyLabel: 'Nearby',
          nearbyPeople: ['Seren Vael', 'Ione Marrow', 'Mirel Dawnquill'],
        },
        {
          id: 'conversation',
          label: 'A conversation',
          speaker: 'Ione Marrow',
          role: 'Alchemist',
          message: 'Did you find the spirit root along the cliff path?',
          reply: 'Brought two stalks from the upper ridge.',
          memoryChips: ['Day 1 · Herb promised', 'Terrace ledger updated'],
        },
        {
          id: 'journal',
          label: 'Your journal',
          heading: 'While you were away',
          items: [
            { time: 'Day 2 · Noon', text: 'Ione began distilling the lantern elixir.' },
            { time: 'Day 2 · Night', text: 'Veyra tracked a spirit beast near the lake.' },
            { time: 'Day 3 · Morning', text: 'Mirel sealed the third shelf in the hall.' },
          ],
        },
      ],
    },
  },
  research: {
    eyebrow: '06 — RESEARCH',
    heading: 'What we are setting out to *prove*.',
    lead: 'These are targets. We will measure each one against simple baselines before we claim anything. They are not results yet.',
    targetTag: 'TARGET',
    testPrefix: 'How we will test it',
    tracks: [
      {
        number: 'Track 01',
        title: 'Memory that holds',
        paragraph:
          'A character should remember what really happened, and say so honestly when it is unsure.',
        targetValue: 95,
        targetUnit: '%+',
        targetCaption: 'of remembered facts correct in controlled tests, and no invented events.',
        test: 'Fixed question sets, restarts, and deliberately conflicting memories.',
        progressRatio: 0.95,
      },
      {
        number: 'Track 02',
        title: 'Faster, cheaper repeat work',
        paragraph:
          'When a character does the same kind of thing again, it should not need to think from scratch each time.',
        targetValue: 40,
        targetUnit: '%',
        targetCaption:
          'lower response time in the slowest cases, and 50% fewer model calls on repeat tasks.',
        test: 'Same tasks, same world, compared with a strong standard setup. No increase in safety failures.',
        progressRatio: 0.4,
      },
      {
        number: 'Track 03',
        title: 'A quiet world is a cheap world',
        paragraph:
          'People far from you should live on simple rules. Only the ones near you need heavy thinking.',
        targetValue: 70,
        targetUnit: '%',
        targetCaption:
          'lower cost for background characters, with no extra contradictions that players notice.',
        test: 'Fifty to two hundred characters over seven simulated days, watched by real players.',
        progressRatio: 0.7,
      },
      {
        number: 'Track 04',
        title: 'One world, any screen',
        paragraph:
          "The world's truth must stay the same whether you are in a browser, on a phone or in a headset.",
        targetValue: 1,
        targetUnit: 'world',
        targetCaption: 'one record of truth across every device we support.',
        test: 'The same action, from different devices, produces the same result.',
        progressRatio: 0.5,
        segmentedDevices: ['Browser', 'Phone', 'Headset', 'Glasses'],
      },
    ],
    panelHeading: 'We will know it is working when:',
    panelColumns: [
      {
        number: '01',
        title: 'People come back.',
        body: 'Players return on their own, and remember specific things that happened.',
      },
      {
        number: '02',
        title: 'It stays affordable.',
        body: 'The savings hold up against strong alternatives, not weak ones.',
      },
      {
        number: '03',
        title: 'Others can build on it.',
        body: 'Independent builders succeed without our hands-on help.',
      },
    ],
    plainStatement:
      'We would rather show a small result that is true than a big claim that is not.',
  },
  hardware: {
    eyebrow: '07 — SOFTWARE AND HARDWARE',
    heading: 'Software first. Hardware when it *earns* its place.',
    lead: 'Arkvoid starts in a browser and on your phone. We will try headsets and glasses on devices that already exist. Our own glasses are a design concept, not a product.',
    ladder: [
      {
        number: '01',
        device: 'Browser',
        sentence: 'Open a tab and step in. No download.',
        chip: 'In development',
      },
      {
        number: '02',
        device: 'Phone',
        sentence: 'The same world in your pocket, built for touch.',
        chip: 'In development',
      },
      {
        number: '03',
        device: 'Headset',
        sentence:
          'Try one scene on a headset that already exists, and see if it adds anything real.',
        chip: 'Exploring',
      },
      {
        number: '04',
        device: 'Glasses',
        sentence:
          'A lighter way to carry the world. Today this is only a design concept.',
        chip: 'Concept',
      },
    ],
    showcase: {
      hotspots: [
        {
          label: 'Titanium frame (design goal)',
          xPercent: 22,
          yPercent: 26,
          anchorX: 38,
          anchorY: 42,
        },
        {
          label: 'Adaptive fit (design goal)',
          xPercent: 72,
          yPercent: 24,
          anchorX: 64,
          anchorY: 44,
        },
        {
          label: 'Quiet display (design goal)',
          xPercent: 68,
          yPercent: 72,
          anchorX: 54,
          anchorY: 54,
        },
      ],
      title: 'A concept for later.',
      disclaimer: 'Design concept. Not a product. No price, specs or release date.',
      details: [
        { mediaKey: 'glasses-detail-1', caption: 'The arch mark' },
        { mediaKey: 'glasses-detail-2', caption: 'Fit' },
        { mediaKey: 'glasses-detail-3', caption: 'Lens' },
      ],
    },
    honestLine:
      'We will only build hardware if existing devices leave a clear gap. Until then, we build the world.',
  },
  roadmap: {
    eyebrow: '08 — ROADMAP',
    heading: 'Each step opens only when the last one is *proven*.',
    lead: 'These windows are plans, not promises. We move on evidence, not dates.',
    stages: [
      {
        stageNumber: 'STAGE 01',
        title: 'SPECIFY',
        window: 'Weeks 1–2',
        status: 'Now',
        body: 'Freeze the first world, the rules for each character, and the tests we will run.',
        isNow: true,
      },
      {
        stageNumber: 'STAGE 02',
        title: 'PERSIST',
        window: 'Weeks 3–8',
        status: 'Next',
        body: 'Build the browser world with five to ten people who keep memories and routines, and survive restarts.',
      },
      {
        stageNumber: 'STAGE 03',
        title: 'MEASURE',
        window: 'Months 3–4',
        status: 'Next',
        body: 'Compare ways of remembering and repeating work against simple baselines. Measure what each hour costs.',
      },
      {
        stageNumber: 'STAGE 04',
        title: 'EMBODY',
        window: 'Months 4–6',
        status: 'Later',
        body: 'Try one 3D scene on an existing headset, only if the browser version already brings people back.',
      },
      {
        stageNumber: 'STAGE 05',
        title: 'VALIDATE',
        window: 'Months 6–12',
        status: 'Later',
        body: 'Run a closed alpha. Do people return? Do they trust what characters say? Does the cost hold?',
      },
      {
        stageNumber: 'STAGE 06',
        title: 'PLATFORM',
        window: 'Months 12–24+',
        status: 'Later',
        body: 'Offer tools for other builders, only if the earlier gates are met.',
      },
      {
        stageNumber: 'STAGE 07',
        title: 'HARDWARE EXPLORATION',
        window: 'Only if needed',
        status: 'Later',
        body: 'If existing devices leave a clear gap, study it with partners before building anything.',
        isDashed: true,
      },
    ],
    footnote: 'Windows count from October 2026.',
  },
  whyNow: {
    eyebrow: '09 — WHY NOW',
    heading: 'The pieces are *arriving*.',
    lead: 'Games are huge, new devices are growing, and AI can now act inside 3D worlds. What is still missing is a world that stays true over days and weeks. That is the part we are building.',
    tiles: [
      {
        id: 'games',
        displayValue: '$201.6B',
        numericValue: 201.6,
        prefix: '$',
        suffix: 'B',
        decimals: 1,
        description: 'Global games revenue in 2025.',
        theme: 'white',
        sources: [
          {
            label: 'Newzoo',
            url: 'https://newzoo.com/articles/global-games-market-2025',
          },
        ],
      },
      {
        id: 'devices',
        displayValue: '35.3%',
        numericValue: 35.3,
        suffix: '%',
        decimals: 1,
        description:
          'Year-over-year growth in combined headset and smart-glasses shipments, Q2 2026.',
        theme: 'ink',
        sources: [
          {
            label: 'IDC',
            url: 'https://www.idc.com/resource-center/blog/smart-glasses-growth-cools-to-35-as-meta-doubles-down-on-distribution/',
          },
        ],
      },
      {
        id: '3d',
        displayValue: '3D',
        description:
          'AI agents can already follow instructions and act inside virtual 3D worlds, and new models can generate them.',
        theme: 'white',
        sources: [
          {
            label: 'Google DeepMind SIMA 2',
            url: 'https://deepmind.google/blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/',
          },
          {
            label: 'Genie 3',
            url: 'https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/',
          },
          {
            label: 'World Labs Marble',
            url: 'https://www.worldlabs.ai/blog/marble-world-model',
          },
        ],
      },
    ],
    footnote:
      'These figures are context, not the size of our own market. We list them so you can check them.',
  },
  investors: {
    eyebrow: '10 — INVESTORS',
    heading: 'We are building the proof *first*.',
    lead: 'We are preparing a small first round to build the world and test it with real people. We would like to hear from investors who prefer evidence before scale.',
    gates: [
      {
        number: '01',
        title: 'Retention',
        test: 'Players come back on their own and remember specific things that happened.',
      },
      {
        number: '02',
        title: 'Efficiency',
        test: 'Our savings hold up against strong alternatives, not weak ones.',
      },
      {
        number: '03',
        title: 'Distribution',
        test: 'Independent builders succeed without our hands-on help.',
      },
    ],
    roundPanel: {
      heading: 'What the first round pays for',
      leftBody:
        'A small team, a small world, and clear tests. No custom hardware. No new foundation model. No global rendering network.',
      leftMono: 'Round size and terms are shared in conversation.',
      bars: [
        { label: 'Engineering and AI research', percent: 38 },
        { label: '3D and headset work', percent: 15 },
        { label: 'Operations', percent: 13 },
        { label: 'Reserve', percent: 10 },
        { label: 'Cloud and model costs', percent: 8 },
        { label: 'Design and user research', percent: 6 },
        { label: 'Test devices', percent: 5 },
        { label: 'Safety, security and legal', percent: 5 },
      ],
    },
    risks: {
      title: 'What could go wrong, in plain words',
      items: [
        'People may not come back after the novelty fades.',
        'Running the world may cost more as it grows.',
        'Others may prefer to build their own.',
        'Rules around online games and digital items vary and change. We will take legal advice before any money-linked feature.',
      ],
      closing: 'We will measure each of these, and say so if one of them fails.',
    },
    actions: {
      primaryLabel: 'Request the investor brief',
      primaryHref:
        'mailto:heyarkvoid@gmail.com?subject=Arkvoid%20investor%20brief%20request&body=Hello%20Manish%2C%0D%0A%0D%0AI%27d%20like%20to%20see%20the%20Arkvoid%20investor%20brief.%0D%0A%0D%0AName%3A%0D%0AFirm%3A%0D%0A',
      secondaryLabel: 'Talk to the founder',
      secondaryHref: 'mailto:heyarkvoid@gmail.com?subject=Hello%20Manish',
      caption: 'Replies come from Manish Talukdar, Founder.',
    },
  },
  founder: {
    eyebrow: '11 — THE FOUNDER',
    name: 'Manish Talukdar',
    role: 'FOUNDER, ARKVOID INC.',
    monogram: 'MT',
    noteLines: [
      '“I love stories about people climbing toward something far bigger than themselves.',
      'I have always wanted to step into those worlds and have them notice me.',
      'Arkvoid is my attempt to build one: slowly, honestly, and with proof at every step.”',
    ],
    devNotice: 'Draft note. Replace with your own words in site.ts.',
    xLabel: '@ArkvoidAI on X',
    emailLabel: 'heyarkvoid@gmail.com',
  },
  faq: {
    eyebrow: '12 — QUESTIONS',
    heading: 'Plain answers.',
    items: [
      {
        question: 'What is Arkvoid?',
        answer:
          'Arkvoid is a living fantasy world where the people remember you and keep their own lives while you are away. It is being built by Arkvoid Inc.',
      },
      {
        question: 'Is it a game?',
        answer:
          'It starts as one. The world comes first. The technology behind it is what we may open to other builders later.',
      },
      {
        question: 'When can I play?',
        answer:
          'There is no release date yet. We are building the first small world now. People on the waitlist get early access first.',
      },
      {
        question: 'Do I need a headset or glasses?',
        answer:
          'No. It starts in a browser and on your phone. Headsets and glasses come later, only if they make the world better.',
      },
      {
        question: 'Will it be free?',
        answer: 'We have not decided yet. The waitlist will hear first.',
      },
      {
        question: 'Can I buy or sell things for real money?',
        answer: 'Not at launch. In-world items have no cash value.',
      },
      {
        question: 'Are you raising money?',
        answer:
          'We are preparing a small first round. If you invest in early technology, please email us.',
      },
      {
        question: 'Who is behind it?',
        answer: 'Manish Talukdar, Founder of Arkvoid Inc.',
      },
      {
        question: 'What do you do with my email?',
        answer:
          'We use it only to tell you about Arkvoid. We do not sell it. You can ask us to delete it at any time.',
      },
    ],
  },
  join: {
    heading: 'Be there when the world *opens*.',
    lead: 'Join the waitlist. We will email you once when early access opens, and now and then with progress.',
    form: {
      label: 'Email',
      placeholder: 'you@example.com',
      submitLabel: 'Join the waitlist',
      errorInvalid: 'Please enter a valid email address.',
      errorNetwork:
        'Could not reach the waitlist server. Please email heyarkvoid@gmail.com directly.',
      successTitle: 'You are on the list.',
      successSubEndpoint: 'We will email you once when early access opens.',
      successSubMailto:
        'Your email app should open. Send the message and you are on the list.',
      smallPrint: 'No spam. Unsubscribe any time.',
    },
    facts: [
      'In development',
      'Waitlist gets early access first',
      'No release date yet',
    ],
  },
  footer: {
    tagline: 'A living world with memory. Built by Arkvoid Inc.',
    exploreHeading: 'Explore',
    exploreLinks: [
      { label: 'World', href: `#${SECTION_IDS.world}` },
      { label: 'Realms', href: `#${SECTION_IDS.realms}` },
      { label: 'How it works', href: `#${SECTION_IDS.how}` },
      { label: 'Research', href: `#${SECTION_IDS.research}` },
      { label: 'Hardware', href: `#${SECTION_IDS.hardware}` },
      { label: 'Roadmap', href: `#${SECTION_IDS.roadmap}` },
      { label: 'Investors', href: `#${SECTION_IDS.investors}` },
      { label: 'FAQ', href: `#${SECTION_IDS.faq}` },
    ],
    connectHeading: 'Connect',
    legalHeading: 'Legal',
    legalLinks: [
      {
        key: 'privacy',
        label: 'Privacy',
        title: 'Privacy',
        body: 'We collect only the email address you give us for the waitlist and any message you send to heyarkvoid@gmail.com. We use it to contact you about Arkvoid. We do not sell it. To remove it, email us and we will delete it. This site does not use advertising trackers.',
      },
      {
        key: 'terms',
        label: 'Terms',
        title: 'Terms',
        body: 'This site describes plans for a product that is not yet released. Concept art and screens are illustrations. Information may change without notice. All content is owned by Arkvoid Inc.',
      },
      {
        key: 'notices',
        label: 'Notices',
        title: 'Notices',
        body: 'Third-party names and figures on this page belong to their owners and are cited for context. Links go to the original sources.',
      },
    ],
    devLegalNote: 'Template text. Have a lawyer review before launch.',
    copyright: '© 2026 Arkvoid Inc. All rights reserved.',
    backToTop: 'Back to top',
    disclaimer:
      'Nothing on this site is an offer to sell, or a request to buy, any security. Roadmap, targets and concept art describe plans and ideas, not guarantees.',
  },
};
