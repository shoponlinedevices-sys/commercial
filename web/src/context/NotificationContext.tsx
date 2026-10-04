'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '@/services/notification.service';

interface NotificationContextType {
  notificationCount: number;
  refreshNotificationCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationCountRequestId = useRef(0);

  const refreshNotificationCount = useCallback(async () => {
    const requestId = ++notificationCountRequestId.current;
    if (!isAuthenticated || !user?.id) {
      setNotificationCount(0);
      return;
    }

    try {
      const notifications = await notificationService.getUserNotifications(user.id.toString());
      if (requestId === notificationCountRequestId.current) {
        const count = notifications.filter(item => !item.isRead).length;
        setNotificationCount(count);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    void refreshNotificationCount();
  }, [refreshNotificationCount]);

  return (
    <NotificationContext.Provider value={{ notificationCount, refreshNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
