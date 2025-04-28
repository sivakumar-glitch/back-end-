import { useQuery } from "@tanstack/react-query";

interface Product {
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
  quantity: number;
  product: Product;
}

interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export function useCart() {
  const { data: cart, isLoading, error } = useQuery<Cart>({
    queryKey: ["/api/cart"],
    // If there's an error, just return null - it's okay if user isn't logged in
    onError: () => null,
  });

  // Calculate total items in the cart
  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return {
    cart,
    isLoading,
    error,
    totalItems,
  };
}
