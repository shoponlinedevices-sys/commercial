import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchProducts } from '../api/productApi';
import { IProduct } from '../api/interface';

type RootStackParamList = {
  Login: undefined;
  Products: { user: { id: number; username: string; email?: string } };
  Search: { user: { id: number; username: string; email?: string } };
  ProductDetail: { productId: number };
  Cart: undefined;
  Notifications: undefined;
  Orders: undefined;
  Account: { user: { id: number; username: string; email?: string } };
};

const bottomTabs = [
  { icon: '🏠', label: 'Trang chủ' },
  { icon: '🔍', label: 'Tìm kiếm' },
  { icon: '🛒', label: 'Giỏ hàng' },
  { icon: '📦', label: 'Đơn hàng' },
  { icon: '👤', label: 'Cá nhân' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  const { isLoggingOut } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      if (isLoggingOut) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const productData = await fetchProducts();
        if (isMounted) {
          setProducts(productData);
          setFilteredProducts(productData);
        }
      } catch (error) {
        console.log(error);
        if (isMounted) {
          Alert.alert('Lỗi', 'Không thể tải sản phẩm');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [isLoggingOut]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      const productData = await fetchProducts();
      setProducts(productData);
      setFilteredProducts(productData);
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setSearching(true);
    setTimeout(() => setSearching(false), 300);
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#ff6b00" size="large" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tìm kiếm</Text>
          <Text style={styles.headerSubtitle}>Tìm thiết bị, dụng cụ...</Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập tên sản phẩm..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searching && (
              <ActivityIndicator
                color="#007bff"
                size="small"
                style={styles.searchLoading}
              />
            )}
            {searchQuery.length > 0 && !searching && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* RESULTS */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {searchQuery ? `Kết quả tìm kiếm (${filteredProducts.length})` : 'Tất cả sản phẩm'}
          </Text>

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
              <Text style={styles.emptySubtext}>Thử từ khóa khác</Text>
            </View>
          ) : (
            <View style={styles.productList}>
              {filteredProducts.map(item => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  onPress={() => handleProductPress(item.id)}
                  style={styles.productCard}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.productPrice}>
                      {item.price.toLocaleString('vi-VN')} ₫
                    </Text>
                    {item.badge && (
                      <View style={styles.productBadge}>
                        <Text style={styles.productBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
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
                // Already on search screen
              }
              if (tab.label === 'Giỏ hàng') {
                navigation.navigate('Cart');
              }
              if (tab.label === 'Đơn hàng') {
                navigation.navigate('Orders');
              }
              if (tab.label === 'Cá nhân') {
                navigation.navigate('Account', { user });
              }
            }}
          >
            <Text style={[styles.navIcon, tab.label === 'Tìm kiếm' && styles.navIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.navLabel, tab.label === 'Tìm kiếm' && styles.navLabelActive]}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#475569',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0d1b2a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    paddingVertical: 14,
  },
  searchLoading: {
    marginRight: 12,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  resultsSection: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d1b2a',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  productCard: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d1b2a',
    marginBottom: 8,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ff6b00',
    marginBottom: 8,
  },
  productBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  productBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
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

export default SearchScreen;
