import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { deliveryAddressApi } from '../api/userProfileApi';

type RootStackParamList = {
  Login: undefined;
  Products: { user: { id: number; username: string; email?: string } };
  Account: { user: { id: number; username: string; email?: string } };
  DeliveryAddress: { user: { id: number; username: string; email?: string } };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryAddress'>;

type DeliveryAddress = {
  id?: number;
  recipient_name?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  street_address?: string;
  is_default?: number;
};

const DeliveryAddressScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [formData, setFormData] = useState<DeliveryAddress>({});

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await deliveryAddressApi.getAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({});
    setModalVisible(true);
  };

  const handleEditAddress = (address: DeliveryAddress) => {
    setEditingAddress(address);
    setFormData({ ...address });
    setModalVisible(true);
  };

  const handleDeleteAddress = async (id: number) => {
    Alert.alert(
      'Xóa địa chỉ',
      'Bạn có chắc chắn muốn xóa địa chỉ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deliveryAddressApi.deleteAddress(id);
              loadAddresses();
              Alert.alert('Thành công', 'Địa chỉ đã được xóa');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa địa chỉ');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: number) => {
    try {
      await deliveryAddressApi.setDefaultAddress(user.id, id);
      loadAddresses();
      Alert.alert('Thành công', 'Địa chỉ mặc định đã được cập nhật');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ mặc định');
    }
  };

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await deliveryAddressApi.updateAddress(editingAddress.id!, formData);
      } else {
        await deliveryAddressApi.createAddress(user.id, formData);
      }
      setModalVisible(false);
      loadAddresses();
      Alert.alert('Thành công', 'Địa chỉ đã được lưu');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ');
    }
  };

  const renderAddressItem = (address: DeliveryAddress) => (
    <View key={address.id} style={styles.addressItem}>
      <View style={styles.addressHeader}>
        <Text style={styles.recipientName}>{address.recipient_name}</Text>
        {address.is_default === 1 && <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>Mặc định</Text></View>}
      </View>
      <Text style={styles.phone}>{address.phone}</Text>
      <Text style={styles.address}>{`${address.street_address}, ${address.ward}, ${address.district}, ${address.province}`}</Text>
      <View style={styles.addressActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleSetDefault(address.id!)}>
          <Text style={styles.actionButtonText}>Đặt mặc định</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditAddress(address)}>
          <Text style={styles.actionButtonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteAddress(address.id!)}>
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có địa chỉ giao hàng</Text>
          </View>
        ) : (
          addresses.map(renderAddressItem)
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
        <Text style={styles.addButtonText}>+ Thêm địa chỉ mới</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tên người nhận *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.recipient_name || ''}
                  onChangeText={(text) => setFormData({ ...formData, recipient_name: text })}
                  placeholder="Nhập tên người nhận"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Số điện thoại *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone || ''}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tỉnh/Thành phố *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.province || ''}
                  onChangeText={(text) => setFormData({ ...formData, province: text })}
                  placeholder="Nhập tỉnh/thành phố"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Quận/Huyện *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.district || ''}
                  onChangeText={(text) => setFormData({ ...formData, district: text })}
                  placeholder="Nhập quận/huyện"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phường/Xã *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.ward || ''}
                  onChangeText={(text) => setFormData({ ...formData, ward: text })}
                  placeholder="Nhập phường/xã"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Địa chỉ cụ thể *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.street_address || ''}
                  onChangeText={(text) => setFormData({ ...formData, street_address: text })}
                  placeholder="Nhập số nhà, tên đường"
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
              <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  addressItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  defaultBadge: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  phone: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#0d1b2a',
    marginBottom: 12,
  },
  addressActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  actionButton: {
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
  addButton: {
    backgroundColor: '#007bff',
    margin: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  modalClose: {
    fontSize: 24,
    color: '#94a3b8',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  formInput: {
    fontSize: 16,
    color: '#0d1b2a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#007bff',
    margin: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DeliveryAddressScreen;
