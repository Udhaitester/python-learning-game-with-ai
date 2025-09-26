export enum GameState {
  WELCOME,
  LOADING_LEVEL,
  LESSON,
  EVALUATING,
  SUCCESS,
  ERROR,
  GAME_OVER,
}

export interface Level {
  title: string;
  story: string;
  explanation: string;
  example: string;
  challenge: string;
  solution: string;
  hint: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
}

export interface EvaluationFeedback {
  type: 'feedback';
  feedback: string;
  userCode: string;
  solutionCode: string;
}

export type ConsoleMessage = string | EvaluationFeedback;

export interface TutorialStep {
  targetId: string;
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  waitForCode?: string;
  waitForAction?: 'run' | 'run-success' | 'next';
  isFinalStep?: boolean;
}
