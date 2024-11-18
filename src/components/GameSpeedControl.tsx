import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Clock, FastForward, Play, PlayCircle } from 'lucide-react';

const GameSpeedControl: React.FC = () => {
  const { gameSpeed, setGameSpeed } = useGameStore();

  const speeds = [
    { value: 1, label: 'Normal', icon: <Play className="w-4 h-4" /> },
    { value: 2, label: '2x', icon: <PlayCircle className="w-4 h-4" /> },
    { value: 5, label: '5x', icon: <FastForward className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-lg p-2">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-blue-400" />
        <div className="flex space-x-1">
          {speeds.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setGameSpeed(value)}
              className={`px-3 py-1 rounded flex items-center space-x-1
                ${gameSpeed === value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {icon}
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSpeedControl;
