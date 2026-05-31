'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/product.service';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProduct(Number(params.id));
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    try {
      const { cartService } = await import('@/services/cart.service');
      await cartService.addToCart({
        userId: user!.id,
        productId: product.id,
        quantity: 1,
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Product not found</p>
            <Button onClick={() => router.push('/products')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/products')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <Card>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="p-6">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-3xl">{product.name}</CardTitle>
                  {product.badge && (
                    <Badge className="ml-2">{product.badge}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>

                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {product.sku && (
                  <div>
                    <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
                  </div>
                )}

                {product.unit && (
                  <div>
                    <span className="text-sm text-muted-foreground">Unit: {product.unit}</span>
                  </div>
                )}

                {product.moq && (
                  <div>
                    <span className="text-sm text-muted-foreground">MOQ: {product.moq}</span>
                  </div>
                )}

                <Button size="lg" className="w-full" onClick={addToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
