import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import DocsPage from "./pages/DocsPage";
import NotFound from "./pages/NotFound";
import WelcomePopup from "./components/WelcomePopup";
import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import KeuanganPage from "./pages/KeuanganPage";
import ProdukPage from "./pages/ProdukPage";
import LaporanPage from "./pages/LaporanPage";
import InsightPage from "./pages/InsightPage";
import SharePage from "./pages/SharePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WelcomePopup />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<Index />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="keuangan" element={<KeuanganPage />} />
            <Route path="produk" element={<ProdukPage />} />
            <Route path="laporan" element={<LaporanPage />} />
            <Route path="insight" element={<InsightPage />} />
            <Route path="share" element={<SharePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
