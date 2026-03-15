import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <Button variant="outline" className="gap-2 glass rounded-lg" size="sm">
          <History className="h-4 w-4" />
          Riwayat
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto glass-strong">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Riwayat Perhitungan
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-3 mt-4">
          {records.length === 0 && (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Belum ada riwayat perhitungan.</p>
            </div>
          )}
          <AnimatePresence>
            {records.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass rounded-xl border-border/50 shadow-card hover:shadow-card-hover transition-all">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-foreground">{r.businessName || "Tanpa Nama"}</p>
                        <p className="text-xs text-muted-foreground">
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
                        <Button size="icon" variant="ghost" onClick={() => handleLoad(r)} className="h-8 w-8 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => r.id && handleDelete(r.id)} className="h-8 w-8 rounded-lg">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Laba:{" "}
                      <span className={r.hasilPerhitungan.proyeksiLaba >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                        {formatRp(r.hasilPerhitungan.proyeksiLaba)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryPanel;
