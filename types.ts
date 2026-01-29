
export enum DeathStage {
  IDEA = 'Just an idea',
  MVP = 'MVP built',
  USERS = 'First users onboarded',
  POST_LAUNCH = 'After launch'
}

export enum FailureReason {
  NO_TRACTION = 'No users / no traction',
  LOST_MOTIVATION = 'Lost motivation',
  TECH_COMPLEXITY = 'Tech complexity too high',
  NO_MONEY = 'Ran out of money',
  TIME_CONSTRAINTS = 'Time constraints (job / studies)',
  BURNOUT = 'Mental burnout',
  SATURATED_MARKET = 'Market already saturated',
  LEGAL = 'Legal / compliance issues',
  TEAM_CONFLICTS = 'Team conflicts'
}

export interface AbandonedIdea {
  id: string;
  timestamp: string;
  title?: string;
  description: string;
  stage: DeathStage;
  primaryReason: FailureReason;
  secondaryReasons: FailureReason[];
  reflection?: string;
  isSolo: boolean;
  isTechHeavy: boolean;
  status: 'pending' | 'published' | 'rejected';
}

export interface SynthesisResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export type AppTab = 'archive' | 'submit' | 'dashboard' | 'about';
