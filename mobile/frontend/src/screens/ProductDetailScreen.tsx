import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchProduct, Product } from '../api/productApi';

type RootStackParamList = {
  Login: undefined;
  Products: { user: { id: number; username: string; email?: string } };
  ProductDetail: { productId: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const fetchedProduct = await fetchProduct(productId);
        setProduct(fetchedProduct);
      } catch (error: any) {
        Alert.alert('Lỗi', error?.message ?? 'Không thể tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#ff6b00" size="large" />
        <Text style={styles.loadingText}>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>‹ Quay lại</Text>
      </TouchableOpacity>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.productTitle}>{product.name}</Text>
          {product.badge ? (
            <View style={styles.badgeWrapper}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.productPrice}>{product.price.toLocaleString('vi-VN')} ₫</Text>
        {product.oldPrice ? <Text style={styles.oldPrice}>{product.oldPrice.toLocaleString('vi-VN')} ₫</Text> : null}
        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.infoRow}>
          {product.sku ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>SKU</Text>
              <Text style={styles.infoValue}>{product.sku}</Text>
            </View>
          ) : null}
          {product.unit ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Đơn vị</Text>
              <Text style={styles.infoValue}>{product.unit}</Text>
            </View>
          ) : null}
        </View>
        {product.moq ? (
          <View style={styles.infoBoxFull}>
            <Text style={styles.infoLabel}>Số lượng tối thiểu</Text>
            <Text style={styles.infoValue}>{product.moq}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F6F8',
    paddingBottom: 40,
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
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: '#e2e8f0',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  badgeWrapper: {
    backgroundColor: '#ffd8a8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 12,
  },
  badgeText: {
    color: '#c2410c',
    fontSize: 12,
    fontWeight: '700',
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ff6b00',
    marginBottom: 6,
  },
  oldPrice: {
    fontSize: 14,
    color: '#64748b',
    textDecorationLine: 'line-through',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 16,
    flex: 1,
    minWidth: '47%',
  },
  infoBoxFull: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 16,
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProductDetailScreen;
