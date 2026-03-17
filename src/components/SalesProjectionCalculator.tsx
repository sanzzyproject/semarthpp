import { useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { HPPPerProduk } from "@/types";

interface Props {
  hppPerProduk: HPPPerProduk[];
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const SalesProjectionCalculator = ({ hppPerProduk }: Props) => {
  const [targetLaba, setTargetLaba] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  // Use average HPP if available
  const avgHpp = hppPerProduk.length > 0
    ? hppPerProduk.reduce((sum, p) => sum + p.hppPerUnit, 0) / hppPerProduk.length
    : 0;

  const profitPerUnit = hargaJual - avgHpp;
  const targetUnitBulanan = profitPerUnit > 0 && targetLaba > 0
    ? Math.ceil(targetLaba / profitPerUnit)
    : 0;
  const targetHarian = targetUnitBulanan > 0 ? (targetUnitBulanan / 30) : 0;
  const omzetBulanan = targetUnitBulanan * hargaJual;

  const showResults = targetLaba > 0 && hargaJual > 0 && profitPerUnit > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="card-premium w-full p-4 flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-foreground">Target & Proyeksi Penjualan</h2>
              <p className="text-[11px] text-muted-foreground">Hitung target penjualan untuk capai laba</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all group-data-[state=open]:rotate-180 duration-300" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="card-premium mt-2 p-5 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Target Laba Bersih / Bulan
            </Label>
            <Input
              type="number"
              placeholder="Contoh: 3000000"
              value={targetLaba || ""}
              onChange={(e) => setTargetLaba(Number(e.target.value))}
              className="input-modern h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Harga Jual Pilihan (Rp)
            </Label>
            <Input
              type="number"
              placeholder="Contoh: 14000"
              value={hargaJual || ""}
              onChange={(e) => setHargaJual(Number(e.target.value))}
              className="input-modern h-11"
            />
          </div>

          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Target Jual / Hari */}
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Target Jual / Hari</p>
                <p className="text-2xl font-extrabold text-foreground tabular-nums">
                  {targetHarian.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} pcs
                </p>
              </div>

              {/* Total Jual / Bulan */}
              <div className="rounded-2xl bg-violet-50 border border-violet-100 p-4 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Jual / Bulan</p>
                <p className="text-2xl font-extrabold text-foreground tabular-nums">
                  {targetUnitBulanan.toLocaleString("id-ID")} pcs
                </p>
              </div>

              {/* Potensi Omzet / Bulan */}
              <div className="rounded-2xl bg-green-50 border border-green-100 p-4 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Potensi Omzet / Bulan</p>
                <p className="text-2xl font-extrabold text-green-600 tabular-nums">
                  {formatRp(omzetBulanan)}
                </p>
              </div>

              {/* Total Biaya Produksi */}
              <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Biaya Tetap / Bulan</p>
                <p className="text-2xl font-extrabold text-yellow-600 tabular-nums">
                  {formatRp(targetUnitBulanan * avgHpp)}
                </p>
              </div>

              {/* Proyeksi Laba Bersih */}
              <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-4 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Proyeksi Laba Bersih / Bulan</p>
                <p className="text-2xl font-extrabold text-cyan-600 tabular-nums">
                  {formatRp(targetUnitBulanan * profitPerUnit)}
                </p>
              </div>
            </motion.div>
          )}

          {hargaJual > 0 && hargaJual <= avgHpp && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-sm font-semibold text-red-600">
                ⚠️ Harga jual lebih rendah dari HPP ({formatRp(Math.round(avgHpp))}). Naikkan harga jual.
              </p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SalesProjectionCalculator;
