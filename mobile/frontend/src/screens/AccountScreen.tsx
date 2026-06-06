import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { logout } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { setLoggingOut } from '../api/apiClient';

type RootStackParamList = {
  Login: undefined;
  Products: { user: { id: number; username: string; email?: string } };
  ProductDetail: { productId: number };
  Cart: undefined;
  Notifications: undefined;
  Orders: undefined;
  Search: { user: { id: number; username: string; email?: string } };
  Account: { user: { id: number; username: string; email?: string } };
  PersonalInfo: { user: { id: number; username: string; email?: string } };
  DeliveryAddress: { user: { id: number; username: string; email?: string } };
  PaymentMethod: { user: { id: number; username: string; email?: string } };
  ChangePassword: { user: { id: number; username: string; email?: string } };
};

const bottomTabs = [
  { icon: '🏠', label: 'Trang chủ' },
  { icon: '🔍', label: 'Tìm kiếm' },
  { icon: '🛒', label: 'Giỏ hàng' },
  { icon: '📦', label: 'Đơn hàng' },
  { icon: '👤', label: 'Cá nhân' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

const AccountScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  const { setUser, setIsLoggingOut } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              setLoggingOut(true);
              await logout();
              setUser(null);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.log('Logout error:', error);
              setIsLoggingOut(false);
              setLoggingOut(false);
              Alert.alert('Lỗi', 'Không thể đăng xuất');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: '👤',
      label: 'Thông tin cá nhân',
      onPress: () => {
        navigation.navigate('PersonalInfo', { user });
      },
    },
    {
      icon: '🔑',
      label: 'Đổi mật khẩu',
      onPress: () => {
        navigation.navigate('ChangePassword', { user });
      },
    },
    {
      icon: '📦',
      label: 'Đơn hàng của tôi',
      onPress: () => {
        navigation.navigate('Orders');
      },
    },
    {
      icon: '🛒',
      label: 'Giỏ hàng',
      onPress: () => {
        navigation.navigate('Cart');
      },
    },
    {
      icon: '🔔',
      label: 'Thông báo',
      onPress: () => {
        navigation.navigate('Notifications');
      },
    },
    {
      icon: '📍',
      label: 'Địa chỉ giao hàng',
      onPress: () => {
        navigation.navigate('DeliveryAddress', { user });
      },
    },
    {
      icon: '💳',
      label: 'Phương thức thanh toán',
      onPress: () => {
        navigation.navigate('PaymentMethod', { user });
      },
    },
    {
      icon: '⚙️',
      label: 'Cài đặt',
      onPress: () => {
        Alert.alert('Cài đặt', 'Tính năng đang phát triển');
      },
    },
    {
      icon: '❓',
      label: 'Trợ giúp & Hỗ trợ',
      onPress: () => {
        Alert.alert('Trợ giúp & Hỗ trợ', 'Tính năng đang phát triển');
      },
    },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.statIcon}>🛒</Text>
            <Text style={styles.statLabel}>Giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.statIcon}>🔔</Text>
            <Text style={styles.statLabel}>Thông báo</Text>
          </TouchableOpacity>
        </View>

        {/* MENU */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Tài khoản</Text>
          {menuItems.slice(0, 4).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Khác</Text>
          {menuItems.slice(4).map((item, index) => (
            <TouchableOpacity
              key={index + 4}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* VERSION */}
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {bottomTabs.map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={styles.navItem}
            onPress={() => {
              if (tab.label === 'Trang chủ') {
                navigation.navigate('Products', { user });
              }
              if (tab.label === 'Tìm kiếm') {
                navigation.navigate('Search', { user });
              }
              if (tab.label === 'Giỏ hàng') {
                navigation.navigate('Cart');
              }
              if (tab.label === 'Đơn hàng') {
                navigation.navigate('Orders');
              }
              if (tab.label === 'Cá nhân') {
                // Already on account screen
              }
            }}
          >
            <Text style={[styles.navIcon, tab.label === 'Cá nhân' && styles.navIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.navLabel, tab.label === 'Cá nhân' && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0d1b2a',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0d1b2a',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d1b2a',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: '#0d1b2a',
  },
  menuArrow: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#007bff',
  },
});

export default AccountScreen;
