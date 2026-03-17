import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator,
  Save,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
  Download,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import BusinessModeSelector from "@/components/BusinessModeSelector";
import InputBahanBaku from "@/components/InputBahanBaku";
import InputBiaya from "@/components/InputBiaya";
import InputProduk from "@/components/InputProduk";
import HPPResult from "@/components/HPPResult";
import ProfitProjection from "@/components/ProfitProjection";
import ChartProfit from "@/components/ChartProfit";
import BundlingCalculator from "@/components/BundlingCalculator";
import HistoryPanel from "@/components/HistoryPanel";
import RecommendedPrice from "@/components/RecommendedPrice";
import ProfitTargetCalculator from "@/components/ProfitTargetCalculator";
import SalesProjectionCalculator from "@/components/SalesProjectionCalculator";
import ProductImageUpload from "@/components/ProductImageUpload";
import { hitungHPP } from "@/lib/calculations";
import { saveCalculation } from "@/lib/db";
import { exportToExcel } from "@/lib/export";
import type {
  BusinessMode,
  BahanBaku,
  BiayaPengolahan,
  ProdukTurunan,
  HasilPerhitungan,
  CalculationRecord,
} from "@/types";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const Index = () => {
  const navigate = useNavigate();
  const [businessMode, setBusinessMode] = useState<BusinessMode | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [batchPerMonth, setBatchPerMonth] = useState(1);
  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([]);
  const [biayaPengolahan, setBiayaPengolahan] = useState<BiayaPengolahan[]>([]);
  const [produkTurunan, setProdukTurunan] = useState<ProdukTurunan[]>([]);
  const [hasil, setHasil] = useState<HasilPerhitungan | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleHitung = () => {
    if (!businessMode) {
      toast({ title: "Pilih mode bisnis terlebih dahulu", variant: "destructive" });
      return;
    }
    if (bahanBaku.length === 0) {
      toast({ title: "Tambahkan minimal 1 bahan baku", variant: "destructive" });
      return;
    }
    if (produkTurunan.length === 0) {
      toast({ title: "Tambahkan minimal 1 produk turunan", variant: "destructive" });
      return;
    }
    const result = hitungHPP(bahanBaku, biayaPengolahan, produkTurunan, batchPerMonth);
    setHasil(result);
    toast({ title: "Perhitungan HPP berhasil!" });
  };

  const handleSave = async () => {
    if (!hasil) return;
    await saveCalculation({
      businessName,
      businessMode: businessMode || "",
      batchPerMonth,
      bahanBaku,
      biayaPengolahan,
      produkTurunan,
      hasilPerhitungan: hasil,
      bundling: [],
      createdAt: Date.now(),
    });
    setRefreshKey((k) => k + 1);
    toast({ title: "Perhitungan berhasil disimpan!" });
  };

  const handleExport = () => {
    if (!hasil) return;
    exportToExcel({
      businessName,
      businessMode: businessMode || "",
      batchPerMonth,
      bahanBaku,
      biayaPengolahan,
      produkTurunan,
      hasilPerhitungan: hasil,
      bundling: [],
      createdAt: Date.now(),
    });
    toast({ title: "File Excel berhasil diunduh!" });
  };

  const handleLoadRecord = (record: CalculationRecord) => {
    setBusinessName(record.businessName);
    setBusinessMode((record.businessMode as BusinessMode) || null);
    setBatchPerMonth(record.batchPerMonth);
    setBahanBaku(record.bahanBaku);
    setBiayaPengolahan(record.biayaPengolahan);
    setProdukTurunan(record.produkTurunan);
    setHasil(record.hasilPerhitungan);
    toast({ title: "Riwayat perhitungan dimuat!" });
  };

  return (
    <div className="min-h-screen noise-bg">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 glass-strong"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-9 w-9 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Calculator className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-tight">SemartHPP</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Calculator</span>
            </div>
          </div>
          <HistoryPanel onLoad={handleLoadRecord} refreshKey={refreshKey} />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 pb-24 max-w-2xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <div className="badge-label mb-4">
              <Sparkles className="h-3 w-3" />
              Kalkulator HPP
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Hitung HPP<br />
              <span className="gradient-text">Bisnis Anda</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">
              Isi data di bawah untuk menghitung Harga Pokok Produksi secara otomatis dan akurat.
            </p>
          </motion.div>
        </motion.div>

        {/* Business Mode */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <BusinessModeSelector selected={businessMode} onSelect={setBusinessMode} />
        </motion.div>

        {/* Form Inputs */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="card-premium p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
                <Calculator className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Data Produksi</h2>
                <p className="text-[11px] text-muted-foreground">Informasi dasar bisnis Anda</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Bisnis / Produk Utama</Label>
              <Input
                placeholder="Contoh: Usaha Kelapa Terpadu"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input-modern h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Batch Produksi / Bulan</Label>
              <Input
                type="number"
                placeholder="Contoh: 30"
                value={batchPerMonth || ""}
                onChange={(e) => setBatchPerMonth(Number(e.target.value))}
                min={1}
                className="input-modern h-11"
              />
            </div>
          </div>
        </motion.div>

        {/* Input Sections */}
        <InputBahanBaku items={bahanBaku} onChange={setBahanBaku} />
        <InputBiaya items={biayaPengolahan} onChange={setBiayaPengolahan} />
        <InputProduk items={produkTurunan} onChange={setProdukTurunan} />

        {/* Hitung Button */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <button
            onClick={handleHitung}
            className="btn-primary-xl w-full h-14 text-base gap-2.5 flex items-center justify-center"
          >
            <Calculator className="h-5 w-5" />
            Hitung HPP Sekarang
          </button>
        </motion.div>

        {/* Results */}
        {hasil && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            <HPPResult
              hasil={hasil}
              bahanBaku={bahanBaku}
              biayaPengolahan={biayaPengolahan}
              batchPerMonth={batchPerMonth}
            />

            <RecommendedPrice hppPerProduk={hasil.hppPerProduk} />

            <ProfitTargetCalculator
              hppPerProduk={hasil.hppPerProduk}
              produkTurunan={produkTurunan}
              batchPerMonth={batchPerMonth}
            />

            <ProfitProjection hasil={hasil} batchPerMonth={batchPerMonth} />

            <ChartProfit hasil={hasil} batchPerMonth={batchPerMonth} />

            {produkTurunan.length >= 2 && (
              <BundlingCalculator
                produkTurunan={produkTurunan}
                hppPerProduk={hasil.hppPerProduk}
              />
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-white border border-border/60 text-sm font-semibold text-foreground shadow-button hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 active:scale-[0.98]"
              >
                <BookmarkPlus className="h-4 w-4 text-primary" />
                Simpan
              </button>
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-white border border-border/60 text-sm font-semibold text-foreground shadow-button hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 active:scale-[0.98]"
              >
                <Download className="h-4 w-4 text-primary" />
                Export Excel
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center pt-10 pb-4">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-5 w-5 rounded-lg gradient-primary flex items-center justify-center">
              <Calculator className="h-3 w-3 text-white" />
            </div>
            Dibuat oleh <span className="font-bold text-foreground">SANN404 FORUM</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
