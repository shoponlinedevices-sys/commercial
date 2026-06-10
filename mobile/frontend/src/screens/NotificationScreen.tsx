import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  getUserNotifications,
  markNotificationAsRead,
  INotification,
} from '../api/notificationApi';
import { useAuth } from '../context/AuthContext';

type RootStackParamList = {
  Notifications: undefined;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Notifications'
>;

const NotificationScreen: React.FC<Props> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<
    INotification[]
  >([]);

  const { user: userInfo } = useAuth();

  // LOAD NOTIFICATIONS
  useEffect(() => {
    fetchNotifications();
  }, [userInfo?.id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      if (userInfo?.id) {
        const response = await getUserNotifications(String(userInfo.id));
        setNotifications(response || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateValue: Date | string) => {
    const date = new Date(dateValue);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#ff6b00"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        🔔 Thông báo
      </Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>
            📭
          </Text>
          <Text style={styles.emptyText}>
            Bạn chưa có thông báo nào
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff6b00']}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                !item.isRead && styles.unreadCard,
              ]}
              onPress={() => handleMarkAsRead(String(item.id))}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                  {getNotificationIcon(item.type)}
                </Text>
              </View>

              <View style={styles.content}>
                <View style={styles.headerRow}>
                  <Text style={[
                    styles.title,
                    !item.isRead && styles.unreadTitle,
                  ]}>
                    {item.title}
                  </Text>
                  {!item.isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </View>

                <Text style={styles.message}>
                  {item.message}
                </Text>

                <Text style={styles.time}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingTop: 50,
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },

  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0d1b2a',
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  unreadCard: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ff6b00',
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6b0015',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 24,
  },

  content: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0d1b2a',
    flex: 1,
  },

  unreadTitle: {
    color: '#ff6b00',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b00',
    marginLeft: 8,
  },

  message: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 20,
  },

  time: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
