'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 57, seconds: 1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5" />
      <div className="flex items-center space-x-1">
        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <span className="text-sm font-bold">:</span>
        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span className="text-sm font-bold">:</span>
        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
