import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery<{ user: { id: number } | null }>({
    queryKey: ["/api/auth/session"],
  });

  const isAuthenticated = !!session?.user;

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cart/items", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add to cart. Please try again.",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    addToCartMutation.mutate();
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="block h-full">
          <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
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
            
            {product.inventory <= 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Out of Stock</span>
              </div>
            )}
            
            {product.inventory > 0 && product.inventory <= 5 && (
              <Badge className="absolute top-2 right-2 bg-yellow-500">Low Stock</Badge>
            )}
          </div>
          
          <CardContent className="p-4 flex-grow">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-primary font-medium text-lg">${product.price.toFixed(2)}</p>
            <p className="text-gray-500 text-sm line-clamp-2 mt-2">{product.description}</p>
            <div className="mt-2">
              <Badge variant="outline">{product.category}</Badge>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between gap-2">
            <Button
              variant="outline"
              className="w-1/2"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> View
            </Button>
            
            <Button 
              className="w-1/2"
              size="sm"
              disabled={product.inventory <= 0 || addToCartMutation.isPending}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> 
              {addToCartMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
}
