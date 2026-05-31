import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { paymentMethodApi } from '../api/userProfileApi';

type RootStackParamList = {
  Login: undefined;
  Products: { user: { id: number; username: string; email?: string } };
  Account: { user: { id: number; username: string; email?: string } };
  PaymentMethod: { user: { id: number; username: string; email?: string } };
};

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethod'>;

type PaymentMethod = {
  id?: number;
  type?: string;
  provider?: string;
  card_number?: string;
  card_holder?: string;
  expiry_date?: string;
  is_default?: number;
};

type AccountPaymentSettings = {
  prepayment_enabled?: number;
  cash_on_delivery_enabled?: number;
  payment_settings?: {
    show_only_prepayment?: boolean;
    show_both_options?: boolean;
  };
};

const PaymentMethodScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState<PaymentMethod>({});
  const [accountSettings, setAccountSettings] = useState<AccountPaymentSettings>({});
  const [availablePaymentTypes, setAvailablePaymentTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const allPaymentTypes = [
    { id: 'cash', label: 'Tiền mặt', icon: '💵' },
    { id: 'card', label: 'Thẻ tín dụng/Ghi nợ', icon: '💳' },
    { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
    { id: 'momo', label: 'MoMo', icon: '📱' },
    { id: 'zalopay', label: 'ZaloPay', icon: '💰' },
    { id: 'prepayment', label: 'Trả trước', icon: '💸' },
    { id: 'cash_on_delivery', label: 'Thanh toán khi giao hàng', icon: '🚚' },
  ];

  const paymentTypes = allPaymentTypes.filter(pt => 
    availablePaymentTypes.includes(pt.id) || 
    !availablePaymentTypes.length
  );

  useEffect(() => {
    loadPaymentMethods();
    loadAccountSettings();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setError(null);
      const data = await paymentMethodApi.getPaymentMethods(user.id);
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setError(`Error loading payment methods: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const loadAccountSettings = async () => {
    try {
      const settings = await paymentMethodApi.getAccountPaymentSettings(user.id);
      setAccountSettings(settings);
      
      const available = await paymentMethodApi.getAvailablePaymentMethods(user.id);
      setAvailablePaymentTypes(available);
    } catch (error) {
      console.error('Error loading account settings:', error);
      setError(`Error loading account settings: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setSelectedType('');
    setFormData({});
    setModalVisible(true);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setSelectedType(payment.type || '');
    setFormData({ ...payment });
    setModalVisible(true);
  };

  const handleDeletePayment = async (id: number) => {
    Alert.alert(
      'Xóa phương thức thanh toán',
      'Bạn có chắc chắn muốn xóa phương thức thanh toán này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentMethodApi.deletePaymentMethod(id);
              loadPaymentMethods();
              Alert.alert('Thành công', 'Phương thức thanh toán đã được xóa');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Không thể xóa phương thức thanh toán';
              Alert.alert('Lỗi', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: number) => {
    try {
      await paymentMethodApi.setDefaultPaymentMethod(user.id, id);
      loadPaymentMethods();
      Alert.alert('Thành công', 'Phương thức thanh toán mặc định đã được cập nhật');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật phương thức thanh toán mặc định');
    }
  };

  const handleSavePayment = async () => {
    if (!selectedType) {
      Alert.alert('Lỗi', 'Vui lòng chọn loại phương thức thanh toán');
      return;
    }

    try {
      const paymentData = { ...formData, type: selectedType };
      if (editingPayment) {
        await paymentMethodApi.updatePaymentMethod(editingPayment.id!, paymentData);
      } else {
        await paymentMethodApi.createPaymentMethod(user.id, paymentData);
      }
      setModalVisible(false);
      loadPaymentMethods();
      Alert.alert('Thành công', 'Phương thức thanh toán đã được lưu');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu phương thức thanh toán');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await paymentMethodApi.updateAccountPaymentSettings(user.id, accountSettings);
      setSettingsModalVisible(false);
      loadAccountSettings();
      Alert.alert('Thành công', 'Cài đặt thanh toán đã được cập nhật');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật cài đặt thanh toán');
    }
  };

  const getPaymentTypeLabel = (type?: string) => {
    const paymentType = paymentTypes.find(pt => pt.id === type);
    return paymentType ? paymentType.label : type;
  };

  const getPaymentTypeIcon = (type?: string) => {
    const paymentType = paymentTypes.find(pt => pt.id === type);
    return paymentType ? paymentType.icon : '💳';
  };

  const renderPaymentItem = (payment: PaymentMethod) => (
    <View key={payment.id} style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentTypeContainer}>
          <Text style={styles.paymentIcon}>{getPaymentTypeIcon(payment.type)}</Text>
          <Text style={styles.paymentType}>{getPaymentTypeLabel(payment.type)}</Text>
        </View>
        {payment.is_default === 1 && <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>Mặc định</Text></View>}
      </View>
      {payment.card_number && <Text style={styles.paymentDetail}>**** **** **** {payment.card_number.slice(-4)}</Text>}
      {payment.card_holder && <Text style={styles.paymentDetail}>{payment.card_holder}</Text>}
      {payment.provider && <Text style={styles.paymentDetail}>{payment.provider}</Text>}
      {payment.expiry_date && <Text style={styles.paymentDetail}>Ngày hết hạn: {payment.expiry_date}</Text>}
      <View style={styles.paymentActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleSetDefault(payment.id!)}>
          <Text style={styles.actionButtonText}>Đặt mặc định</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditPayment(payment)}>
          <Text style={styles.actionButtonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeletePayment(payment.id!)}>
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
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content}>
        {paymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có phương thức thanh toán</Text>
          </View>
        ) : (
          paymentMethods.map(renderPaymentItem)
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
        <Text style={styles.addButtonText}>+ Thêm phương thức thanh toán</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsModalVisible(true)}>
        <Text style={styles.settingsButtonText}>⚙️ Cài đặt thanh toán</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingPayment ? 'Sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Loại phương thức thanh toán *</Text>
                <View style={styles.paymentTypesContainer}>
                  {paymentTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.paymentTypeOption,
                        selectedType === type.id && styles.paymentTypeOptionSelected,
                      ]}
                      onPress={() => setSelectedType(type.id)}
                    >
                      <Text style={styles.paymentTypeOptionIcon}>{type.icon}</Text>
                      <Text style={[
                        styles.paymentTypeOptionLabel,
                        selectedType === type.id && styles.paymentTypeOptionLabelSelected,
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {selectedType === 'card' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Số thẻ *</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.card_number || ''}
                      onChangeText={(text) => setFormData({ ...formData, card_number: text })}
                      placeholder="Nhập số thẻ"
                      keyboardType="number-pad"
                      maxLength={16}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Tên chủ thẻ *</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.card_holder || ''}
                      onChangeText={(text) => setFormData({ ...formData, card_holder: text })}
                      placeholder="Nhập tên chủ thẻ"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Ngày hết hạn (MM/YY) *</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.expiry_date || ''}
                      onChangeText={(text) => setFormData({ ...formData, expiry_date: text })}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </View>
                </>
              )}

              {(selectedType === 'bank_transfer' || selectedType === 'momo' || selectedType === 'zalopay') && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Tên ngân hàng/Nhà cung cấp *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.provider || ''}
                    onChangeText={(text) => setFormData({ ...formData, provider: text })}
                    placeholder="Nhập tên ngân hàng hoặc nhà cung cấp"
                  />
                </View>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePayment}>
              <Text style={styles.saveButtonText}>Lưu phương thức thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cài đặt thanh toán</Text>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bật thanh toán trả trước</Text>
                <Switch
                  value={accountSettings.prepayment_enabled === 1}
                  onValueChange={(value) => 
                    setAccountSettings({ ...accountSettings, prepayment_enabled: value ? 1 : 0 })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bật thanh toán khi giao hàng</Text>
                <Switch
                  value={accountSettings.cash_on_delivery_enabled === 1}
                  onValueChange={(value) => 
                    setAccountSettings({ ...accountSettings, cash_on_delivery_enabled: value ? 1 : 0 })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Chỉ hiển thị thanh toán trả trước</Text>
                <Switch
                  value={accountSettings.payment_settings?.show_only_prepayment || false}
                  onValueChange={(value) => 
                    setAccountSettings({
                      ...accountSettings,
                      payment_settings: {
                        ...accountSettings.payment_settings,
                        show_only_prepayment: value,
                        show_both_options: !value,
                      }
                    })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Hiển thị cả hai lựa chọn</Text>
                <Switch
                  value={accountSettings.payment_settings?.show_both_options !== false}
                  onValueChange={(value) => 
                    setAccountSettings({
                      ...accountSettings,
                      payment_settings: {
                        ...accountSettings.payment_settings,
                        show_both_options: value,
                        show_only_prepayment: !value,
                      }
                    })
                  }
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
              <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
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
  paymentItem: {
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
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  paymentType: {
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
  paymentDetail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  paymentActions: {
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
  paymentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  paymentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  paymentTypeOptionSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  paymentTypeOptionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  paymentTypeOptionLabel: {
    fontSize: 14,
    color: '#0d1b2a',
  },
  paymentTypeOptionLabelSelected: {
    color: '#fff',
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
  settingsButton: {
    backgroundColor: '#64748b',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    margin: 16,
    marginTop: 0,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
});

export default PaymentMethodScreen;
