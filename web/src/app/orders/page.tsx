'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/order.service';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { formatDateVi, formatVnd } from '@/lib/formatters';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await orderService.getUserOrders(user.id.toString());
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1">
          <Header />
          <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Đang tải đơn hàng...</p>
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
        <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const lineTotal = (order.orderLines || []).reduce(
                  (total: number, line: any) => total + Number(line.unitPrice || 0) * Number(line.quantity || 0),
                  0,
                );
                const displayedTotal = order.totalAmount || lineTotal;

                return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>Đơn hàng #{order.id}</CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tổng tiền:</span>
                        <span className="font-semibold">{formatVnd(displayedTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày đặt:</span>
                        <span>{formatDateVi(order.createdAt)}</span>
                      </div>
                      {order.shippingAddress && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                          <span className="text-right max-w-xs">{order.shippingAddress}</span>
                        </div>
                      )}
                      {order.orderLines && order.orderLines.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="font-semibold mb-2">Sản phẩm:</p>
                          <ul className="space-y-1">
                            {order.orderLines.map((line: any, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {line.quantity}x Sản phẩm #{line.productId} - {formatVnd(line.unitPrice)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
