import React, { useRef, useEffect } from 'react';
import { ConsoleMessage } from '../types';
import CodeBlock from './CodeBlock';

interface ConsoleProps {
  output: ConsoleMessage[];
  onSolutionClick?: (code: string) => void;
}

const Console: React.FC<ConsoleProps> = ({ output, onSolutionClick }) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="flex-grow bg-black p-4 font-mono text-sm text-gray-300 overflow-y-auto min-h-[150px]">
      {output.map((line, index) => {
        if (typeof line === 'string') {
          return (
            <p key={index} className="whitespace-pre-wrap">
              <span className="text-gray-500 mr-2">{'>'}</span>{line}
            </p>
          );
        }
        
        // Handle EvaluationFeedback object
        return (
          <div key={index} className="bg-gray-800/50 my-2 p-3 rounded-md border border-gray-700">
            <p className="whitespace-pre-wrap mb-3"><span className="text-gray-500 mr-2">{'>'}</span>{line.feedback}</p>
            
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-semibold text-green-400">Correct Solution:</h4>
                <button
                  onClick={() => onSolutionClick?.(line.solutionCode)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-2 rounded-md transition-colors"
                  aria-label="Copy correct solution to editor"
                >
                  Copy to Editor
                </button>
              </div>
              <CodeBlock code={line.solutionCode} />
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-semibold text-red-400 mb-1">Your Submission:</h4>
              <CodeBlock code={line.userCode} />
            </div>
          </div>
        );
      })}
      <div ref={consoleEndRef} />
    </div>
  );
};

export default Console;