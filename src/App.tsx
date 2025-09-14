import { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CinematicIntro from "./components/CinematicIntro";

// Lazy load pages for better code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleIntroComplete = () => {
    console.log('Intro completed, starting cross-fade transition');
    setIsTransitioning(true);
    // Wait for cross-fade animation to complete before hiding intro
    setTimeout(() => {
      setShowIntro(false);
      setIsTransitioning(false);
    }, 1000); // Match the cross-fade duration
  };

  console.log('App render - showIntro:', showIntro, 'isTransitioning:', isTransitioning);

  return (
    <div className="relative">
      {/* Main content - always rendered during transition for cross-fade */}
      {(isTransitioning || !showIntro) && (
        <div className={`transition-opacity duration-1000 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/admin" element={<Admin />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </div>
      )}
      
      {/* Cinematic Intro - overlaid on top during transition */}
      {showIntro && (
        <CinematicIntro onComplete={handleIntroComplete} isTransitioning={isTransitioning} />
      )}
    </div>
  );
};

export default App;
