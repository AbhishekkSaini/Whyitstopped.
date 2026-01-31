
import { AbandonedIdea, DeathStage, FailureReason } from '../types';

export const FAILURE_REASONS = Object.values(FailureReason);
export const DEATH_STAGES = Object.values(DeathStage);

/** What assumption failed? (select one or more) — required */
export const FAILED_ASSUMPTIONS = [
  'Distribution would be easier than building',
  'MVP quality was "good enough"',
  'Speed mattered more than trust',
  'Tech was the moat',
  'Team alignment was "good enough"',
  'Market education was possible',
] as const;

/** Hidden cost that killed momentum (multi-select) */
export const HIDDEN_COSTS = [
  'Ongoing maintenance',
  'Customer education',
  'Emotional exhaustion',
  'Compliance / paperwork',
  'Support burden',
  'Context switching (job + project)',
  'Team coordination overhead',
] as const;

/** Who this is useful for (audience tag) */
export const AUDIENCE_TAGS = [
  'Solo founders',
  'Indie hackers',
  'First-time founders',
  'Engineers going non-tech',
  'Hardware builders',
  'AI / ML builders',
] as const;

export const MOCK_ARCHIVE: AbandonedIdea[] = [
  {
    id: 'ARC-001',
    timestamp: '2024-03-15T10:00:00Z',
    title: 'ShelfShare',
    description: 'A p2p library for neighbors to lend physical books to each other using QR codes on spines.',
    stage: DeathStage.MVP,
    primaryReason: FailureReason.NO_TRACTION,
    secondaryReasons: [FailureReason.LOST_MOTIVATION],
    reflection: 'People like the idea of sharing, but the friction of meeting a stranger for a $10 book was higher than just buying it.',
    failedAssumptions: ['Distribution would be easier than building'],
    isSolo: true,
    isTechHeavy: false,
    status: 'published',
  },
  {
    id: 'ARC-002',
    timestamp: '2024-02-28T14:30:00Z',
    title: 'DeepSync AI',
    description: 'Real-time synchronization of character mouth movements for indie game voiceovers.',
    stage: DeathStage.IDEA,
    primaryReason: FailureReason.TECH_COMPLEXITY,
    secondaryReasons: [FailureReason.TIME_CONSTRAINTS],
    reflection: 'The latency requirements for real-time processing were beyond my skills at the time. I spent 3 months on a demo that never worked.',
    failedAssumptions: ['Tech was the moat'],
    isSolo: false,
    isTechHeavy: true,
    status: 'published',
  },
  {
    id: 'ARC-003',
    timestamp: '2024-01-10T09:15:00Z',
    title: 'ZenFlow CRM',
    description: 'A minimalist CRM specifically designed for meditation teachers and yoga studios.',
    stage: DeathStage.USERS,
    primaryReason: FailureReason.SATURATED_MARKET,
    secondaryReasons: [FailureReason.NO_MONEY, FailureReason.LEGAL],
    reflection: 'The market is crowded with huge incumbents. Customer acquisition cost was 5x the monthly subscription value.',
    failedAssumptions: ['Market education was possible'],
    isSolo: true,
    isTechHeavy: false,
    status: 'published',
  },
  {
    id: 'ARC-004',
    timestamp: '2023-12-05T18:00:00Z',
    title: 'FoodieRoute',
    description: 'GPS that routes you through the most scenic/restaurant-dense paths instead of the fastest.',
    stage: DeathStage.POST_LAUNCH,
    primaryReason: FailureReason.TEAM_CONFLICTS,
    secondaryReasons: [FailureReason.BURNOUT],
    reflection: 'My co-founder wanted to pivot to logistics, I wanted to stay consumer. We ended up doing neither.',
    failedAssumptions: ['Team alignment was "good enough"'],
    isSolo: false,
    isTechHeavy: true,
    status: 'published',
  }
];
