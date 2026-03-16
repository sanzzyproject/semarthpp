import { useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { HasilPerhitungan } from "@/types";

interface Props {
  hasil: HasilPerhitungan;
  batchPerMonth: number;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const ProfitProjection = ({ hasil, batchPerMonth }: Props) => {
  const [targetLaba, setTargetLaba] = useState(0);

  const omzetBulan = hasil.totalPotensiPenjualan * batchPerMonth;
  const biayaBulan = hasil.totalBiayaProduksi * batchPerMonth;
  const labaBulan = omzetBulan - biayaBulan;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Proyeksi Laba Bulanan</h2>
          <p className="text-[11px] text-muted-foreground">Estimasi pendapatan per bulan</p>
        </div>
      </div>

      <div className="card-premium p-5 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-3 w-3 text-primary" />
            Target Laba Bersih / Bulan
          </Label>
          <Input
            type="number"
            placeholder="Masukkan target laba"
            value={targetLaba || ""}
            onChange={(e) => setTargetLaba(Number(e.target.value))}
            className="input-modern h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-lg bg-primary/8 flex items-center justify-center">
                <BarChart3 className="h-3 w-3 text-primary" />
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Omzet / Bulan</p>
            </div>
            <p className="text-sm font-extrabold text-foreground tabular-nums">{formatRp(omzetBulan)}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-lg bg-destructive/8 flex items-center justify-center">
                <Wallet className="h-3 w-3 text-destructive" />
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Biaya / Bulan</p>
            </div>
            <p className="text-sm font-extrabold text-foreground tabular-nums">{formatRp(biayaBulan)}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2">
          <div className={cn(
            "rounded-2xl p-5 border-2",
            labaBulan >= 0 ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={cn("h-4 w-4", labaBulan >= 0 ? "text-success" : "text-destructive")} />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Proyeksi Laba Bersih / Bulan</p>
            </div>
            <p className={cn("text-2xl font-extrabold tabular-nums", labaBulan >= 0 ? "text-success" : "text-destructive")}>
              {formatRp(labaBulan)}
            </p>
            {targetLaba > 0 && (
              <div className={cn(
                "mt-3 rounded-xl px-3 py-2 text-xs font-medium",
                labaBulan >= targetLaba ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              )}>
                {labaBulan >= targetLaba
                  ? `✅ Target tercapai! Surplus ${formatRp(labaBulan - targetLaba)}`
                  : `⚠️ Kurang ${formatRp(targetLaba - labaBulan)} dari target`}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfitProjection;
