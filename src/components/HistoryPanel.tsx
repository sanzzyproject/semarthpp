import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getAllCalculations, deleteCalculation } from "@/lib/db";
import type { CalculationRecord } from "@/types";

interface Props {
  onLoad: (record: CalculationRecord) => void;
  refreshKey: number;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const HistoryPanel = ({ onLoad, refreshKey }: Props) => {
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [open, setOpen] = useState(false);

  const loadRecords = async () => {
    const data = await getAllCalculations();
    setRecords(data);
  };

  useEffect(() => {
    if (open) loadRecords();
  }, [open, refreshKey]);

  const handleDelete = async (id: number) => {
    await deleteCalculation(id);
    loadRecords();
  };

  const handleLoad = (record: CalculationRecord) => {
    onLoad(record);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold bg-primary/8 text-primary hover:bg-primary/12 transition-colors duration-200 active:scale-[0.97]">
          <History className="h-3.5 w-3.5" />
          Riwayat
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-white border-l border-border/30 p-0">
        <div className="gradient-primary p-5">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3 text-white">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold block">Riwayat</span>
                <span className="text-xs text-white/70 font-normal">{records.length} perhitungan tersimpan</span>
              </div>
            </SheetTitle>
          </SheetHeader>
        </div>
        <div className="p-4 space-y-3">
          {records.length === 0 && (
            <div className="text-center py-16">
              <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <History className="h-7 w-7 text-muted-foreground/25" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Belum ada riwayat.</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">Perhitungan yang disimpan akan muncul di sini.</p>
            </div>
          )}
          <AnimatePresence>
            {records.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="card-premium p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">{r.businessName || "Tanpa Nama"}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleLoad(r)}
                      className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center hover:bg-primary/15 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-primary" />
                    </button>
                    <button
                      onClick={() => r.id && handleDelete(r.id)}
                      className="h-8 w-8 rounded-xl bg-destructive/8 flex items-center justify-center hover:bg-destructive/15 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Laba:</span>
                  <span className={r.hasilPerhitungan.proyeksiLaba >= 0 ? "text-success font-bold" : "text-destructive font-bold"}>
                    {formatRp(r.hasilPerhitungan.proyeksiLaba)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryPanel;
