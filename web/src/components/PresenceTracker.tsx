'use client';

import { useEffect } from 'react';
import { recordPresenceHeartbeat } from '@/lib/view-tracking';

export default function PresenceTracker() {
  useEffect(() => {
    const heartbeat = () => recordPresenceHeartbeat();
    heartbeat();
    const intervalId = window.setInterval(heartbeat, 30_000);
    document.addEventListener('visibilitychange', heartbeat);
    window.addEventListener('pageshow', heartbeat);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', heartbeat);
      window.removeEventListener('pageshow', heartbeat);
    };
  }, []);

  return null;
}
