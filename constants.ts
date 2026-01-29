
import { AbandonedIdea, DeathStage, FailureReason } from './types';

export const FAILURE_REASONS = Object.values(FailureReason);
export const DEATH_STAGES = Object.values(DeathStage);

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
    isSolo: true,
    isTechHeavy: false,
    // Added required status field to resolve type error
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
    isSolo: false,
    isTechHeavy: true,
    // Added required status field to resolve type error
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
    isSolo: true,
    isTechHeavy: false,
    // Added required status field to resolve type error
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
    isSolo: false,
    isTechHeavy: true,
    // Added required status field to resolve type error
    status: 'published',
  }
];
