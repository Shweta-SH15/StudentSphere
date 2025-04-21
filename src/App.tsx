
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import FriendsPage from "@/pages/FriendsPage";
import AccommodationPage from "@/pages/AccommodationPage";
import RestaurantsPage from "@/pages/RestaurantsPage";
import RoommatesPage from "@/pages/RoommatesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              } 
            />
            <Route 
              path="/friends" 
              element={
                <MainLayout>
                  <FriendsPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/accommodation" 
              element={
                <MainLayout>
                  <AccommodationPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/restaurants" 
              element={
                <MainLayout>
                  <RestaurantsPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/roommates" 
              element={
                <MainLayout>
                  <RoommatesPage />
                </MainLayout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
