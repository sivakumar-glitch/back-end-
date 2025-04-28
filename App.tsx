import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Navbar from "@/components/layout/navbar";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Profile from "@/pages/profile";
import Orders from "@/pages/orders";
import ProductForm from "@/components/product/product-form";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { data: session, isLoading } = useQuery({
    queryKey: ["/api/auth/session"],
  });

  // Show loading if session is still being fetched
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!session?.user) {
    window.location.href = "/login";
    return null;
  }

  return <Component {...rest} />;
};

const AdminRoute = ({ component: Component, ...rest }: any) => {
  const { data: session, isLoading } = useQuery({
    queryKey: ["/api/auth/session"],
  });

  // Show loading if session is still being fetched
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // If user is not an admin, redirect to homepage
  if (!session?.user?.isAdmin) {
    window.location.href = "/";
    return null;
  }

  return <Component {...rest} />;
};

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout">
            {(params) => <ProtectedRoute component={Checkout} />}
          </Route>
          <Route path="/profile">
            {(params) => <ProtectedRoute component={Profile} />}
          </Route>
          <Route path="/orders">
            {(params) => <ProtectedRoute component={Orders} />}
          </Route>
          <Route path="/products/new">
            {(params) => <AdminRoute component={() => <ProductForm mode="create" />} />}
          </Route>
          <Route path="/products/:id/edit">
            {(params) => (
              <AdminRoute 
                component={() => {
                  const { data: product } = useQuery({
                    queryKey: [`/api/products/${params.id}`],
                  });
                  return product ? <ProductForm mode="edit" productToEdit={product} /> : null;
                }}
              />
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2023 ShopEase, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  // Initialize queryClient on mount to avoid hydration issues
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/session"] });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
