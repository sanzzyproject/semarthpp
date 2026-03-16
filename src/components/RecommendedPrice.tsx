import { motion } from "framer-motion";
import { BadgeDollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HPPPerProduk } from "@/types";

interface Props {
  hppPerProduk: HPPPerProduk[];
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const margins = [
  { label: "30%", value: 0.3, color: "text-success", bg: "bg-success/10" },
  { label: "50%", value: 0.5, color: "text-primary", bg: "bg-primary/10" },
  { label: "100%", value: 1.0, color: "text-accent", bg: "bg-accent/10" },
];

const RecommendedPrice = ({ hppPerProduk }: Props) => {
  if (hppPerProduk.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
        Rekomendasi Harga Jual
      </h2>
      <p className="text-xs text-muted-foreground -mt-2">
        Harga jual yang disarankan berdasarkan margin keuntungan dari HPP per unit.
      </p>

      <div className="space-y-3">
        {hppPerProduk.map((produk, pi) => (
          <motion.div
            key={pi}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.08 }}
          >
            <Card className="glass rounded-xl border-border/50 shadow-card overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
                      <BadgeDollarSign className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{produk.nama}</p>
                      <p className="text-xs text-muted-foreground">HPP: {formatRp(produk.hppPerUnit)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
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
                          "rounded-xl p-3 text-center border border-border/30 hover:shadow-card transition-all",
                          m.bg
                        )}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className={cn("h-3 w-3", m.color)} />
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", m.color)}>
                            Margin {m.label}
                          </span>
                        </div>
                        <p className={cn("text-sm font-extrabold", m.color)}>
                          {formatRp(Math.round(sellingPrice))}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Profit: {formatRp(Math.round(profit))}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPrice;
