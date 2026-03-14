import { useState } from "react";
import { Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { HPPPerProduk, ProdukTurunan } from "@/types";
import { hitungBundling } from "@/lib/calculations";

interface Props {
  produkTurunan: ProdukTurunan[];
  hppPerProduk: HPPPerProduk[];
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const BundlingCalculator = ({ produkTurunan, hppPerProduk }: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const toggleProduct = (index: number) => {
    setSelectedIds((prev) =>
      prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
    );
  };

  const selectedProducts = selectedIds.map((i) => ({
    nama: produkTurunan[i].nama,
    hppPerUnit: hppPerProduk[i]?.hppPerUnit || 0,
    hargaJual: produkTurunan[i].hargaJual,
    qty: produkTurunan[i].qty,
  }));

  const bundling = selectedProducts.length >= 2 ? hitungBundling(selectedProducts) : null;

  const options = bundling
    ? [
        { label: "Paket Hemat", harga: bundling.hargaHemat, desc: "Diskon 20% — menarik pelanggan", color: "text-success" },
        { label: "Paling Seimbang", harga: bundling.hargaSeimbang, desc: "Diskon 13% — margin aman", color: "text-primary" },
        { label: "Profit Maksimal", harga: bundling.hargaMaksimal, desc: "Diskon 6.5% — profit tinggi", color: "text-warning" },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" variant="outline">
          <Package className="h-4 w-4" />
          Bundling Cerdas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bundling Cerdas</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Pilih minimal 2 produk untuk membuat paket bundling:</p>

          {produkTurunan.map((p, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                selectedIds.includes(i) ? "border-accent bg-accent/5" : "border-border"
              )}
              onClick={() => toggleProduct(i)}
            >
              <Checkbox checked={selectedIds.includes(i)} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{p.nama}</p>
                <p className="text-xs text-muted-foreground">
                  HPP: {formatRp(hppPerProduk[i]?.hppPerUnit || 0)} | Jual: {formatRp(p.hargaJual)}
                </p>
              </div>
            </div>
          ))}

          {bundling && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total HPP Gabungan</span>
                <span className="font-bold text-foreground">{formatRp(bundling.totalHPP)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Harga Normal Total</span>
                <span className="font-bold text-foreground">{formatRp(bundling.hargaNormal)}</span>
              </div>

              <p className="text-sm font-semibold text-foreground">Pilihan Harga Bundling:</p>
              {options.map((opt, i) => {
                const profit = opt.harga - bundling.totalHPP;
                const margin = opt.harga > 0 ? ((profit / opt.harga) * 100).toFixed(1) : "0";
                return (
                  <Card key={i}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={cn("text-sm font-bold", opt.color)}>{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </div>
                        <p className="text-base font-bold text-foreground">{formatRp(opt.harga)}</p>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Profit: {formatRp(profit)}</span>
                        <span>Margin: {margin}%</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlingCalculator;
