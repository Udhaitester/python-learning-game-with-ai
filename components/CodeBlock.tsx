import React from 'react';
import { highlightCode } from '../utils/syntaxHighlighter';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  if (!code) return null;

  return (
    <pre className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto text-sky-300">
      <code>{highlightCode(code)}</code>
    </pre>
  );
};

export default CodeBlock;
