import React from 'react';

// A simple set of Python keywords for highlighting
const KEYWORDS = [
  'def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'True', 
  'False', 'None', 'and', 'or', 'not', 'import', 'from', 'as', 'class', 
  'try', 'except', 'finally', 'with', 'print'
];

const keywordRegex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g');
const stringRegex = /(".*?"|'.*?')/g;
const numberRegex = /\b(\d+(\.\d*)?)\b/g;
const commentRegex = /(#.*)/g;
const functionRegex = /(\w+)\(/; // To highlight function names before a parenthesis

/**
 * A simple regex-based syntax highlighter for Python code.
 * It splits the line by various token patterns and wraps them in styled spans.
 * Note: This is a basic implementation and may not cover all edge cases perfectly.
 */
export const highlightCode = (code: string): React.ReactNode => {
  if (!code) return [];

  const allTokensRegex = new RegExp(`(${keywordRegex.source}|${stringRegex.source}|${commentRegex.source}|${numberRegex.source})`, 'g');

  return code.split('\n').map((line, lineIndex) => {
    // If the line is empty, return a non-breaking space to preserve the line height
    if (line.trim() === '') {
      return <div key={lineIndex}>&nbsp;</div>;
    }
    
    const parts = line.split(allTokensRegex).filter(part => part);

    const highlightedParts = parts.map((part, partIndex) => {
      const key = `${lineIndex}-${partIndex}`;
      if (part.match(keywordRegex)) {
        return <span key={key} className="text-purple-400">{part}</span>;
      }
      if (part.match(stringRegex)) {
        return <span key={key} className="text-orange-300">{part}</span>;
      }
      if (part.match(commentRegex)) {
        return <span key={key} className="text-gray-400 italic">{part}</span>;
      }
      if (part.match(numberRegex)) {
        return <span key={key} className="text-cyan-300">{part}</span>;
      }
       // Basic function call highlighting
      const funcMatch = part.match(functionRegex);
      if (funcMatch) {
         return (
            <span key={key}>
                <span className="text-blue-300">{funcMatch[1]}</span>
                {part.substring(funcMatch[1].length)}
            </span>
         );
      }

      return <span key={key}>{part}</span>;
    });

    return <div key={lineIndex}>{highlightedParts}</div>;
  });
};
