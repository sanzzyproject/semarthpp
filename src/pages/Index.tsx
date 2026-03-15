import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator,
  Save,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
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

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
    <div className="min-h-screen bg-background noise-bg">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-strong"
      >
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-8 w-8 mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">SemartHPP</span>
          </div>
          <HistoryPanel onLoad={handleLoadRecord} refreshKey={refreshKey} />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container py-6 space-y-6 pb-24 max-w-2xl">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Kalkulator HPP</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Hitung HPP Bisnis Anda
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Isi data di bawah untuk menghitung HPP secara otomatis.
          </p>
        </motion.div>

        {/* Business Mode */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <BusinessModeSelector selected={businessMode} onSelect={setBusinessMode} />
        </motion.div>

        {/* Form Inputs */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          <div className="glass rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
              Data Produksi
            </h2>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nama Bisnis / Produk Utama</Label>
              <Input
                placeholder="Contoh: Usaha Kelapa Terpadu"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Jumlah Batch Produksi per Bulan</Label>
              <Input
                type="number"
                placeholder="Contoh: 30"
                value={batchPerMonth || ""}
                onChange={(e) => setBatchPerMonth(Number(e.target.value))}
                min={1}
                className="glass"
              />
            </div>
          </div>
        </motion.div>

        {/* Input Sections */}
        <InputBahanBaku items={bahanBaku} onChange={setBahanBaku} />
        <InputBiaya items={biayaPengolahan} onChange={setBiayaPengolahan} />
        <InputProduk items={produkTurunan} onChange={setProdukTurunan} />

        {/* Hitung Button */}
        <Button
          onClick={handleHitung}
          className="w-full h-13 text-base font-bold gap-2 gradient-primary text-white border-0 shadow-glow hover:opacity-90 transition-all rounded-xl"
          size="lg"
        >
          <Calculator className="h-5 w-5" />
          Hitung HPP Sekarang
        </Button>

        {/* Results */}
        {hasil && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <HPPResult
              hasil={hasil}
              bahanBaku={bahanBaku}
              biayaPengolahan={biayaPengolahan}
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
              <Button onClick={handleSave} variant="outline" className="gap-2 glass rounded-xl h-11">
                <Save className="h-4 w-4" />
                Simpan
              </Button>
              <Button onClick={handleExport} variant="outline" className="gap-2 glass rounded-xl h-11">
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-muted-foreground">
            Dibuat oleh <span className="font-semibold text-foreground">SANN404 FORUM</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
