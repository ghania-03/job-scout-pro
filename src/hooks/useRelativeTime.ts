import { useState, useEffect } from 'react';

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
}

export function useRelativeTime(date: Date | undefined): string {
  const [time, setTime] = useState(() => date ? formatRelativeTime(date) : '');

  useEffect(() => {
    if (!date) return;
    
    setTime(formatRelativeTime(date));
    
    // Update every 10 seconds for accuracy
    const interval = setInterval(() => {
      setTime(formatRelativeTime(date));
    }, 10000);

    return () => clearInterval(interval);
  }, [date]);

  return time;
}
