import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Tag, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        { label: "Paket Hemat", harga: bundling.hargaHemat, desc: "Diskon 20%", icon: Tag, color: "text-success" },
        { label: "Paling Seimbang", harga: bundling.hargaSeimbang, desc: "Diskon 13%", icon: Percent, color: "text-primary" },
        { label: "Profit Maksimal", harga: bundling.hargaMaksimal, desc: "Diskon 6.5%", icon: Package, color: "text-warning" },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 gradient-primary text-white border-0 shadow-glow hover:opacity-90 transition-all rounded-xl h-11" size="lg">
          <Package className="h-5 w-5" />
          Bundling Cerdas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto glass-strong rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            Bundling Cerdas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <p className="text-sm text-muted-foreground">Pilih minimal 2 produk untuk membuat paket bundling:</p>

          {produkTurunan.map((p, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all",
                selectedIds.includes(i)
                  ? "border-primary bg-primary/5 shadow-card"
                  : "border-border/50 hover:border-primary/30"
              )}
              onClick={() => toggleProduct(i)}
            >
              <Checkbox checked={selectedIds.includes(i)} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{p.nama}</p>
                <p className="text-xs text-muted-foreground">
                  HPP: {formatRp(hppPerProduk[i]?.hppPerUnit || 0)} | Jual: {formatRp(p.hargaJual)}
                </p>
              </div>
            </motion.div>
          ))}

          {bundling && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-3 border-t border-border/50"
            >
              <div className="glass rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total HPP Gabungan</span>
                  <span className="font-bold text-foreground">{formatRp(bundling.totalHPP)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga Normal Total</span>
                  <span className="font-bold text-foreground">{formatRp(bundling.hargaNormal)}</span>
                </div>
              </div>

              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Pilihan Harga Bundling</p>
              {options.map((opt, i) => {
                const profit = opt.harga - bundling.totalHPP;
                const margin = opt.harga > 0 ? ((profit / opt.harga) * 100).toFixed(1) : "0";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass rounded-xl border-border/50 shadow-card hover:shadow-card-hover transition-all">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center",
                              i === 0 ? "bg-success/10" : i === 1 ? "bg-primary/10" : "bg-warning/10"
                            )}>
                              <opt.icon className={cn("h-4 w-4", opt.color)} />
                            </div>
                            <div>
                              <p className={cn("text-sm font-bold", opt.color)}>{opt.label}</p>
                              <p className="text-xs text-muted-foreground">{opt.desc}</p>
                            </div>
                          </div>
                          <p className="text-base font-extrabold text-foreground">{formatRp(opt.harga)}</p>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Profit: <span className="font-semibold text-success">{formatRp(profit)}</span></span>
                          <span>Margin: <span className="font-semibold text-primary">{margin}%</span></span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundlingCalculator;
