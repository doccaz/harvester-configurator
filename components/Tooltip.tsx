import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-2 group">
      <Info
        className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div className="absolute z-[100] w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-xl border border-gray-700 bottom-full mb-2 right-0 origin-bottom-right">
          {text}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 right-1 bottom-[-5px] border-r border-b border-gray-700"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;