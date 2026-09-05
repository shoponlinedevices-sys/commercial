'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { paymentMethodService, PaymentMethod, AccountPaymentSettings } from '@/services/payment-method.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Plus, Edit, Trash2, ArrowLeft, Check, Settings } from 'lucide-react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const paymentTypes = [
  { id: 'cash', label: 'Tiền mặt', icon: '💵' },
  { id: 'card', label: 'Thẻ tín dụng/Ghi nợ', icon: '💳' },
  { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', label: 'MoMo', icon: '📱' },
  { id: 'zalopay', label: 'ZaloPay', icon: '💰' },
  { id: 'prepayment', label: 'Trả trước', icon: '💸' },
  { id: 'cash_on_delivery', label: 'Thanh toán khi giao hàng', icon: '🚚' },
];

export default function PaymentMethodPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [accountSettings, setAccountSettings] = useState<AccountPaymentSettings>({});
  const [availablePaymentTypes, setAvailablePaymentTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState<PaymentMethod>({});

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [methods, settings, available] = await Promise.all([
        paymentMethodService.getPaymentMethods(user.id),
        paymentMethodService.getAccountPaymentSettings(user.id),
        paymentMethodService.getAvailablePaymentMethods(user.id),
      ]);
      setPaymentMethods(methods);
      setAccountSettings(settings);
      setAvailablePaymentTypes(available);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setSelectedType('');
    setFormData({});
    setModalOpen(true);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setSelectedType(payment.type || '');
    setFormData({ ...payment });
    setModalOpen(true);
  };

  const handleDeletePayment = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?')) return;
    
    try {
      await paymentMethodService.deletePaymentMethod(id);
      await loadData();
      alert('Phương thức thanh toán đã được xóa');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert('Không thể xóa phương thức thanh toán');
    }
  };

  const handleSetDefault = async (id: number) => {
    if (!user) return;
    try {
      await paymentMethodService.setDefaultPaymentMethod(user.id, id);
      await loadData();
      alert('Phương thức thanh toán mặc định đã được cập nhật');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      alert('Không thể cập nhật phương thức thanh toán mặc định');
    }
  };

  const handleSavePayment = async () => {
    if (!user) return;
    if (!selectedType) {
      alert('Vui lòng chọn loại phương thức thanh toán');
      return;
    }

    try {
      const paymentData = { ...formData, type: selectedType };
      if (editingPayment) {
        await paymentMethodService.updatePaymentMethod(editingPayment.id!, paymentData);
      } else {
        await paymentMethodService.createPaymentMethod(user.id, paymentData);
      }
      setModalOpen(false);
      await loadData();
      alert('Phương thức thanh toán đã được lưu');
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert('Không thể lưu phương thức thanh toán');
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    try {
      await paymentMethodService.updateAccountPaymentSettings(user.id, accountSettings);
      setSettingsModalOpen(false);
      await loadData();
      alert('Cài đặt thanh toán đã được cập nhật');
    } catch (error) {
      console.error('Error updating payment settings:', error);
      alert('Không thể cập nhật cài đặt thanh toán');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1">
          <Header />
          <div className="container mx-auto px-4 py-8 mt-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
        <Button
          variant="ghost"
          onClick={() => router.push('/account')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Phương thức thanh toán</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSettingsModalOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt thanh toán
            </Button>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddPayment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phương thức
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPayment ? 'Sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Loại phương thức thanh toán *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`p-3 rounded-lg border-2 text-left transition-colors ${
                            selectedType === type.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <span className="text-2xl mr-2">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedType === 'card' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Số thẻ *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.card_number || ''}
                          onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                          placeholder="Nhập số thẻ"
                          maxLength={16}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">Tên chủ thẻ *</Label>
                        <Input
                          id="cardHolder"
                          value={formData.card_holder || ''}
                          onChange={(e) => setFormData({ ...formData, card_holder: e.target.value })}
                          placeholder="Nhập tên chủ thẻ"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Ngày hết hạn (MM/YY) *</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiry_date || ''}
                          onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                    </>
                  )}

                  {(selectedType === 'bank_transfer' || selectedType === 'momo' || selectedType === 'zalopay') && (
                    <div className="space-y-2">
                      <Label htmlFor="provider">Tên ngân hàng/Nhà cung cấp *</Label>
                      <Input
                        id="provider"
                        value={formData.provider || ''}
                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                        placeholder="Nhập tên ngân hàng hoặc nhà cung cấp"
                      />
                    </div>
                  )}

                  <Button onClick={handleSavePayment} className="w-full">
                    Lưu phương thức thanh toán
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cài đặt thanh toán</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="prepayment">Bật thanh toán trả trước</Label>
                <input
                  id="prepayment"
                  type="checkbox"
                  checked={accountSettings.prepayment_enabled === 1}
                  onChange={(e) => setAccountSettings({ ...accountSettings, prepayment_enabled: e.target.checked ? 1 : 0 })}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="cod">Bật thanh toán khi giao hàng</Label>
                <input
                  id="cod"
                  type="checkbox"
                  checked={accountSettings.cash_on_delivery_enabled === 1}
                  onChange={(e) => setAccountSettings({ ...accountSettings, cash_on_delivery_enabled: e.target.checked ? 1 : 0 })}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showOnlyPrepayment">Chỉ hiển thị thanh toán trả trước</Label>
                <input
                  id="showOnlyPrepayment"
                  type="checkbox"
                  checked={accountSettings.payment_settings?.show_only_prepayment || false}
                  onChange={(e) => 
                    setAccountSettings({
                      ...accountSettings,
                      payment_settings: {
                        ...accountSettings.payment_settings,
                        show_only_prepayment: e.target.checked,
                        show_both_options: !e.target.checked,
                      }
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showBoth">Hiển thị cả hai lựa chọn</Label>
                <input
                  id="showBoth"
                  type="checkbox"
                  checked={accountSettings.payment_settings?.show_both_options !== false}
                  onChange={(e) => 
                    setAccountSettings({
                      ...accountSettings,
                      payment_settings: {
                        ...accountSettings.payment_settings,
                        show_both_options: e.target.checked,
                        show_only_prepayment: !e.target.checked,
                      }
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                Lưu cài đặt
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có phương thức thanh toán</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getPaymentTypeIcon(payment.type)}</span>
                        <h3 className="font-semibold text-lg">{getPaymentTypeLabel(payment.type)}</h3>
                        {payment.is_default === 1 && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      {payment.card_number && (
                        <p className="text-muted-foreground mb-1">**** **** **** {payment.card_number.slice(-4)}</p>
                      )}
                      {payment.card_holder && (
                        <p className="text-muted-foreground mb-1">{payment.card_holder}</p>
                      )}
                      {payment.provider && (
                        <p className="text-muted-foreground mb-1">{payment.provider}</p>
                      )}
                      {payment.expiry_date && (
                        <p className="text-muted-foreground">Ngày hết hạn: {payment.expiry_date}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(payment.id!)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Đặt mặc định
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPayment(payment)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePayment(payment.id!)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
