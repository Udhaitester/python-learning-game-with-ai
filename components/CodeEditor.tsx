import React, { useEffect, useRef, useState } from 'react';
import { highlightCode } from '../utils/syntaxHighlighter';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  animatedCode?: string | null;
  onAnimationComplete?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, animatedCode, onAnimationComplete }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [copyText, setCopyText] = useState('Copy');

  useEffect(() => {
    if (animatedCode) {
      let i = 0;
      onChange(''); 
      const timer = setInterval(() => {
        if (i < animatedCode.length) {
          onChange(animatedCode.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [animatedCode, onChange, onAnimationComplete]);

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy'), 2000);
      });
    }
  };

  return (
    <div className="relative h-64 flex-shrink-0" id="editor">
      <div className="absolute top-2 left-4 text-sm font-semibold text-gray-400 z-30">main.py</div>
       <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 z-30 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold py-1 px-2 rounded-md transition-colors"
        aria-label="Copy code to clipboard"
      >
        {copyText}
      </button>
      
      <pre 
        ref={highlightRef} 
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full p-4 pt-8 m-0 font-mono text-sm overflow-auto pointer-events-none bg-gray-900 rounded-t-lg z-10"
      >
        <code>
          {highlightCode(value)}
          {/* Add a blank line to prevent layout shift when typing at the end */}
          {value.endsWith('\n') ? ' ' : ''}
        </code>
      </pre>
      
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => {
            if (!animatedCode) {
              onChange(e.target.value);
            }
        }}
        onScroll={syncScroll}
        className="absolute top-0 left-0 w-full h-full p-4 pt-8 bg-transparent text-transparent caret-green-300 font-mono text-sm resize-none focus:outline-none placeholder-gray-500 z-20"
        placeholder="Type your Python code here..."
        spellCheck="false"
        readOnly={!!animatedCode}
      />
    </div>
  );
};

export default CodeEditor;
