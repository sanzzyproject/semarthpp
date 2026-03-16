import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Tag, Percent, Check } from "lucide-react";
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
        { label: "Paket Hemat", harga: bundling.hargaHemat, desc: "Diskon 20%", icon: Tag, color: "text-success", bg: "bg-success/8" },
        { label: "Paling Seimbang", harga: bundling.hargaSeimbang, desc: "Diskon 13%", icon: Percent, color: "text-primary", bg: "bg-primary/8" },
        { label: "Profit Maksimal", harga: bundling.hargaMaksimal, desc: "Diskon 6.5%", icon: Package, color: "text-warning", bg: "bg-warning/8" },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary-xl w-full h-13 text-base gap-2.5 flex items-center justify-center">
          <Package className="h-5 w-5" />
          Bundling Cerdas
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border-border/40 shadow-card-hover p-0">
        <div className="gradient-primary p-5 rounded-t-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold block">Bundling Cerdas</span>
                <span className="text-xs text-white/70 font-normal">Buat paket bundling otomatis</span>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground font-medium">Pilih minimal 2 produk untuk membuat paket:</p>

          {produkTurunan.map((p, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200",
                selectedIds.includes(i)
                  ? "border-primary bg-primary/5 shadow-card"
                  : "border-border/40 hover:border-primary/20 bg-white"
              )}
              onClick={() => toggleProduct(i)}
            >
              <Checkbox checked={selectedIds.includes(i)} className="rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{p.nama}</p>
                <p className="text-[11px] text-muted-foreground">
                  HPP: {formatRp(hppPerProduk[i]?.hppPerUnit || 0)} · Jual: {formatRp(p.hargaJual)}
                </p>
              </div>
            </motion.div>
          ))}

          {bundling && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-border/30"
            >
              <div className="stat-card space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total HPP Gabungan</span>
                  <span className="font-bold text-foreground tabular-nums">{formatRp(bundling.totalHPP)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga Normal Total</span>
                  <span className="font-bold text-foreground tabular-nums">{formatRp(bundling.hargaNormal)}</span>
                </div>
              </div>

              <p className="section-label">Pilihan Harga Bundling</p>
              {options.map((opt, i) => {
                const profit = opt.harga - bundling.totalHPP;
                const margin = opt.harga > 0 ? ((profit / opt.harga) * 100).toFixed(1) : "0";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card-premium p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", opt.bg)}>
                          <opt.icon className={cn("h-4 w-4", opt.color)} />
                        </div>
                        <div>
                          <p className={cn("text-sm font-bold", opt.color)}>{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                        </div>
                      </div>
                      <p className="text-base font-extrabold text-foreground tabular-nums">{formatRp(opt.harga)}</p>
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-border/20 text-xs text-muted-foreground">
                      <span>Profit: <span className="font-bold text-success">{formatRp(profit)}</span></span>
                      <span>Margin: <span className="font-bold text-primary">{margin}%</span></span>
                    </div>
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
