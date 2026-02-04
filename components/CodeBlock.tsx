import React from 'react';

interface CodeBlockProps {
  content: string;
  language?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content, language = 'yaml', className = '' }) => {
  return (
    <div className={`relative rounded-lg overflow-hidden bg-gray-950 border border-gray-800 flex flex-col ${className}`}>
      <div className="flex-none flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-800">
        <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
        <button 
          onClick={() => navigator.clipboard.writeText(content)}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Copy
        </button>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <pre className="p-4 text-sm font-mono text-green-400 leading-relaxed">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;