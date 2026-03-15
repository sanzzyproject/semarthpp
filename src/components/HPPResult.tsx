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
    <div className="space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
        Hasil Perhitungan HPP
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: DollarSign,
            label: "Total Biaya Produksi",
            value: formatRp(hasil.totalBiayaProduksi),
            color: "primary",
          },
          {
            icon: ShoppingCart,
            label: "Total Potensi Penjualan",
            value: formatRp(hasil.totalPotensiPenjualan),
            color: "accent",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass rounded-xl border-border/50 shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                  item.color === "primary" ? "gradient-primary shadow-glow" : "bg-accent/10"
                )}>
                  <item.icon className={cn("h-5 w-5", item.color === "primary" ? "text-white" : "text-accent")} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-base font-bold text-foreground">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={cn(
            "glass rounded-xl border-2 shadow-card hover:shadow-card-hover transition-all",
            isProfit ? "border-success/30" : "border-destructive/30"
          )}>
            <CardContent className="p-4 flex items-center gap-3">
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
                <p className="text-xs text-muted-foreground">Proyeksi {isProfit ? "Laba" : "Rugi"}</p>
                <p className={cn("text-base font-bold", isProfit ? "text-success" : "text-destructive")}>
                  {formatRp(Math.abs(hasil.proyeksiLaba))}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detail Rincian Biaya */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Card className="glass rounded-xl cursor-pointer hover:shadow-card-hover transition-all group">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Rincian Biaya per Batch
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
              </CardTitle>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="glass rounded-xl mt-2">
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Bahan Baku</p>
              {bahanBaku.map((b, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-foreground">{b.nama}</span>
                  <span className="text-foreground font-semibold">{formatRp(b.hargaTotal)}</span>
                </div>
              ))}
              <p className="text-xs font-bold text-accent uppercase tracking-wider mt-4">Biaya Pengolahan</p>
              {biayaPengolahan.map((b, i) => {
                const biayaEffective = b.periode === "per_bulan" && batchPerMonth > 0 ? b.harga / batchPerMonth : b.harga;
                return (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-foreground">
                      {b.nama}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({b.periode === "per_bulan" ? "per bulan" : "per batch"})
                      </span>
                    </span>
                    <span className="text-foreground font-semibold">{formatRp(biayaEffective)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* HPP per Produk Table */}
      <Card className="glass rounded-xl overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
            Detail HPP per Produk
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-xs">Produk</TableHead>
                <TableHead className="text-xs text-right">Qty</TableHead>
                <TableHead className="text-xs text-right">Alokasi</TableHead>
                <TableHead className="text-xs text-right">HPP/Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasil.hppPerProduk.map((p, i) => (
                <TableRow key={i} className="border-border/50">
                  <TableCell className="text-sm font-medium">{p.nama}</TableCell>
                  <TableCell className="text-sm text-right">{p.qty}</TableCell>
                  <TableCell className="text-sm text-right">{formatRp(p.alokasiBiaya)}</TableCell>
                  <TableCell className="text-sm text-right font-bold text-primary">{formatRp(p.hppPerUnit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HPPResult;
