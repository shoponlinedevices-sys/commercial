'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { deliveryAddressService, DeliveryAddress } from '@/services/delivery-address.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Check } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function DeliveryAddressPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [formData, setFormData] = useState<DeliveryAddress>({});

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await deliveryAddressService.getAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({});
    setModalOpen(true);
  };

  const handleEditAddress = (address: DeliveryAddress) => {
    setEditingAddress(address);
    setFormData({ ...address });
    setModalOpen(true);
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    
    try {
      await deliveryAddressService.deleteAddress(id);
      await loadAddresses();
      alert('Địa chỉ đã được xóa');
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Không thể xóa địa chỉ');
    }
  };

  const handleSetDefault = async (id: number) => {
    if (!user) return;
    try {
      await deliveryAddressService.setDefaultAddress(user.id, id);
      await loadAddresses();
      alert('Địa chỉ mặc định đã được cập nhật');
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Không thể cập nhật địa chỉ mặc định');
    }
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    try {
      if (editingAddress) {
        await deliveryAddressService.updateAddress(editingAddress.id!, formData);
      } else {
        await deliveryAddressService.createAddress(user.id, formData);
      }
      setModalOpen(false);
      await loadAddresses();
      alert('Địa chỉ đã được lưu');
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Không thể lưu địa chỉ');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
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
      <Sidebar />
      <div className="flex-1 lg:ml-64">
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
          <h1 className="text-3xl font-bold">Địa chỉ giao hàng</h1>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm địa chỉ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Tên người nhận *</Label>
                  <Input
                    id="recipientName"
                    value={formData.recipient_name || ''}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    placeholder="Nhập tên người nhận"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                  <Input
                    id="province"
                    value={formData.province || ''}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="Nhập tỉnh/thành phố"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">Quận/Huyện *</Label>
                  <Input
                    id="district"
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Nhập quận/huyện"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã *</Label>
                  <Input
                    id="ward"
                    value={formData.ward || ''}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Nhập phường/xã"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Địa chỉ cụ thể *</Label>
                  <Input
                    id="streetAddress"
                    value={formData.street_address || ''}
                    onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                    placeholder="Nhập số nhà, tên đường"
                  />
                </div>

                <Button onClick={handleSaveAddress} className="w-full">
                  Lưu địa chỉ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có địa chỉ giao hàng</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{address.recipient_name}</h3>
                        {address.is_default === 1 && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-1">{address.phone}</p>
                      <p className="text-sm">
                        {address.street_address}, {address.ward}, {address.district}, {address.province}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id!)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Đặt mặc định
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id!)}
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
