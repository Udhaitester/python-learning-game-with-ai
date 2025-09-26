import React, { useState, useEffect } from 'react';
import { GameState, Level, ConsoleMessage } from '../types';
import StoryPanel from './StoryPanel';
import CodeEditor from './CodeEditor';
import Console from './Console';
import Controls from './Controls';
import TutorialOverlay from './TutorialOverlay';
import { TUTORIAL_STEPS } from '../constants';

interface GameScreenProps {
  levelData: Level;
  userCode: string;
  onCodeChange: (code: string) => void;
  consoleOutput: ConsoleMessage[];
  onRunCode: () => void;
  onNextLevel: () => void;
  onGetHint: () => void;
  gameState: GameState;
  isLastLevel: boolean;
  onRefreshExample: () => void;
  isRefreshingExample: boolean;
  animatedSolution: string | null;
  onAnimationComplete: () => void;
  onSolutionClick: (code: string) => void;
  tutorialStep: number;
  onTutorialNextStep: () => void;
  isTutorialActive: boolean;
  onSkipTutorial: () => void;
  isNextLevelDisabled: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({
  levelData,
  userCode,
  onCodeChange,
  consoleOutput,
  onRunCode,
  onNextLevel,
  onGetHint,
  gameState,
  isLastLevel,
  onRefreshExample,
  isRefreshingExample,
  animatedSolution,
  onAnimationComplete,
  onSolutionClick,
  tutorialStep,
  onTutorialNextStep,
  isTutorialActive,
  onSkipTutorial,
  isNextLevelDisabled,
}) => {
  const [highlightedElement, setHighlightedElement] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isTutorialActive && tutorialStep >= 0) {
      const stepConfig = TUTORIAL_STEPS[tutorialStep];
      if (!stepConfig) {
        setHighlightedElement(null);
        return;
      }

      // Special case for centered welcome message
      if (stepConfig.position === 'center') {
        setHighlightedElement(null); // No specific element to highlight
        return;
      }
      
      const element = document.getElementById(stepConfig.targetId);
      if (element) {
        setHighlightedElement(element.getBoundingClientRect());
      } else {
         // Retry after a short delay for elements that might render slower
         setTimeout(() => {
            const el = document.getElementById(stepConfig.targetId);
            if (el) setHighlightedElement(el.getBoundingClientRect());
         }, 100);
      }
    } else {
      setHighlightedElement(null);
    }
  }, [tutorialStep, isTutorialActive, gameState]); // Re-run when gameState changes to find buttons


  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in" id="welcome-tutorial">
      {isTutorialActive && (
        <TutorialOverlay
          stepConfig={TUTORIAL_STEPS[tutorialStep]}
          highlightedElement={highlightedElement}
          onNext={onTutorialNextStep}
          onSkip={onSkipTutorial}
        />
      )}
      <StoryPanel 
        title={levelData.title}
        story={levelData.story}
        explanation={levelData.explanation}
        example={levelData.example}
        challenge={levelData.challenge}
        onRefreshExample={onRefreshExample}
        isRefreshingExample={isRefreshingExample}
      />
      <div className="flex flex-col bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
        <div className="flex-grow flex flex-col min-h-0">
          <CodeEditor 
            value={userCode} 
            onChange={onCodeChange}
            animatedCode={animatedSolution}
            onAnimationComplete={onAnimationComplete}
          />
          <Console output={consoleOutput} onSolutionClick={onSolutionClick} />
        </div>
        <Controls
          onRunCode={onRunCode}
          onNextLevel={onNextLevel}
          onGetHint={onGetHint}
          gameState={gameState}
          isLastLevel={isLastLevel}
          isNextLevelDisabled={isNextLevelDisabled}
        />
      </div>
    </div>
  );
};

export default GameScreen;