import { useState, useEffect } from "react";
import { History, Trash2, Eye, X } from "lucide-react";
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
        <Button variant="outline" className="gap-2">
          <History className="h-4 w-4" />
          Riwayat
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Riwayat Perhitungan</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 mt-4">
          {records.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada riwayat perhitungan.</p>
          )}
          {records.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-3 space-y-2">
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
                    <Button size="icon" variant="ghost" onClick={() => handleLoad(r)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => r.id && handleDelete(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Laba: <span className={r.hasilPerhitungan.proyeksiLaba >= 0 ? "text-success" : "text-destructive"}>
                    {formatRp(r.hasilPerhitungan.proyeksiLaba)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryPanel;
