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
  getUserOrders,
  IOrder,
} from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { getCartLinesByUserId } from '../api/cartApi';
import { getUserNotifications } from '../api/notificationApi';

type RootStackParamList = {
  Orders: undefined;
  Products: { user: { id: number; username: string; email?: string } };
  Search: { user: { id: number; username: string; email?: string } };
  Cart: undefined;
  Account: { user: { id: number; username: string; email?: string } };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Orders'
>;

const bottomTabs = [
  { icon: '🏠', label: 'Trang chủ' },
  { icon: '🔍', label: 'Tìm kiếm' },
  { icon: '🛒', label: 'Giỏ hàng' },
  { icon: '📦', label: 'Đơn hàng' },
  { icon: '👤', label: 'Cá nhân' },
];

const OrderScreen: React.FC<Props> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<
    IOrder[]
  >([]);
  const [cartLines, setCartLines] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { user: userInfo } = useAuth();

  const cartLinesCount = (cartLines || []).filter(
    line => line.status === 1
  ).length;

  const unreadCount = notifications.filter(
    item => !item.isRead
  ).length;

  // LOAD ORDERS
  useEffect(() => {
    fetchOrders();
    loadCartLines();
    loadNotifications();
  }, [userInfo?.id]);

  const loadCartLines = async () => {
    if (!userInfo?.id) return;
    try {
      const data = await getCartLinesByUserId(userInfo.id);
      setCartLines(data || []);
    } catch (error) {
      console.log('Error loading cart lines:', error);
    }
  };

  const loadNotifications = async () => {
    if (!userInfo?.id) return;
    try {
      const data = await getUserNotifications(userInfo.id.toString());
      setNotifications(data || []);
    } catch (error) {
      console.log('Error loading notifications:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (userInfo?.id) {
        console.log('Fetching orders for user ID:', userInfo.id);
        const response = await getUserOrders(String(userInfo.id));
        console.log('Orders response:', response);
        setOrders(response || []);
      }
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const formatDate = (dateValue: Date | string) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'shipped':
        return '#3b82f6';
      default:
        return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'shipped':
        return 'Đang giao';
      default:
        return status;
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
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>
          📦 Đơn hàng
        </Text>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              📭
            </Text>
            <Text style={styles.emptyText}>
              Bạn chưa có đơn hàng nào
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
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
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderId}>
                    Đơn hàng #{item.id}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) + '20' },
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(item.status) },
                    ]}>
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.label}>
                    Ngày đặt:
                  </Text>
                  <Text style={styles.value}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.label}>
                    Tổng tiền:
                  </Text>
                  <Text style={styles.totalPrice}>
                    {item.totalAmount.toLocaleString(
                      'vi-VN',
                    )}{' '}
                    ₫
                  </Text>
                </View>

                {item.orderLines && item.orderLines.length > 0 && (
                  <View style={styles.orderLinesContainer}>
                    <Text style={styles.orderLinesTitle}>
                      Sản phẩm ({item.orderLines.length}):
                    </Text>
                    {item.orderLines.map((line: any, index: number) => (
                      <View key={index} style={styles.orderLineItem}>
                        <Text style={styles.orderLineText}>
                          • {line.quantity}x Sản phẩm #{line.productId}
                        </Text>
                        <Text style={styles.orderLinePrice}>
                          {(parseFloat(line.unitPrice) * line.quantity).toLocaleString('vi-VN')} ₫
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {item.shippingAddress && (
                  <View style={styles.cardContent}>
                    <Text style={styles.label}>
                      Địa chỉ giao:
                    </Text>
                    <Text style={styles.value}>
                      {item.shippingAddress}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {bottomTabs.map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={styles.navItem}
            onPress={() => {
              if (tab.label === 'Trang chủ') {
                navigation.navigate('Products', { user: userInfo });
              }
              if (tab.label === 'Tìm kiếm') {
                navigation.navigate('Search', { user: userInfo });
              }
              if (tab.label === 'Giỏ hàng') {
                navigation.navigate('Cart');
              }
              if (tab.label === 'Đơn hàng') {
                // Already on Orders screen
              }
              if (tab.label === 'Cá nhân') {
                navigation.navigate('Account', { user: userInfo });
              }
            }}
          >
            <View style={styles.navIconContainer}>
              <Text style={styles.navIcon}>
                {tab.icon}
              </Text>
              {tab.label === 'Giỏ hàng' && cartLinesCount > 0 && (
                <View style={styles.bottomNavBadge}>
                  <Text style={styles.bottomNavBadgeText}>
                    {cartLinesCount}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[
              styles.navLabel,
              tab.label === 'Đơn hàng' && styles.activeNavLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  contentContainer: {
    paddingTop: 50,
    padding: 16,
    paddingBottom: 120,
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
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

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0d1b2a',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: '#64748b',
  },

  value: {
    fontSize: 14,
    color: '#0d1b2a',
    fontWeight: '600',
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ff6b00',
  },

  orderLinesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  orderLinesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0d1b2a',
    marginBottom: 8,
  },

  orderLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  orderLineText: {
    fontSize: 13,
    color: '#475569',
  },

  orderLinePrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0d1b2a',
  },

  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 74,
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 6,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIconContainer: {
    position: 'relative',
  },

  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },

  bottomNavBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  bottomNavBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },

  navLabel: {
    fontSize: 11,
    color: '#475569',
  },

  activeNavLabel: {
    color: '#ff6b00',
    fontWeight: '700',
  },
});
