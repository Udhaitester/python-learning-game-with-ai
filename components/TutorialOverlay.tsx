import React from 'react';
import { TutorialStep } from '../types';

interface TutorialOverlayProps {
  stepConfig: TutorialStep;
  highlightedElement: DOMRect | null;
  onNext: () => void;
  onSkip: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ stepConfig, highlightedElement, onNext, onSkip }) => {
  if (!stepConfig) return null;

  const { text, position, waitForCode, waitForAction, isFinalStep } = stepConfig;
  const showButton = !waitForCode && !waitForAction;

  const getTooltipPosition = () => {
    if (!highlightedElement) {
      // Center positioning for modals
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const margin = 16;
    switch (position) {
      case 'top':
        return { bottom: `${window.innerHeight - highlightedElement.top + margin}px`, left: `${highlightedElement.left + highlightedElement.width / 2}px`, transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: `${highlightedElement.bottom + margin}px`, left: `${highlightedElement.left + highlightedElement.width / 2}px`, transform: 'translateX(-50%)' };
      case 'left':
        return { top: `${highlightedElement.top + highlightedElement.height / 2}px`, right: `${window.innerWidth - highlightedElement.left + margin}px`, transform: 'translateY(-50%)' };
      case 'right':
      default:
        return { top: `${highlightedElement.top + highlightedElement.height / 2}px`, left: `${highlightedElement.right + margin}px`, transform: 'translateY(-50%)' };
    }
  };

  const highlightStyle: React.CSSProperties = highlightedElement ? {
    position: 'absolute',
    left: `${highlightedElement.left - 8}px`,
    top: `${highlightedElement.top - 8}px`,
    width: `${highlightedElement.width + 16}px`,
    height: `${highlightedElement.height + 16}px`,
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
    pointerEvents: 'none',
    transition: 'all 0.3s ease-in-out',
  } : {};

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    ...getTooltipPosition(),
    zIndex: 1001,
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Highlighter div */}
      {highlightedElement && <div style={highlightStyle} />}

      {/* Background for centered modal */}
      {!highlightedElement && position === 'center' && (
        <div className="absolute inset-0 bg-black/70" />
      )}
      
      {/* Tooltip */}
      <div 
        style={tooltipStyle}
        className="bg-gray-800 border border-orange-400 p-4 rounded-lg shadow-2xl max-w-sm animate-fade-in"
      >
        <p className="text-white whitespace-pre-wrap">{text}</p>
        <div className="mt-4 flex items-center justify-between">
            <div>
              {showButton && (
                <button
                  onClick={onNext}
                  className="px-4 py-2 rounded-md font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500"
                >
                  {isFinalStep ? "Begin my Journey!" : "Next"}
                </button>
              )}
            </div>
            <button
              onClick={onSkip}
              className="text-sm font-semibold text-gray-400 hover:text-white hover:underline transition-colors"
            >
              Skip Tutorial
            </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;