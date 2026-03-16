import { motion } from "framer-motion";
import { BadgeDollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HPPPerProduk } from "@/types";

interface Props {
  hppPerProduk: HPPPerProduk[];
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const margins = [
  { label: "30%", value: 0.3, color: "text-success", bg: "bg-success/8", borderColor: "border-success/15" },
  { label: "50%", value: 0.5, color: "text-primary", bg: "bg-primary/8", borderColor: "border-primary/15" },
  { label: "100%", value: 1.0, color: "text-accent", bg: "bg-accent/8", borderColor: "border-accent/15" },
];

const RecommendedPrice = ({ hppPerProduk }: Props) => {
  if (hppPerProduk.length === 0) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-success/8 flex items-center justify-center">
          <BadgeDollarSign className="h-4 w-4 text-success" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Rekomendasi Harga Jual</h2>
          <p className="text-[11px] text-muted-foreground">Berdasarkan margin keuntungan dari HPP</p>
        </div>
      </div>

      <div className="space-y-3">
        {hppPerProduk.map((produk, pi) => (
          <motion.div
            key={pi}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.08 }}
            className="card-premium p-5 space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-xs font-bold text-white">{pi + 1}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{produk.nama}</p>
                <p className="text-[11px] text-muted-foreground">HPP: {formatRp(produk.hppPerUnit)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {margins.map((m, mi) => {
                const sellingPrice = produk.hppPerUnit * (1 + m.value);
                const profit = sellingPrice - produk.hppPerUnit;
                return (
                  <motion.div
                    key={mi}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: pi * 0.08 + mi * 0.05 }}
                    className={cn(
                      "rounded-2xl p-3 text-center border transition-all duration-200 hover:shadow-card",
                      m.bg, m.borderColor
                    )}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1.5">
                      <TrendingUp className={cn("h-3 w-3", m.color)} />
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest", m.color)}>
                        {m.label}
                      </span>
                    </div>
                    <p className={cn("text-sm font-extrabold tabular-nums", m.color)}>
                      {formatRp(Math.round(sellingPrice))}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                      +{formatRp(Math.round(profit))}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPrice;
