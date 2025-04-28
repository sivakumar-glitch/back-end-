import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  inventory: number;
}

interface CartItemProps {
  id: number;
  product: Product;
  quantity: number;
}

export default function CartItem({ id, product, quantity }: CartItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const updateQuantityMutation = useMutation({
    mutationFn: async (newQuantity: number) => {
      setIsUpdating(true);
      return apiRequest("PUT", `/api/cart/items/${id}`, {
        quantity: newQuantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setIsUpdating(false);
    },
    onError: () => {
      setIsUpdating(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity",
      });
    },
  });
  
  const removeItemMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/cart/items/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item",
      });
    },
  });
  
  const incrementQuantity = () => {
    if (quantity < product.inventory) {
      updateQuantityMutation.mutate(quantity + 1);
    } else {
      toast({
        variant: "destructive",
        title: "Cannot add more",
        description: "No more items available in stock",
      });
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      updateQuantityMutation.mutate(quantity - 1);
    } else {
      removeItemMutation.mutate();
    }
  };
  
  return (
    <div className="py-6 flex flex-col sm:flex-row">
      <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 border border-gray-200 rounded-md overflow-hidden">
        {product.imageUrl ? (
          <div 
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="sm:ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{product.name}</h3>
            <p className="ml-4">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-end justify-between text-sm mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 pointer-events-auto"
              onClick={decrementQuantity}
              disabled={isUpdating || removeItemMutation.isPending}
            >
              {quantity === 1 ? <Trash className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </Button>
            
            <span className="px-2 py-1 bg-gray-100 rounded font-medium min-w-[32px] text-center">
              {isUpdating ? "..." : quantity}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 pointer-events-auto"
              onClick={incrementQuantity}
              disabled={isUpdating || quantity >= product.inventory}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-800 pointer-events-auto"
              onClick={() => removeItemMutation.mutate()}
              disabled={removeItemMutation.isPending}
            >
              {removeItemMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
