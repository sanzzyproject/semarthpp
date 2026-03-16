import { useState } from "react";
import { motion } from "framer-motion";
import { Target, ShoppingCart, Calculator, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
        Kalkulator Target Profit
      </h2>
      <p className="text-xs text-muted-foreground -mt-2">
        Hitung berapa unit yang harus dijual untuk mencapai target keuntungan bulanan Anda.
      </p>

      <div className="glass rounded-xl p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5 text-primary" />
            Pilih Produk
          </Label>
          <Select value={selectedProductIndex} onValueChange={setSelectedProductIndex}>
            <SelectTrigger className="glass">
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
          <div className="rounded-xl bg-primary/5 p-3 border border-primary/10">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">HPP / Unit</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{formatRp(Math.round(hppPerUnit))}</p>
          </div>
          <div className="rounded-xl bg-success/5 p-3 border border-success/10">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Profit / Unit</p>
            <p className={cn("text-sm font-bold mt-0.5", profitPerUnit >= 0 ? "text-success" : "text-destructive")}>
              {formatRp(Math.round(profitPerUnit))}
            </p>
          </div>
          <div className="rounded-xl bg-accent/5 p-3 border border-accent/10">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Harga Jual</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{formatRp(hargaJual)}</p>
          </div>
          <div className="rounded-xl bg-warning/5 p-3 border border-warning/10">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Margin</p>
            <p className={cn("text-sm font-bold mt-0.5", marginPercent >= 0 ? "text-warning" : "text-destructive")}>
              {marginPercent.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" />
            Target Profit Bulanan
          </Label>
          <Input
            type="number"
            placeholder="Contoh: 1000000"
            value={targetProfit || ""}
            onChange={(e) => setTargetProfit(Number(e.target.value))}
            className="glass"
          />
        </div>
      </div>

      {targetProfit > 0 && profitPerUnit > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <Card className="glass rounded-xl border-2 border-primary/20 shadow-card overflow-hidden">
            <CardContent className="p-0">
              <div className="gradient-primary p-4">
                <div className="flex items-center gap-2 text-white">
                  <Calculator className="h-5 w-5" />
                  <p className="text-sm font-bold">Hasil Kalkulasi Break-Even</p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Target Profit</span>
                  <span className="text-sm font-bold text-foreground">{formatRp(targetProfit)}</span>
                </div>

                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="rounded-xl bg-primary/5 border-2 border-primary/20 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Minimum Penjualan / Bulan</p>
                  <p className="text-3xl font-extrabold gradient-text">{minUnitsPerMonth.toLocaleString("id-ID")}</p>
                  <p className="text-sm font-medium text-foreground">{produk.satuan} / bulan</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/50 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Per Hari</p>
                    <p className="text-lg font-bold text-foreground">{minUnitsPerDay.toLocaleString("id-ID")}</p>
                    <p className="text-[10px] text-muted-foreground">{produk.satuan}</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Omzet Dibutuhkan</p>
                    <p className="text-lg font-bold text-foreground">{formatRp(totalRevenueNeeded)}</p>
                    <p className="text-[10px] text-muted-foreground">/ bulan</p>
                  </div>
                </div>

                {profitPerUnit <= 0 && (
                  <div className="rounded-xl bg-destructive/10 p-3 text-center">
                    <p className="text-sm font-semibold text-destructive">
                      ⚠️ Harga jual lebih rendah dari HPP. Tidak mungkin mencapai target.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ProfitTargetCalculator;
