import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ 
  title, 
  children, 
  icon,
  defaultExpanded = true,
  disabled = false,
  disabledMessage,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      <button
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
          {disabled && (
            <span className="ml-2 text-sm text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {disabledMessage}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 transition-transform" />
        ) : (
          <ChevronRight className="w-5 h-5 transition-transform" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-6">
          {disabled ? (
            <div className="flex items-center justify-center space-x-2 text-gray-400 p-8">
              <AlertCircle className="w-6 h-6" />
              <p>{disabledMessage}</p>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export default Section;