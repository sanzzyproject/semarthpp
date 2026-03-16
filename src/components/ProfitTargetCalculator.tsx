import { useState } from "react";
import { motion } from "framer-motion";
import { Target, ShoppingCart, Calculator, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { HPPPerProduk, ProdukTurunan } from "@/types";

interface Props {
  hppPerProduk: HPPPerProduk[];
  produkTurunan: ProdukTurunan[];
  batchPerMonth: number;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const ProfitTargetCalculator = ({ hppPerProduk, produkTurunan, batchPerMonth }: Props) => {
  const [targetProfit, setTargetProfit] = useState(0);
  const [selectedProductIndex, setSelectedProductIndex] = useState("0");

  const idx = parseInt(selectedProductIndex);
  const produk = produkTurunan[idx];
  const hpp = hppPerProduk[idx];

  if (!produk || !hpp) return null;

  const hargaJual = produk.hargaJual;
  const hppPerUnit = hpp.hppPerUnit;
  const profitPerUnit = hargaJual - hppPerUnit;
  const marginPercent = hargaJual > 0 ? ((profitPerUnit / hargaJual) * 100) : 0;

  const minUnitsPerMonth = profitPerUnit > 0 && targetProfit > 0
    ? Math.ceil(targetProfit / profitPerUnit)
    : 0;

  const minUnitsPerDay = minUnitsPerMonth > 0 ? Math.ceil(minUnitsPerMonth / 30) : 0;
  const totalRevenueNeeded = minUnitsPerMonth * hargaJual;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-warning/8 flex items-center justify-center">
          <Target className="h-4 w-4 text-warning" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Kalkulator Target Profit</h2>
          <p className="text-[11px] text-muted-foreground">Hitung minimum unit untuk target keuntungan</p>
        </div>
      </div>

      <div className="card-premium p-5 space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingCart className="h-3 w-3 text-primary" />
            Pilih Produk
          </Label>
          <Select value={selectedProductIndex} onValueChange={setSelectedProductIndex}>
            <SelectTrigger className="input-modern h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {produkTurunan.map((p, i) => (
                <SelectItem key={i} value={String(i)}>{p.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-primary/5 p-3.5 border border-primary/10">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">HPP / Unit</p>
            <p className="text-sm font-extrabold text-foreground mt-1 tabular-nums">{formatRp(Math.round(hppPerUnit))}</p>
          </div>
          <div className="rounded-2xl bg-success/5 p-3.5 border border-success/10">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Profit / Unit</p>
            <p className={cn("text-sm font-extrabold mt-1 tabular-nums", profitPerUnit >= 0 ? "text-success" : "text-destructive")}>
              {formatRp(Math.round(profitPerUnit))}
            </p>
          </div>
          <div className="rounded-2xl bg-accent/5 p-3.5 border border-accent/10">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Harga Jual</p>
            <p className="text-sm font-extrabold text-foreground mt-1 tabular-nums">{formatRp(hargaJual)}</p>
          </div>
          <div className="rounded-2xl bg-warning/5 p-3.5 border border-warning/10">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Margin</p>
            <p className={cn("text-sm font-extrabold mt-1 tabular-nums", marginPercent >= 0 ? "text-warning" : "text-destructive")}>
              {marginPercent.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-3 w-3 text-primary" />
            Target Profit Bulanan
          </Label>
          <Input
            type="number"
            placeholder="Contoh: 1000000"
            value={targetProfit || ""}
            onChange={(e) => setTargetProfit(Number(e.target.value))}
            className="input-modern h-11"
          />
        </div>
      </div>

      {targetProfit > 0 && profitPerUnit > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="card-premium overflow-hidden">
            <div className="gradient-primary p-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="h-8 w-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">Hasil Break-Even</p>
                  <p className="text-[11px] text-white/70">Target: {formatRp(targetProfit)}</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-2xl bg-primary/5 border-2 border-primary/15 p-5 text-center"
              >
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Minimum Penjualan / Bulan</p>
                <p className="text-4xl font-extrabold gradient-text tabular-nums">{minUnitsPerMonth.toLocaleString("id-ID")}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{produk.satuan} / bulan</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                <div className="stat-card text-center">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Per Hari</p>
                  <p className="text-xl font-extrabold text-foreground mt-1 tabular-nums">{minUnitsPerDay.toLocaleString("id-ID")}</p>
                  <p className="text-[10px] text-muted-foreground">{produk.satuan}</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Omzet Needed</p>
                  <p className="text-lg font-extrabold text-foreground mt-1 tabular-nums">{formatRp(totalRevenueNeeded)}</p>
                  <p className="text-[10px] text-muted-foreground">/ bulan</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfitTargetCalculator;
