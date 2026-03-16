import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { HasilPerhitungan, BahanBaku, BiayaPengolahan } from "@/types";

interface Props {
  hasil: HasilPerhitungan;
  bahanBaku: BahanBaku[];
  biayaPengolahan: BiayaPengolahan[];
  batchPerMonth: number;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const HPPResult = ({ hasil, bahanBaku, biayaPengolahan, batchPerMonth }: Props) => {
  const isProfit = hasil.proyeksiLaba >= 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <BarChart3 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Hasil Perhitungan HPP</h2>
          <p className="text-[11px] text-muted-foreground">Ringkasan biaya produksi dan laba</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: DollarSign,
            label: "Total Biaya Produksi",
            value: formatRp(hasil.totalBiayaProduksi),
            gradient: true,
          },
          {
            icon: ShoppingCart,
            label: "Total Potensi Penjualan",
            value: formatRp(hasil.totalPotensiPenjualan),
            gradient: false,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                item.gradient ? "gradient-primary shadow-glow" : "bg-accent/8"
              )}>
                <item.icon className={cn("h-5 w-5", item.gradient ? "text-white" : "text-accent")} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium truncate">{item.label}</p>
                <p className="text-base font-extrabold text-foreground">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={cn(
            "rounded-2xl p-4 border-2",
            isProfit
              ? "bg-success/5 border-success/20"
              : "bg-destructive/5 border-destructive/20"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                isProfit ? "bg-success/10" : "bg-destructive/10"
              )}>
                {isProfit ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Proyeksi {isProfit ? "Laba" : "Rugi"}</p>
                <p className={cn("text-base font-extrabold", isProfit ? "text-success" : "text-destructive")}>
                  {formatRp(Math.abs(hasil.proyeksiLaba))}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail Rincian Biaya */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button className="card-premium w-full p-4 flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Rincian Biaya per Batch</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all group-data-[state=open]:rotate-180 duration-300" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="card-premium mt-2 p-5 space-y-4">
            <div>
              <p className="section-label mb-3">Bahan Baku</p>
              {bahanBaku.map((b, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-border/30 last:border-0">
                  <span className="text-foreground">{b.nama}</span>
                  <span className="text-foreground font-bold tabular-nums">{formatRp(b.hargaTotal)}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="section-label mb-3">Biaya Pengolahan</p>
              {biayaPengolahan.map((b, i) => {
                const biayaEffective = b.periode === "per_bulan" && batchPerMonth > 0 ? b.harga / batchPerMonth : b.harga;
                return (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-border/30 last:border-0">
                    <span className="text-foreground">
                      {b.nama}{" "}
                      <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 rounded-md bg-muted/60">
                        {b.periode === "per_bulan" ? "per bulan" : "per batch"}
                      </span>
                    </span>
                    <span className="text-foreground font-bold tabular-nums">{formatRp(biayaEffective)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* HPP per Produk Table */}
      <div className="card-premium overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
            <h3 className="text-sm font-bold text-foreground">Detail HPP per Produk</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 bg-muted/30">
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Produk</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">Qty</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">Alokasi</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">HPP/Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasil.hppPerProduk.map((p, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell className="text-sm font-semibold">{p.nama}</TableCell>
                  <TableCell className="text-sm text-right tabular-nums">{p.qty}</TableCell>
                  <TableCell className="text-sm text-right tabular-nums">{formatRp(p.alokasiBiaya)}</TableCell>
                  <TableCell className="text-sm text-right font-extrabold text-primary tabular-nums">{formatRp(p.hppPerUnit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HPPResult;
