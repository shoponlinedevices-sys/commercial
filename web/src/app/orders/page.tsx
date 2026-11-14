'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListChecks,
  MapPin,
  Package,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { orderService } from '@/services/order.service';
import { Order } from '@/types';
import { formatDateVi, formatVnd } from '@/lib/formatters';
import Header from '@/components/Header';

type OrderStatus = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';

const statusFilters: { value: OrderStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Đang chờ xử lý';
    case 'completed':
      return 'Đã hoàn tất';
    case 'cancelled':
      return 'Đã hủy';
    case 'processing':
      return 'Đang xử lý';
    default:
      return status;
  }
};

const getStatusStyle = (status: string, darkMode: boolean) => {
  const styles: Record<string, string> = {
    pending: darkMode
      ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
      : 'border-amber-200 bg-amber-50 text-amber-700',
    processing: darkMode
      ? 'border-blue-400/20 bg-blue-400/10 text-blue-300'
      : 'border-blue-200 bg-blue-50 text-blue-700',
    completed: darkMode
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700',
    cancelled: darkMode
      ? 'border-rose-400/20 bg-rose-400/10 text-rose-300'
      : 'border-rose-200 bg-rose-50 text-rose-700',
  };

  return styles[status.toLowerCase()] || (darkMode
    ? 'border-slate-400/20 bg-slate-400/10 text-slate-300'
    : 'border-slate-200 bg-slate-50 text-slate-600');
};

const getOrderTotal = (order: Order) => {
  const lineTotal = (order.orderLines || []).reduce(
    (total: number, line: any) => total + Number(line.unitPrice || 0) * Number(line.quantity || 0),
    0,
  );
  return Number(order.totalAmount) || lineTotal;
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const darkMode = colors.darkMode;

  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await orderService.getUserOrders(user.id.toString());
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void loadOrders();
  }, [authLoading, loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const orderQuery = query.replace(/^#/, '');
    return orders.filter((order) => {
      const matchesStatus = activeStatus === 'all' || order.status.toLowerCase() === activeStatus;
      const matchesSearch = !query
        || (orderQuery !== '' && String(order.id).toLowerCase().includes(orderQuery))
        || (order.shippingAddress || '').toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, orders, searchQuery]);

  const pendingCount = orders.filter((order) => ['pending', 'processing'].includes(order.status.toLowerCase())).length;
  const completedCount = orders.filter((order) => order.status.toLowerCase() === 'completed').length;
  const pageColors = darkMode
    ? {
        background: 'bg-slate-950 text-slate-100',
        muted: 'text-slate-400',
        card: 'border-white/10 bg-slate-900/80 shadow-black/20',
        softCard: 'border-white/10 bg-white/[0.04]',
        input: 'border-white/10 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-violet-400',
        divider: 'border-white/10',
        subtle: 'text-slate-300',
      }
    : {
        background: 'bg-slate-50 text-slate-900',
        muted: 'text-slate-500',
        card: 'border-slate-200/80 bg-white shadow-slate-200/60',
        softCard: 'border-slate-200 bg-slate-50',
        input: 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-400',
        divider: 'border-slate-100',
        subtle: 'text-slate-600',
      };

  if (loading || authLoading) {
    return (
      <div className={`min-h-screen ${pageColors.background}`}>
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Package className="h-7 w-7 animate-pulse" />
            </div>
            <p className={`mt-4 text-sm font-medium ${pageColors.muted}`}>Đang tải đơn hàng của bạn...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageColors.background}`}>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <section className={`relative isolate overflow-hidden rounded-3xl border p-6 shadow-xl sm:p-9 ${
          darkMode
            ? 'border-violet-300/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 shadow-indigo-950/30'
            : 'border-violet-100 bg-gradient-to-br from-violet-100 via-white to-indigo-50 shadow-violet-100/70'
        }`}>
          <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
                darkMode ? 'border-violet-300/20 bg-violet-300/10 text-violet-200' : 'border-violet-200 bg-white/70 text-violet-700'
              }`}>
                <ShoppingBag className="h-3.5 w-3.5" />
                Khu vực mua sắm
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Đơn hàng của tôi</h1>
              <p className={`mt-3 max-w-xl text-sm leading-6 sm:text-base ${pageColors.muted}`}>
                Theo dõi trạng thái và xem lại thông tin các đơn hàng của bạn tại đây.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Tiếp tục mua sắm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {!user ? (
          <section className={`mt-8 rounded-2xl border p-8 text-center shadow-sm sm:p-12 ${pageColors.card}`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Package className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Đăng nhập để xem đơn hàng</h2>
            <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${pageColors.muted}`}>
              Đăng nhập vào tài khoản để theo dõi trạng thái và lịch sử mua hàng của bạn.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Đăng nhập
            </Link>
          </section>
        ) : orders.length === 0 ? (
          <section className={`mt-8 rounded-2xl border p-8 text-center shadow-sm sm:p-12 ${pageColors.card}`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Bạn chưa có đơn hàng nào</h2>
            <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${pageColors.muted}`}>
              Khám phá các sản phẩm phù hợp và đơn hàng đầu tiên của bạn sẽ xuất hiện tại đây.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Khám phá sản phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <>
            <section aria-label="Thống kê đơn hàng" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className={`flex items-center gap-4 rounded-2xl border p-4 shadow-sm ${pageColors.card}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-xs font-medium ${pageColors.muted}`}>Tổng đơn hàng</p>
                  <p className="mt-0.5 text-xl font-bold">{orders.length}</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 rounded-2xl border p-4 shadow-sm ${pageColors.card}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-xs font-medium ${pageColors.muted}`}>Đang xử lý</p>
                  <p className="mt-0.5 text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 rounded-2xl border p-4 shadow-sm ${pageColors.card}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-xs font-medium ${pageColors.muted}`}>Đã hoàn tất</p>
                  <p className="mt-0.5 text-xl font-bold">{completedCount}</p>
                </div>
              </div>
            </section>

            <section className="mt-9">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Lịch sử đơn hàng</h2>
                  <p className={`mt-1 text-sm ${pageColors.muted}`}>
                    {filteredOrders.length} đơn hàng phù hợp
                  </p>
                </div>
                <label className="relative block w-full sm:max-w-xs">
                  <Search className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${pageColors.muted}`} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Tìm mã đơn, địa chỉ..."
                    aria-label="Tìm đơn hàng theo mã hoặc địa chỉ"
                    className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition focus:ring-4 focus:ring-primary/10 ${pageColors.input}`}
                  />
                </label>
              </div>

              <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Lọc đơn hàng theo trạng thái">
                {statusFilters.map((filter) => {
                  const count = filter.value === 'all'
                    ? orders.length
                    : orders.filter((order) => order.status.toLowerCase() === filter.value).length;
                  const isActive = activeStatus === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveStatus(filter.value)}
                      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition ${
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                          : darkMode
                            ? 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-primary'
                      }`}
                    >
                      {filter.label}
                      <span className={`text-xs ${isActive ? 'text-primary-foreground/75' : pageColors.muted}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {filteredOrders.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-8 text-center ${pageColors.softCard}`}>
                  <Search className={`mx-auto h-7 w-7 ${pageColors.muted}`} />
                  <p className="mt-3 font-semibold">Không tìm thấy đơn hàng phù hợp</p>
                  <p className={`mt-1 text-sm ${pageColors.muted}`}>Thử đổi từ khóa hoặc trạng thái lọc.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveStatus('all');
                    }}
                    className="mt-4 text-sm font-semibold text-primary hover:underline"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <article
                      key={order.id}
                      className={`overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                        darkMode ? 'border-white/10 bg-slate-900/80 hover:shadow-black/25' : 'border-slate-200/80 bg-white hover:shadow-slate-200/80'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Package className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-medium ${pageColors.muted}`}>Mã đơn hàng</p>
                            <h3 className="truncate font-bold">#{order.id}</h3>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(order.status, darkMode)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className={`grid gap-3 border-y px-5 py-4 sm:grid-cols-2 sm:px-6 ${pageColors.divider} ${darkMode ? 'bg-white/[0.025]' : 'bg-slate-50/70'}`}>
                        <div className="flex items-start gap-3">
                          <CalendarDays className={`mt-0.5 h-4 w-4 shrink-0 ${pageColors.muted}`} />
                          <div>
                            <p className={`text-xs ${pageColors.muted}`}>Ngày đặt</p>
                            <p className={`mt-1 text-sm font-medium ${pageColors.subtle}`}>{formatDateVi(order.createdAt)}</p>
                          </div>
                        </div>
                        {order.shippingAddress && (
                          <div className="flex items-start gap-3">
                            <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${pageColors.muted}`} />
                            <div className="min-w-0">
                              <p className={`text-xs ${pageColors.muted}`}>Địa chỉ giao hàng</p>
                              <p className={`mt-1 break-words text-sm font-medium ${pageColors.subtle}`}>{order.shippingAddress}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="px-5 py-4 sm:px-6">
                        {order.orderLines && order.orderLines.length > 0 && (
                          <div className="space-y-3">
                            {order.orderLines.map((line: any, index: number) => (
                              <div key={`${order.id}-${line.productId}-${index}`} className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-start gap-3">
                                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${darkMode ? 'bg-white/[0.06] text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                                    <ShoppingBag className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">Sản phẩm #{line.productId}</p>
                                    <p className={`mt-0.5 text-xs ${pageColors.muted}`}>Số lượng: {line.quantity}</p>
                                  </div>
                                </div>
                                <p className={`shrink-0 pt-1 text-sm font-medium ${pageColors.subtle}`}>
                                  {formatVnd(Number(line.unitPrice || 0) * Number(line.quantity || 0))}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${pageColors.divider}`}>
                          <div className={`flex items-center gap-2 text-xs ${pageColors.muted}`}>
                            <ListChecks className="h-4 w-4" />
                            Tóm tắt đơn hàng
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm ${pageColors.muted}`}>Tổng tiền</span>
                            <span className="text-lg font-bold text-primary">{formatVnd(getOrderTotal(order))}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
