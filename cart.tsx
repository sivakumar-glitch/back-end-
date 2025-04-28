import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import CartItem from "@/components/cart/cart-item";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cart() {
  // Define the proper types for cart item and cart
  interface CartProduct {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    inventory: number;
    description: string;
    category: string;
  }
  
  interface CartItem {
    id: number;
    product: CartProduct;
    quantity: number;
  }
  
  interface Cart {
    id: number;
    items: CartItem[];
    total: number;
  }
  
  // Get cart data with proper typing
  const { cart, isLoading } = useCart() as { 
    cart: Cart | null; 
    isLoading: boolean 
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="py-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Skeleton className="w-full sm:w-24 h-24" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <div className="flex justify-between pt-2">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                    {i < 2 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Separator />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
          <ShoppingCart className="h-8 w-8 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-600 mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link href="/products">
          <span>
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </span>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({cart.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.items.map((item, index) => (
                <div key={item.id}>
                  <CartItem
                    id={item.id}
                    product={item.product}
                    quantity={item.quantity}
                  />
                  {index < cart.items.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Order summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                
                <Link href="/checkout">
                  <span className="block w-full mt-4">
                    <Button className="w-full">
                      Proceed to Checkout
                    </Button>
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
