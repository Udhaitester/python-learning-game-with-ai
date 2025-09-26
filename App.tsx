import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Level, EvaluationResult, ConsoleMessage, EvaluationFeedback } from './types';
import { generateLevel, evaluateCode, generateNewExample } from './services/geminiService';
import { LEVEL_TOPICS, TUTORIAL_STEPS } from './constants';
import GameScreen from './components/GameScreen';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [levelData, setLevelData] = useState<Level | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<ConsoleMessage[]>(["Welcome, Yodha, to a world of code!"]);
  const [exampleRefreshCount, setExampleRefreshCount] = useState<number>(0);
  const [isRefreshingExample, setIsRefreshingExample] = useState<boolean>(false);
  const [animatedSolution, setAnimatedSolution] = useState<string | null>(null);
  
  // Tutorial State
  const [tutorialStep, setTutorialStep] = useState<number>(-1); // -1 means inactive
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState<boolean>(false);


  const loadLevel = useCallback(async (level: number) => {
    setGameState(GameState.LOADING_LEVEL);
    setConsoleOutput([`Loading Mission ${level + 1}: ${LEVEL_TOPICS[level]}...`]);
    setExampleRefreshCount(0);
    setAnimatedSolution(null);
    try {
      const data = await generateLevel(level, LEVEL_TOPICS[level]);
      setLevelData(data);
      setUserCode(''); 
      setConsoleOutput([`Mission ${level + 1} received! Read the Guru's teachings and begin your test.`]);
      setGameState(GameState.LESSON);
      // Start tutorial on first level
      if (level === 0 && !hasCompletedTutorial) {
        setTutorialStep(0);
      }
    } catch (error) {
      console.error("Failed to load level:", error);
      setGameState(GameState.ERROR);
      setConsoleOutput(['Error: The ancient scrolls are unreadable. Please check your connection and refresh.']);
    }
  }, [hasCompletedTutorial]);

  // Effect to advance tutorial based on user code input
  useEffect(() => {
    if (tutorialStep === -1 || !TUTORIAL_STEPS[tutorialStep]?.waitForCode) return;
    
    const requiredCode = TUTORIAL_STEPS[tutorialStep].waitForCode?.replace(/\s/g, '');
    const currentCode = userCode.replace(/\s/g, '');

    if (currentCode === requiredCode) {
      handleTutorialNextStep();
    }
  }, [userCode, tutorialStep]);

  const handleStartGame = () => {
    loadLevel(0);
  };

  const handleRunCode = async () => {
    if (!levelData) return;
    
    // Advance tutorial if it's waiting for this action
    if (tutorialStep !== -1 && TUTORIAL_STEPS[tutorialStep]?.waitForAction === 'run') {
       handleTutorialNextStep();
    }

    setGameState(GameState.EVALUATING);
    setConsoleOutput(prev => [...prev, `> Presenting your code to the Guru for evaluation...`]);
    try {
      const result: EvaluationResult = await evaluateCode(userCode, levelData.solution, levelData.challenge);
      
      if (result.isCorrect) {
        setConsoleOutput(prev => [...prev, result.feedback]);
        setGameState(GameState.SUCCESS);
        // Advance tutorial after successful run
        if(tutorialStep !== -1 && TUTORIAL_STEPS[tutorialStep]?.waitForAction === 'run-success') {
          handleTutorialNextStep();
        }
      } else {
        const feedback: EvaluationFeedback = {
          type: 'feedback',
          feedback: result.feedback,
          userCode: userCode,
          solutionCode: levelData.solution,
        };
        setConsoleOutput(prev => [...prev, feedback]);
        setGameState(GameState.LESSON);
      }
    } catch (error) {
      console.error("Failed to evaluate code:", error);
      setGameState(GameState.ERROR);
      setConsoleOutput(prev => [...prev, 'Error: The Guru could not evaluate your code. Please try again.']);
    }
  };

  const handleNextLevel = () => {
    // Advance tutorial if it's waiting for this action
    if (tutorialStep !== -1 && TUTORIAL_STEPS[tutorialStep]?.waitForAction === 'next') {
       handleTutorialNextStep();
    }

    const nextLevelIndex = currentLevel + 1;
    if (nextLevelIndex < LEVEL_TOPICS.length) {
      setCurrentLevel(nextLevelIndex);
      loadLevel(nextLevelIndex);
    } else {
      setGameState(GameState.GAME_OVER);
      setConsoleOutput(prev => [...prev, 'Congratulations, Yodha! You have mastered the art of code and brought wisdom to the land!']);
    }
  };
  
  const handleGetHint = () => {
    if(levelData?.hint) {
      setConsoleOutput(prev => [...prev, `A whisper from the Guru: ${levelData.hint}`]);
    }
  };

  const handleRefreshExample = async () => {
    if (!levelData || isRefreshingExample) return;

    const newCount = exampleRefreshCount + 1;
    setExampleRefreshCount(newCount);

    if (newCount >= 3) {
      setConsoleOutput(prev => [...prev, "You have sought guidance thrice. The Guru will now guide your hand. Watch the editor!"]);
      setAnimatedSolution(levelData.solution);
      setExampleRefreshCount(0); 
    } else {
      setIsRefreshingExample(true);
      setConsoleOutput(prev => [...prev, 'The Guru is creating a new teaching scroll...']);
      try {
        const newExampleData = await generateNewExample(LEVEL_TOPICS[currentLevel], levelData.example);
        setLevelData(prev => prev ? { ...prev, example: newExampleData.example } : null);
        setConsoleOutput(prev => [...prev, 'A new scroll has appeared!']);
      } catch (error) {
        console.error("Failed to generate new example:", error);
        setConsoleOutput(prev => [...prev, 'Error: The Guru is deep in meditation. Please try again later.']);
      } finally {
        setIsRefreshingExample(false);
      }
    }
  };

  const handleAnimationComplete = () => {
    setAnimatedSolution(null);
  };

  const handleSolutionClick = (code: string) => {
    setUserCode(code);
    setConsoleOutput(prev => [...prev, '> The Guru\'s correct code has been copied to your editor!']);
  };

  const handleTutorialNextStep = () => {
    const nextStep = tutorialStep + 1;
    if (nextStep < TUTORIAL_STEPS.length) {
      setTutorialStep(nextStep);
    } else {
      // End of tutorial
      setTutorialStep(-1);
      setHasCompletedTutorial(true);
    }
  };

  const handleSkipTutorial = () => {
    setTutorialStep(-1);
    setHasCompletedTutorial(true);
    setConsoleOutput(prev => [...prev, "Tutorial skipped. You are on your own, Yodha!"]);
  };


  const renderContent = () => {
    const isTutorialActive = tutorialStep !== -1;
    const isNextLevelDisabled = isTutorialActive && TUTORIAL_STEPS[tutorialStep]?.waitForAction !== 'next';

    switch (gameState) {
      case GameState.WELCOME:
        return <WelcomeScreen onStart={handleStartGame} />;
      case GameState.LOADING_LEVEL:
      case GameState.EVALUATING:
        return <LoadingScreen />;
      case GameState.LESSON:
      case GameState.SUCCESS:
      case GameState.ERROR:
      case GameState.GAME_OVER:
        if (levelData) {
          return (
            <GameScreen
              levelData={levelData}
              userCode={userCode}
              onCodeChange={setUserCode}
              consoleOutput={consoleOutput}
              onRunCode={handleRunCode}
              onNextLevel={handleNextLevel}
              onGetHint={handleGetHint}
              gameState={gameState}
              isLastLevel={currentLevel === LEVEL_TOPICS.length - 1}
              onRefreshExample={handleRefreshExample}
              isRefreshingExample={isRefreshingExample}
              animatedSolution={animatedSolution}
              onAnimationComplete={handleAnimationComplete}
              onSolutionClick={handleSolutionClick}
              tutorialStep={tutorialStep}
              onTutorialNextStep={handleTutorialNextStep}
              isTutorialActive={isTutorialActive}
              onSkipTutorial={handleSkipTutorial}
              isNextLevelDisabled={isNextLevelDisabled}
            />
          );
        }
        return <LoadingScreen />; 
      default:
        return <WelcomeScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;