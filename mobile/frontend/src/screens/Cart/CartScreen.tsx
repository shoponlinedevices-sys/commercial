import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  getCart,
  rmCartLine,
  clearCartByUserId,
} from '../../api/cartApi';
import { createOrder } from '../../api/orderApi';
import { createNotification } from '../../api/notificationApi';
import { sendOrderConfirmationEmail } from '../../api/emailApi';
import { getFcmToken } from '../../api/tokenStorage';
import { useAuth } from '../../context/AuthContext';

import { ICartLine, IProduct } from '../../api/interface';

type RootStackParamList = {
  Cart: undefined;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Cart'
>;

const CartScreen: React.FC<Props> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);

  const [cartItems, setCartItems] = useState<
    ICartLine[]
  >([]);

  const { user: userInfo } = useAuth();

  // LOAD CART
  useEffect(() => {
    if (userInfo?.id) {
      fetchCart();
    }
  }, [userInfo?.id]);

  const fetchCart = async () => {
    try {
      setLoading(true);

      console.log('Fetching cart for user ID:', userInfo?.id);
      const response = await getCart(userInfo?.id || 0);
      console.log('Cart response:', response);

      const mappedItems: ICartLine[] =
        response?.cartLines?.map((item: ICartLine) => ({
          id: item.id,
          productId: item.productId,
          name: item.name || item.product?.name || 'Không có tên',
          image: item.image || item.product?.image || 'https://via.placeholder.com/150',
          unitPrice: item.unitPrice || 0,
          quantity: item.quantity || 1,
          status: item.status || 0,
        })) || [];

      console.log('Mapped cart items:', mappedItems);
      setCartItems(mappedItems);
    } catch (error) {
      console.log('Error fetching cart:', error);

      Alert.alert(
        'Lỗi',
        'Không thể tải giỏ hàng',
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.productId === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.productId === id &&
        item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      ),
    );
  };

  // DELETE ITEM
  const removeItem = async (id: number) => {
    Alert.alert(
      'Xóa sản phẩm',
      'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',

          onPress: async () => {
            try {

              await rmCartLine(id);

              // UPDATE UI
              setCartItems(prev =>
                prev.filter(
                  item => item.id !== id,
                ),
              );

              Alert.alert(
                'Thành công',
                'Đã xóa sản phẩm khỏi giỏ hàng',
              );
            } catch (error) {
              console.log(error);

              Alert.alert(
                'Lỗi',
                'Không thể xóa sản phẩm',
              );
            }
          },
        },
      ],
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.unitPrice * item.quantity,
    0,
  );

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống');
      return;
    }

    setIsOrdering(true);

    // Check if user has email
    const hasEmail = userInfo?.email && userInfo.email.trim() !== '';
    
    if (!hasEmail) {
      Alert.alert(
        'Thông báo',
        'Bạn chưa có email trong tài khoản. Vui lòng cập nhật email để nhận thông báo về đơn hàng.',
        [
          {
            text: 'Đặt hàng ngay',
            onPress: () => proceedWithOrder(),
          },
          {
            text: 'Cập nhật email sau',
            onPress: () => proceedWithOrder(),
            style: 'cancel',
          },
        ],
      );
    } else {
      proceedWithOrder();
    }
  };

  const proceedWithOrder = async () => {
    try {
      const fcmToken = await getFcmToken();

      const orderLines = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
      }));

      const totalAmount = orderLines.reduce(
        (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity,
        0,
      );

      const orderResponse = await createOrder({
        userId: String(userInfo?.id),
        totalAmount,
        orderLines,
        fcmToken: fcmToken || undefined,
      });

      // Create notification (non-blocking)
      try {
        console.log('[Notification] Preparing notification data, userInfo:', userInfo, 'orderResponse:', orderResponse);
        
        if (!userInfo?.id) {
          console.warn('[Notification] Skipping notification - user ID is missing');
        } else {
          const notificationData: any = {
            userId: String(userInfo.id),
            title: 'Đặt hàng thành công',
            message: `Đơn hàng của bạn với tổng giá ${totalAmount.toLocaleString('vi-VN')} ₫ đã được đặt thành công.`,
            type: 'order',
          };
          
          // Only add orderId if it exists
          if (orderResponse?.id) {
            notificationData.metadata = { orderId: orderResponse.id };
          }
          
          console.log('[Notification] Sending notification request:', notificationData);
          const notificationResponse = await createNotification(notificationData);
          console.log('[Notification] Notification created successfully:', notificationResponse);
        }
      } catch (notificationError: any) {
        console.error('[Notification] Failed to create notification:', notificationError);
        console.error('[Notification] Error details:', {
          message: notificationError?.message,
          stack: notificationError?.stack,
          userInfo: userInfo,
          orderResponse: orderResponse,
        });
        // Don't block order placement if notification fails
      }

      // Send email notification if user has email (non-blocking)
      if (userInfo?.email && userInfo.email.trim() !== '' && orderResponse?.id) {
        try {
          console.log('[Email] Sending order confirmation email to:', userInfo.email);
          const emailResponse = await sendOrderConfirmationEmail(
            userInfo.email,
            {
              orderId: orderResponse?.id,
              totalAmount,
              orderLines: cartItems.map(item => ({
                productId: String(item.productId),
                productName: item.name || 'Sản phẩm',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.unitPrice * item.quantity,
                productImage: item.image,
              })),
              customerName: userInfo?.username,
            },
          );
          console.log('[Email] Email sent successfully:', emailResponse);
        } catch (emailError: any) {
          console.error('[Email] Failed to send email:', emailError);
          // Don't block order placement if email sending fails
        }
      }

      await clearCartByUserId(userInfo?.id || 0);

      Alert.alert(
        'Thành công',
        'Đặt hàng thành công!',
      );

      setCartItems([]);
    } catch (error) {
      console.error('[Order] Failed to place order:', error);
      Alert.alert(
        'Lỗi',
        'Không thể đặt hàng',
      );
    } finally {
      setIsOrdering(false);
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
        🛒 Giỏ hàng
      </Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Giỏ hàng của bạn đang trống
          </Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item =>
            item.productId.toString()
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />

              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.name || ''}
                </Text>

                <Text style={styles.price}>
                  {item.unitPrice.toLocaleString(
                    'vi-VN',
                  )}{' '}
                  ₫
                </Text>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      decreaseQty(item.productId)
                    }
                  >
                    <Text style={styles.qtyText}>
                      -
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.quantity}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      increaseQty(item.productId)
                    }
                  >
                    <Text style={styles.qtyText}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  removeItem(item.id)
                }
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>
                  Xóa
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>
            Tổng tiền
          </Text>

          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString(
              'vi-VN',
            )}{' '}
            ₫
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutBtn,
            (cartItems.length === 0 || isOrdering) && styles.checkoutBtnDisabled,
          ]}
          onPress={handleOrder}
          disabled={cartItems.length === 0 || isOrdering}
        >
          {isOrdering ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[
              styles.checkoutText,
              cartItems.length === 0 && styles.checkoutTextDisabled,
            ]}>
              Đặt hàng
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

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
    padding: 12,
    marginBottom: 14,
    elevation: 3,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#eee',
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0d1b2a',
  },

  price: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ff6b00',
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },

  quantity: {
    marginHorizontal: 14,
    fontSize: 16,
    fontWeight: '800',
  },

  deleteBtn: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  deleteText: {
    color: '#ef4444',
    fontWeight: '800',
  },

  footer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  totalLabel: {
    fontSize: 14,
    color: '#64748b',
  },

  totalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0d1b2a',
    marginTop: 4,
  },

  checkoutBtn: {
    backgroundColor: '#ff6b00',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },

  checkoutText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },

  checkoutBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },

  checkoutTextDisabled: {
    color: '#94a3b8',
  },
});