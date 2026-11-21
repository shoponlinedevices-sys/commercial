'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { cartService } from '@/services/cart.service';
import { Cart, CartLine } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { formatVnd } from '@/lib/formatters';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const { refreshNotificationCount } = useNotification();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const orderingInProgress = useRef(false);
  const cartLines = cart?.cartLines ?? [];
  const itemCount = cartLines.reduce((count, line) => count + line.quantity, 0);

  const loadCart = useCallback(async () => {
    if (!user) {
      setCart({ cartLines: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[Cart Page] Loading cart for user:', user.id);
      const lines = await cartService.getCartLinesByUserId(user.id);
      console.log('[Cart Page] Cart lines received:', JSON.stringify(lines));
      console.log('[Cart Page] Cart lines count:', lines?.length);
      setCart({ cartLines: lines });
    } catch (error) {
      console.error('[Cart Page] Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const removeItem = async (cartLineId: number) => {
    try {
      await cartService.removeCartLine(cartLineId);
      await loadCart();
      await refreshCartCount();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Không thể xóa sản phẩm');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartService.clearCartByUserId(user.id);
      await loadCart();
      await refreshCartCount();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Không thể xóa giỏ hàng');
    }
  };

  const updateQuantity = async (cartLine: CartLine, newQuantity: number) => {
    if (newQuantity < 1 || !cartLine.id) return;
    try {
      await cartService.updateCartLineQuantity(cartLine.id, newQuantity);
      setCart((currentCart) => currentCart
        ? {
            ...currentCart,
            cartLines: (currentCart.cartLines ?? []).map((line) =>
              line.id === cartLine.id ? { ...line, quantity: newQuantity } : line,
            ),
          }
        : currentCart);
      await refreshCartCount();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Không thể cập nhật số lượng sản phẩm');
    }
  };

  const calculateTotal = () =>
    cartLines.reduce(
      (total, line) => total + Number(line.unitPrice) * line.quantity,
      0,
    );

  const checkout = async () => {
    if (orderingInProgress.current) return;

    if (cartLines.length === 0) {
      alert('Giỏ hàng đang trống');
      return;
    }

    orderingInProgress.current = true;
    setIsOrdering(true);

    try {
      const { orderService } = await import('@/services/order.service');
      await orderService.createOrder({
        userId: user!.id.toString(),
        totalAmount: calculateTotal(),
        orderLines: cartLines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice.toString(),
        })),
        customerEmail: user!.email,
        customerName: user!.username,
      });

      await refreshNotificationCount();
      alert('Đã tạo đơn hàng thành công');
      await clearCart();
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Không thể tạo đơn hàng');
    } finally {
      orderingInProgress.current = false;
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-8 h-4 w-36 animate-pulse rounded bg-slate-200" />
          <div className="mb-8 space-y-3">
            <div className="h-9 w-56 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-200" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              {[0, 1].map((item) => (
                <div key={item} className="flex animate-pulse gap-4 border-b border-slate-100 pb-5 last:border-0">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-slate-200" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-5 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-1/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <nav aria-label="Điều hướng" className="mb-7 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition-colors hover:text-primary">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-900">Giỏ hàng</span>
        </nav>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Mua sắm của bạn</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Giỏ hàng</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Kiểm tra sản phẩm trước khi hoàn tất đơn hàng.
            </p>
          </div>
          {cartLines.length > 0 && (
            <span className="inline-flex w-fit items-center rounded-full bg-violet-50 px-3.5 py-2 text-sm font-semibold text-violet-700">
              {itemCount} sản phẩm
            </span>
          )}
        </div>

        {cartLines.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-primary">
              <ShoppingBag className="h-9 w-9" strokeWidth={1.7} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">Giỏ hàng của bạn đang trống</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Khám phá các sản phẩm thiết bị và dụng cụ phù hợp với nhu cầu của bạn.
            </p>
            <Button onClick={() => router.push('/products')} className="mt-7 gap-2 rounded-xl px-6">
              Tiếp tục mua sắm
              <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
            <section aria-labelledby="cart-items-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                <div>
                  <h2 id="cart-items-title" className="font-semibold text-slate-900">Sản phẩm đã chọn</h2>
                  <p className="mt-1 text-sm text-slate-500">{cartLines.length} mặt hàng</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 px-5 sm:px-7">
                {cartLines.map((line) => (
                  <article key={line.id ?? line.productId} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-5 sm:py-6">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:h-28 sm:w-28">
                        {line.image ? (
                          <Image
                            src={line.image}
                            alt={line.name || 'Sản phẩm'}
                            fill
                            sizes="(max-width: 640px) 96px, 112px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                            <ShoppingBag className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold leading-6 text-slate-900">
                          {line.name || 'Sản phẩm'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{formatVnd(line.unitPrice)} / sản phẩm</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-5">
                      <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Giảm số lượng ${line.name || 'sản phẩm'}`}
                          disabled={line.quantity <= 1}
                          onClick={() => updateQuantity(line, line.quantity - 1)}
                          className="h-9 w-9 rounded-r-none text-slate-600 hover:text-primary"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-9 text-center text-sm font-semibold tabular-nums text-slate-900">
                          {line.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Tăng số lượng ${line.name || 'sản phẩm'}`}
                          onClick={() => updateQuantity(line, line.quantity + 1)}
                          className="h-9 w-9 rounded-l-none text-slate-600 hover:text-primary"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="min-w-[112px] text-right text-sm font-bold tabular-nums text-slate-900 sm:text-base">
                        {formatVnd(Number(line.unitPrice) * line.quantity)}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Xóa ${line.name || 'sản phẩm'} khỏi giỏ hàng`}
                        disabled={!line.id}
                        onClick={() => line.id && removeItem(line.id)}
                        className="h-10 w-10 shrink-0 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-slate-100 px-5 py-4 sm:px-7">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-violet-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </section>

            <aside aria-labelledby="order-summary-title" className="lg:sticky lg:top-24">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 id="order-summary-title" className="text-lg font-bold text-slate-900">Tóm tắt đơn hàng</h2>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between gap-4 text-slate-600">
                    <span>Tạm tính ({itemCount} sản phẩm)</span>
                    <span className="font-medium tabular-nums text-slate-900">{formatVnd(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-right text-slate-500">Xác nhận sau</span>
                  </div>
                </div>
                <div className="my-5 border-t border-dashed border-slate-200" />
                <div className="flex items-end justify-between gap-4">
                  <span className="font-semibold text-slate-900">Tổng cộng</span>
                  <span className="text-xl font-bold tabular-nums text-primary">{formatVnd(calculateTotal())}</span>
                </div>
                <p className="mt-2 text-right text-xs text-slate-500">Chưa bao gồm phí vận chuyển</p>

                <Button
                  onClick={checkout}
                  disabled={isOrdering}
                  className="mt-6 h-12 w-full gap-2 rounded-xl text-base font-semibold shadow-sm shadow-primary/20"
                >
                  {isOrdering ? 'Đang đặt hàng...' : 'Tiến hành đặt hàng'}
                  {!isOrdering && <ArrowRight className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="mt-3 h-11 w-full rounded-xl border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Xóa giỏ hàng
                </Button>
              </section>
              <p className="mt-4 px-2 text-center text-xs leading-5 text-slate-500">
                Thông tin chi tiết đơn hàng sẽ được xác nhận sau khi đặt hàng.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
