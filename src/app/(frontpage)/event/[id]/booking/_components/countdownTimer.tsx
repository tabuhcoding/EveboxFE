'use client';

// Package System
import { useState, useEffect } from 'react';

// Package App
import TimeOutDialog from './timeOutDialog';

interface CountdownTimerProps {
  expiredTime: number;
}

export default function CountdownTimer({ expiredTime }: CountdownTimerProps) {
  const [isTimeout, setIsTimeout] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expiredTime);

  useEffect(() => {
    if (expiredTime <= 0) {
      return;
    }

    const storedTime = localStorage.getItem('timeLeft');
    const storedTimestamp = localStorage.getItem('timestamp');

    let remainingTime = expiredTime; // Default to passed expiredTime

    if (storedTime && storedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - Number(storedTimestamp)) / 1000);
      remainingTime = Math.max(Number(storedTime) - elapsedTime, 0);
    }

    if (remainingTime > 0) {
      setTimeLeft(remainingTime);
      localStorage.setItem('timeLeft', String(expiredTime));
      localStorage.setItem('timestamp', String(Date.now()));
    } else {
      handleTimeout();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }

        const updatedTime = prevTime - 1;
        localStorage.setItem('timeLeft', String(updatedTime));
        localStorage.setItem('timestamp', String(Date.now()));
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredTime]);

  const handleTimeout = () => {
    setIsTimeout(true);
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('timestamp');
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="mt-3 bg-[#DDF9F5] border border-[#52D1C9] rounded-xl p-4 text-center shadow-md flex flex-col items-center">
      <p className="text-black mb-2">Hoàn tất đặt vé trong</p>
      <div className="w-24 h-12 flex items-center justify-center bg-[#52D1C9] text-black text-xl font-bold rounded-md mt-2">
        {formatTime(Math.floor(timeLeft))}
      </div>
      <TimeOutDialog open={isTimeout} onClose={() => setIsTimeout(false)} />
    </div>
  );
}
