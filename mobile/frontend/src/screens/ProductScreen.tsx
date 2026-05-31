import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  useWindowDimensions,
  TextInput,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  fetchProducts,
  fetchProductsByCategoryId,
} from '../api/productApi';

import { logout } from '../api/authApi';
import { addProductToCart, getCartLinesByUserId } from '../api/cartApi';
import { getUserNotifications, INotification } from '../api/notificationApi';
import { fetchEnabledFeatureSettings, FeatureSetting } from '../api/featureSettingsApi';
import { useAuth } from '../context/AuthContext';
import { ICartLine, IProduct } from '../api/interface';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  Products: {
    user: {
      id: number;
      username: string;
      email?: string;
    };
  };
  ProductDetail: { productId: number };
  Cart: undefined;
  Notifications: undefined;
  Orders: undefined;
  Search: {
    user: {
      id: number;
      username: string;
      email?: string;
    };
  };
  Account: {
    user: {
      id: number;
      username: string;
      email?: string;
    };
  };
};

const categories = [
  { icon: '🔌', label: 'Thiết bị điện', id: 1 },
  { icon: '⚙️', label: 'Cơ khí', id: 2 },
  { icon: '🧰', label: 'Dụng cụ', id: 3 },
  { icon: '🚧', label: 'Thi công', id: 4 },
  { icon: '🛡️', label: 'An toàn', id: 5 },
];

const bottomTabs = [
  { icon: '🏠', label: 'Trang chủ' },
  { icon: '🔍', label: 'Tìm kiếm' },
  { icon: '🛒', label: 'Giỏ hàng' },
  { icon: '📦', label: 'Đơn hàng' },
  { icon: '👤', label: 'Cá nhân' },
];

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Products'
>;

const ProductScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { user } = route.params;

  const [products, setProducts] = useState<IProduct[]>([]);
  const [notifications, setNotifications] = useState<
    INotification[]
  >([]);

  const [cartLines, setCartLines] = useState<ICartLine[]>([]);

  const [featureSettings, setFeatureSettings] = useState<
    FeatureSetting[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(
    24 * 60 + 0
  );

  const [addingCartId, setAddingCartId] = useState<
    number | null
  >(null);

  // quantity theo từng sản phẩm
  const [quantities, setQuantities] = useState<{
    [key: number]: number;
  }>({});

  const [isHorizontalView, setIsHorizontalView] = useState(true);

  const { user: userInfo, isLoggingOut } = useAuth();

  const { width } = useWindowDimensions();

  const cardWidth = (width - 48) / 2;

  const unreadCount = notifications.filter(
    item => !item.isRead
  ).length;

  const cartLinesCount = (cartLines || []).filter(
    line => line.status === 1
  ).length;

  const userName = user?.username ?? 'Admin';

  const flashSaleProducts = products.slice(0, 4);

  const isFeatureEnabled = (featureKey: string): boolean => {
    const setting = featureSettings.find(f => f.featureKey === featureKey);
    return setting?.isEnabled ?? false;
  };

  const getFeatureConfig = (featureKey: string): Record<string, any> => {
    const setting = featureSettings.find(f => f.featureKey === featureKey);
    return setting?.config ?? {};
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!userInfo?.id || isLoggingOut) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // Clear notifications before fetching to ensure fresh state
        if (isMounted) setNotifications([]);

        const productData = await fetchProductsByCategoryId(selectedCategory || undefined);
        if (isMounted) setProducts(productData);

        const featureSettingsData = await fetchEnabledFeatureSettings();
        console.log('[ProductScreen] Fetched feature settings:', featureSettingsData);
        if (isMounted) setFeatureSettings(featureSettingsData || []);

        const notificationData = await getUserNotifications(userInfo.id.toString());
        console.log('[ProductScreen] Fetched notifications:', notificationData);
        if (isMounted) setNotifications(notificationData || []);
      } catch (error) {
        console.log(error);
        // Clear notifications on error to avoid stale badge count
        if (isMounted) setNotifications([]);

        if (isMounted) {
          Alert.alert(
            'Lỗi',
            'Không thể tải dữ liệu'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userInfo?.id, isLoggingOut, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadCartLines() {
        if (!userInfo?.id || isLoggingOut) {
          return;
        }

        try {
          const cartLines = await getCartLinesByUserId(userInfo.id);

          if (isMounted) setCartLines(cartLines);
        } catch (error) {
          console.log(error);

          if (isMounted) {
            Alert.alert(
              'Lỗi',
              'Không thể tải giỏ hàng'
            );
          }
        }
      }

      loadCartLines();

      return () => {
        isMounted = false;
      };
    }, [userInfo?.id, isLoggingOut])
  );

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadNotifications() {
        if (!userInfo?.id || isLoggingOut) {
          return;
        }

        try {
          const notificationData = await getUserNotifications(userInfo.id.toString());
          console.log('[ProductScreen] Fetched notifications:', notificationData);
          if (isMounted) setNotifications(notificationData || []);
        } catch (error) {
          console.log('[ProductScreen] Error loading notifications:', error);
          // Clear notifications on error to avoid stale badge count
          if (isMounted) setNotifications([]);
        }
      }

      loadNotifications();

      return () => {
        isMounted = false;
      };
    }, [userInfo?.id, isLoggingOut])
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min
      .toString()
      .padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setSearching(true);

    // Simulate search delay for animation
    setTimeout(() => {
      setSearching(false);
    }, 500);
  };

  const handleCategoryPress = (categoryLabel: string, categoryId: number) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const handleProductPress = (
    productId: number
  ) => {
    navigation.navigate('ProductDetail', {
      productId,
    });
  };

  // tăng số lượng
  const increaseQty = (productId: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  // giảm số lượng
  const decreaseQty = (productId: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(
        (prev[productId] || 1) - 1,
        1
      ),
    }));
  };

  // filter search
  const filteredProducts = products.filter(
    item =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const addToCart = async (product: IProduct) => {
    try {
      setAddingCartId(product.id);

      const quantity =
        quantities[product.id] || 1;

      const cartRequest = {
        userId: userInfo?.id ?? 0,
        productId: product.id,
        quantity,

        cartLines: [
          {
            productId: product.id,
            quantity,
            unitPrice: product.price,
            status: 1,
          },
        ],
      };

      console.log('Frontend: Adding to cart with request:', JSON.stringify(cartRequest));

      const response = await addProductToCart(cartRequest);

      console.log('Frontend: Add to cart response:', JSON.stringify(response));

      const cartLines = await getCartLinesByUserId(
          userInfo?.id ?? 0
        );

      console.log('Frontend: Cart lines after add:', JSON.stringify(cartLines));

      setCartLines(cartLines);

      Alert.alert(
        'Thành công',
        `Đã thêm ${quantity} ${product.name} vào giỏ hàng`
      );
    } catch (error: any) {
      console.log(
        'Add cart error:',
        error
      );

      Alert.alert(
        'Lỗi',
        error?.message ||
          'Không thể thêm vào giỏ hàng'
      );
    } finally {
      setAddingCartId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          color="#ff6b00"
          size="large"
        />

        <Text style={styles.loadingText}>
          Đang tải sản phẩm...
        </Text>
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
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Image
                source={require('../../asset/Logo.png')}
                style={styles.companyLogo}
                resizeMode="contain"
              />

              <View style={styles.greetingWrapper}>
                <Text style={styles.companyName}>
                  Cửa hàng thiết bị online
                </Text>
                <Text style={styles.greetingTitle}>
                  Xin chào, {userName}
                </Text>

                <Text style={styles.greetingSubtitle}>
                  Quản lý đặt hàng & thiết bị
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate('Notifications')
                }
              >
                <Text style={styles.iconSymbol}>
                  🔔
                </Text>

                {unreadCount > 0 && (
                  <View style={styles.notificationDot}>
                    <Text style={styles.notificationDotText}>
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate('Cart')
                }
              >
                <Text style={styles.iconSymbol}>
                  🛒
                </Text>
                 {cartLinesCount > 0 && (
                  <View style={styles.notificationDot}>
                    <Text style={styles.notificationDotText}>
                      {cartLinesCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SEARCH */}
        <View style={[styles.searchCard, search && styles.searchCardCompact]}>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="Tìm thiết bị, dụng cụ..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              value={search}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searching && (
              <ActivityIndicator
                color="#007bff"
                size="small"
                style={styles.searchLoadingIndicator}
              />
            )}
            {!searching && search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch('')}
                style={styles.clearButton}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* PROMO */}
        {!search && isFeatureEnabled('promotion') && (
          <View style={styles.promoCard}>
            <View style={styles.promoContent}>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>
                  {getFeatureConfig('promotion').badge_text || 'B2B'}
                </Text>
              </View>
              <Text style={styles.promoLabel}>
                Giảm tới {getFeatureConfig('promotion').min_discount || 20}%
              </Text>

              <Text style={styles.promoTitle}>
                Khuyến mãi mùa hè cho đơn hàng lớn
              </Text>

              <Text style={styles.promoSubtitle}>
                Ưu đãi dành cho đơn vị mua sỉ, thời gian có hạn.
              </Text>
            </View>
            <View style={styles.promoRightColumn}>
              <View style={styles.promoImageContainer}>
                <Text style={styles.promoImageIcon}>🛒</Text>
              </View>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>
                  Mua ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* CATEGORY */}
        {!search && (
          <>
            <Text style={styles.sectionTitle}>
              Danh mục
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category.label}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleCategoryPress(category.label, category.id)}
                >
                  <View style={[
                    styles.categoryIconContainer,
                    selectedCategory === category.id && styles.categoryIconContainerSelected,
                  ]}>
                    <Text style={styles.categoryIcon}>
                      {category.icon}
                    </Text>
                  </View>
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === category.id && styles.categoryLabelSelected,
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* FLASH SALE */}
        {!search && isFeatureEnabled('flash_sale') && (
          <View style={styles.flashSaleSection}>
            <View style={styles.flashSaleBanner}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
                }}
                style={styles.flashSaleBannerImage}
              />

              <View style={styles.flashSaleBannerOverlay}>
                <Text style={styles.flashSaleBannerTitle}>
                  ⚡ {getFeatureConfig('flash_sale').badge_text || 'FLASH SALE'}
                </Text>

                <Text style={styles.flashSaleBannerSubtitle}>
                  Giảm giá sốc - Thời gian có hạn!
                </Text>
              </View>
            </View>

            <View style={styles.flashSaleHeader}>
              <Text style={styles.sectionTitle}>
                Flash sale
              </Text>

              <Text style={styles.flashSaleTimer}>
                {formatTime(secondsLeft)}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.flashSaleList}
            >
              {flashSaleProducts.map(product => (
                <View
                  key={product.id}
                  style={styles.flashCard}
                >
                  <View style={styles.flashBadge}>
                    <Text style={styles.flashBadgeText}>
                      {product.badge ?? 'Hot'}
                    </Text>
                  </View>

                  <Image
                    source={{ uri: product.image }}
                    style={styles.flashImage}
                  />

                  <Text style={styles.flashName} numberOfLines={2}>
                    {product.name}
                  </Text>

                  <Text style={styles.flashPrice}>
                    {product.price.toLocaleString('vi-VN')} ₫
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* PRODUCT */}
        <View style={styles.productSectionHeader}>
          <Text style={styles.sectionTitle}>
            Sản phẩm nổi bật
          </Text>

          <View style={styles.productHeaderRight}>
            <Text style={styles.productsCount}>
              {filteredProducts.length} sản phẩm
            </Text>

            <TouchableOpacity
              style={styles.viewToggleButton}
              onPress={() => setIsHorizontalView(!isHorizontalView)}
            >
              <Text style={styles.viewToggleIcon}>
                {isHorizontalView ? '⬇️' : '➡️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isHorizontalView ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productListHorizontal}
          >
            {filteredProducts.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() =>
                  handleProductPress(item.id)
                }
                style={[
                  styles.productCard,
                  styles.productCardHorizontal,
                ]}
              >
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={styles.productImage}
                />

                <View style={styles.productCardBody}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>

                    {item.badge && isFeatureEnabled(item.badge.toLowerCase().replace(' ', '_')) ? (
                      <View style={styles.productBadge}>
                        <Text style={styles.productBadgeText}>
                          {item.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.productPrice}>
                    {item.price.toLocaleString('vi-VN')} ₫
                  </Text>

                  {/* QUANTITY */}
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        decreaseQty(item.id)
                      }
                    >
                      <Text style={styles.qtyButtonText}>
                        -
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>
                      {quantities[item.id] || 1}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        increaseQty(item.id)
                      }
                    >
                      <Text style={styles.qtyButtonText}>
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ADD CART */}
                  <TouchableOpacity
                    style={[
                      styles.addToCartButton,
                      addingCartId === item.id && {
                        opacity: 0.7,
                      },
                    ]}
                    disabled={
                      addingCartId === item.id
                    }
                    onPress={() =>
                      addToCart(item)
                    }
                  >
                    {addingCartId ===
                    item.id ? (
                      <ActivityIndicator
                        color="#fff"
                      />
                    ) : (
                      <Text
                        style={
                          styles.addToCartText
                        }
                      >
                        Thêm vào giỏ
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.productList}>
            {filteredProducts.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() =>
                  handleProductPress(item.id)
                }
                style={[
                  styles.productCard,
                  {
                    width: cardWidth,
                  },
                ]}
              >
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={styles.productImage}
                />

                <View style={styles.productCardBody}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>

                    {item.badge && isFeatureEnabled(item.badge.toLowerCase().replace(' ', '_')) ? (
                      <View style={styles.productBadge}>
                        <Text style={styles.productBadgeText}>
                          {item.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.productPrice}>
                    {item.price.toLocaleString('vi-VN')} ₫
                  </Text>

                  {/* QUANTITY */}
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        decreaseQty(item.id)
                      }
                    >
                      <Text style={styles.qtyButtonText}>
                        -
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>
                      {quantities[item.id] || 1}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        increaseQty(item.id)
                      }
                    >
                      <Text style={styles.qtyButtonText}>
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ADD CART */}
                  <TouchableOpacity
                    style={[
                      styles.addToCartButton,
                      addingCartId === item.id && {
                        opacity: 0.7,
                      },
                    ]}
                    disabled={
                      addingCartId === item.id
                    }
                    onPress={() =>
                      addToCart(item)
                    }
                  >
                    {addingCartId ===
                    item.id ? (
                      <ActivityIndicator
                        color="#fff"
                      />
                    ) : (
                      <Text
                        style={
                          styles.addToCartText
                        }
                      >
                        Thêm vào giỏ
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {bottomTabs.map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={styles.navItem}
            onPress={() => {
              if (
                tab.label ===
                'Tìm kiếm'
              ) {
                navigation.navigate(
                  'Search',
                  { user }
                );
              }

              if (
                tab.label ===
                'Giỏ hàng'
              ) {
                navigation.navigate(
                  'Cart'
                );
              }

              if (
                tab.label ===
                'Đơn hàng'
              ) {
                navigation.navigate(
                  'Orders'
                );
              }

              if (
                tab.label ===
                'Cá nhân'
              ) {
                navigation.navigate(
                  'Account',
                  { user }
                );
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

            <Text style={styles.navLabel}>
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
    paddingBottom: 120,
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

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    elevation: 4,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  companyLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },

  companyName: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },

  greetingWrapper: {
    flex: 1,
  },

  greetingTitle: {
    color: '#0d1b2a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },

  greetingSubtitle: {
    color: '#64748b',
    fontSize: 12,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  iconSymbol: {
    fontSize: 20,
  },

  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  notificationDotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 40,
    elevation: 3,
  },

  searchCardCompact: {
    marginBottom: 16,
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
  },

  searchLoadingIndicator: {
    position: 'absolute',
    right: 20,
  },

  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  clearIcon: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: 'bold',
  },

  promoCard: {
    backgroundColor: '#e8f0fe',
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  promoContent: {
    flex: 1,
    marginRight: 16,
  },

  promoRightColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  promoLabel: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },

  promoTitle: {
    color: '#0d1b2a',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },

  promoSubtitle: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 12,
  },

  promoButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  promoButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },

  promoBadge: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  promoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  promoImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },

  promoImageContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  promoImageIcon: {
    fontSize: 70,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d1b2a',
    marginBottom: 14,
  },

  categoryList: {
    paddingRight: 16,
    marginBottom: 24,
  },

  categoryItem: {
    marginRight: 16,
    alignItems: 'center',
  },

  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  categoryIcon: {
    fontSize: 28,
  },

  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0d1b2a',
    textAlign: 'center',
  },

  categoryItemSelected: {
    opacity: 1,
  },

  categoryIconContainerSelected: {
    backgroundColor: '#007bff',
  },

  categoryLabelSelected: {
    color: '#007bff',
    fontWeight: '700',
  },

  flashSaleSection: {
    marginBottom: 24,
  },

  flashSaleBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },

  flashSaleBannerImage: {
    width: '100%',
    height: 120,
  },

  flashSaleBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 123, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flashSaleBannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },

  flashSaleBannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },

  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  flashSaleTimer: {
    fontSize: 13,
    fontWeight: '900',
    color: '#007bff',
  },

  flashSaleList: {
    paddingBottom: 6,
  },

  flashCard: {
    width: 188,
    backgroundColor: '#0d1b2a',
    borderRadius: 20,
    padding: 16,
    marginRight: 14,
  },

  flashBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },

  flashBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  flashImage: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    marginBottom: 14,
  },

  flashName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
  },

  flashPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  productSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  productHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productsCount: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 12,
  },

  viewToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewToggleIcon: {
    fontSize: 18,
  },

  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },

  productListHorizontal: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    paddingBottom: 16,
  },

  productCardHorizontal: {
    width: 200,
    marginRight: 12,
  },

  productCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
  },

  productImage: {
    width: '100%',
    height: 150,
  },

  productCardBody: {
    padding: 14,
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  productName: {
    color: '#0d1b2a',
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
    marginRight: 8,
  },

  productBadge: {
    backgroundColor: '#ffedd5',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  productBadgeText: {
    color: '#c2410c',
    fontSize: 11,
    fontWeight: '900',
  },

  productPrice: {
    color: '#0d1b2a',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 14,
  },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  qtyText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },

  addToCartButton: {
    backgroundColor: '#007bff',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },

  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
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
});

export default ProductScreen;