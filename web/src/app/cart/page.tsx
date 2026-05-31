'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cartService } from '@/services/cart.service';
import { Cart, CartLine } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      console.log('[Cart Page] Loading cart for user:', user.id);
      const data = await cartService.getCart(user.id);
      console.log('[Cart Page] Cart data received:', JSON.stringify(data));
      console.log('[Cart Page] Cart lines:', data?.cartLines);
      console.log('[Cart Page] Cart lines count:', data?.cartLines?.length);
      setCart(data);
    } catch (error) {
      console.error('[Cart Page] Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartLineId: number) => {
    try {
      await cartService.removeCartLine(cartLineId);
      await loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartService.clearCartByUserId(user.id);
      await loadCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const updateQuantity = async (cartLine: CartLine, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartService.addToCart({
        userId: user!.id,
        productId: cartLine.productId,
        quantity: newQuantity,
      });
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const calculateTotal = () => {
    if (!cart?.cartLines) return 0;
    return cart.cartLines.reduce(
      (total, line) => total + (parseFloat(String(line.unitPrice)) * line.quantity),
      0
    );
  };

  const checkout = async () => {
    if (!cart?.cartLines || cart.cartLines.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const { orderService } = await import('@/services/order.service');
      const order = await orderService.createOrder({
        userId: user!.id.toString(),
        totalAmount: calculateTotal(),
        orderLines: cart.cartLines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice.toString(),
        })),
      });

      alert('Order created successfully!');
      await clearCart();
      window.location.href = `/orders`;
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2" />
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!cart?.cartLines || cart.cartLines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={() => (window.location.href = '/products')}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.cartLines.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="relative h-20 w-20 bg-muted rounded overflow-hidden">
                      {line.image ? (
                        <Image
                          src={line.image}
                          alt={line.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{line.name || 'Product'}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${parseFloat(String(line.unitPrice)).toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(line, line.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{line.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(line, line.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(parseFloat(String(line.unitPrice)) * line.quantity).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(line.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {cart?.cartLines && cart.cartLines.length > 0 && (
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" onClick={clearCart} className="flex-1">
                  Clear Cart
                </Button>
                <Button onClick={checkout} className="flex-1">
                  Checkout
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
