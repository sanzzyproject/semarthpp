import { useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
        Proyeksi Laba Bulanan
      </h2>

      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Target Laba Bersih / Bulan</Label>
        </div>
        <Input
          type="number"
          placeholder="Masukkan target laba"
          value={targetLaba || ""}
          onChange={(e) => setTargetLaba(Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass rounded-xl border-border/50 shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Potensi Omzet / Bulan</p>
              <p className="text-sm font-bold text-foreground">{formatRp(omzetBulan)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass rounded-xl border-border/50 shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Biaya / Bulan</p>
              <p className="text-sm font-bold text-foreground">{formatRp(biayaBulan)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2">
          <Card className={cn(
            "glass rounded-xl border-2 shadow-card",
            labaBulan >= 0 ? "border-success/30" : "border-destructive/30"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className={cn("h-4 w-4", labaBulan >= 0 ? "text-success" : "text-destructive")} />
                <p className="text-xs text-muted-foreground">Proyeksi Laba Bersih / Bulan</p>
              </div>
              <p className={cn("text-xl font-extrabold", labaBulan >= 0 ? "text-success" : "text-destructive")}>
                {formatRp(labaBulan)}
              </p>
              {targetLaba > 0 && (
                <p className="text-xs mt-2 text-muted-foreground">
                  {labaBulan >= targetLaba
                    ? `✅ Target tercapai! Surplus ${formatRp(labaBulan - targetLaba)}`
                    : `⚠️ Kurang ${formatRp(targetLaba - labaBulan)} dari target`}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfitProjection;
