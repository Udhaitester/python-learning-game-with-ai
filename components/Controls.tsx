import React from 'react';
import { GameState } from '../types';

interface ControlsProps {
  onRunCode: () => void;
  onNextLevel: () => void;
  onGetHint: () => void;
  gameState: GameState;
  isLastLevel: boolean;
  isNextLevelDisabled: boolean;
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'success' }> = ({ children, className, variant = 'secondary', ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Controls: React.FC<ControlsProps> = ({ onRunCode, onNextLevel, onGetHint, gameState, isLastLevel, isNextLevelDisabled }) => {
  const isLoading = gameState === GameState.EVALUATING;

  return (
    <div className="bg-gray-700 p-3 flex items-center justify-end space-x-3 border-t border-gray-600">
      <Button 
        onClick={onGetHint}
        disabled={isLoading || gameState === GameState.SUCCESS}
      >
        <IconHelp /> Hint
      </Button>
      
      {gameState !== GameState.SUCCESS ? (
        <Button 
          id="run-button"
          variant="primary" 
          onClick={onRunCode}
          disabled={isLoading}
        >
          {isLoading ? <IconSpinner /> : <IconPlay />}
          {isLoading ? 'Evaluating...' : 'Run Code'}
        </Button>
      ) : (
        <Button 
          id="next-button"
          variant="success"
          onClick={onNextLevel}
          disabled={isNextLevelDisabled}
        >
          {isLastLevel ? "Finish" : "Next Level"} <IconArrowRight />
        </Button>
      )}
    </div>
  );
};

// SVG Icons
const IconPlay: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const IconArrowRight: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const IconHelp: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const IconSpinner: React.FC = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;


export default Controls;