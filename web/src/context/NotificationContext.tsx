'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const refreshNotificationCount = async () => {
    if (!isAuthenticated || !user?.id) {
      setNotificationCount(0);
      return;
    }

    try {
      const notifications = await notificationService.getUserNotifications(user.id.toString());
      const count = notifications.filter(item => !item.isRead).length;
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    refreshNotificationCount();
  }, [isAuthenticated, user?.id]);

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
