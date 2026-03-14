import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3 } from "lucide-react";
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
      <h2 className="text-lg font-bold text-foreground">Hasil Perhitungan HPP</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Biaya Produksi</p>
              <p className="text-base font-bold text-foreground">{formatRp(hasil.totalBiayaProduksi)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Potensi Penjualan</p>
              <p className="text-base font-bold text-foreground">{formatRp(hasil.totalPotensiPenjualan)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn("border-2", isProfit ? "border-success/30" : "border-destructive/30")}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn("rounded-full p-2", isProfit ? "bg-success/10" : "bg-destructive/10")}>
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
      </div>

      {/* Detail Rincian Biaya */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Rincian Biaya per Batch (klik untuk buka)
              </CardTitle>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-1">
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Bahan Baku</p>
              {bahanBaku.map((b, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                  <span className="text-foreground">{b.nama}</span>
                  <span className="text-foreground font-medium">{formatRp(b.hargaTotal)}</span>
                </div>
              ))}
              <p className="text-xs font-semibold text-muted-foreground mt-3 mb-2">Biaya Pengolahan</p>
              {biayaPengolahan.map((b, i) => {
                const biayaEffective = b.periode === "per_bulan" && batchPerMonth > 0 ? b.harga / batchPerMonth : b.harga;
                return (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                    <span className="text-foreground">
                      {b.nama}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({b.periode === "per_bulan" ? "per bulan" : "per batch"})
                      </span>
                    </span>
                    <span className="text-foreground font-medium">{formatRp(biayaEffective)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* HPP per Produk Table */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Detail HPP per Produk</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Produk</TableHead>
                <TableHead className="text-xs text-right">Qty</TableHead>
                <TableHead className="text-xs text-right">Alokasi</TableHead>
                <TableHead className="text-xs text-right">HPP/Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasil.hppPerProduk.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{p.nama}</TableCell>
                  <TableCell className="text-sm text-right">{p.qty}</TableCell>
                  <TableCell className="text-sm text-right">{formatRp(p.alokasiBiaya)}</TableCell>
                  <TableCell className="text-sm text-right font-semibold">{formatRp(p.hppPerUnit)}</TableCell>
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
