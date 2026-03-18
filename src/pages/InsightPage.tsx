import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getAllTransactions, getAllTargets, saveTarget, deleteTarget, getAllRecurring, addRecurring, deleteRecurring, type Transaction, type Target as TargetType, type Recurring } from "@/lib/finance-db";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const formatRp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

function getWeekRange(offset: number) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export default function InsightPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [recurrings, setRecurrings] = useState<Recurring[]>([]);
  const [targetOpen, setTargetOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [targetForm, setTargetForm] = useState({ type: "profit" as "profit" | "tabungan" | "omzet", value: 0 });
  const [recurringForm, setRecurringForm] = useState({ nominal: 0, category: "Operasional", note: "", date: new Date().toISOString().slice(0, 10), type: "pengeluaran" as "pemasukan" | "pengeluaran" });

  useEffect(() => {
    Promise.all([getAllTransactions(), getAllTargets(), getAllRecurring()]).then(([tx, t, r]) => {
      setTransactions(tx);
      setTargets(t);
      setRecurrings(r);
    });
  }, []);

  const thisWeek = getWeekRange(0);
  const lastWeek = getWeekRange(-1);
  const txThisWeek = transactions.filter((t) => t.date >= thisWeek.start && t.date <= thisWeek.end);
  const txLastWeek = transactions.filter((t) => t.date >= lastWeek.start && t.date <= lastWeek.end);

  const inThisWeek = txThisWeek.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const outThisWeek = txThisWeek.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const profitThisWeek = inThisWeek - outThisWeek;

  const inLastWeek = txLastWeek.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const outLastWeek = txLastWeek.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const profitLastWeek = inLastWeek - outLastWeek;

  const insights: string[] = [];
  if (inThisWeek > inLastWeek) insights.push("📈 Pemasukan minggu ini naik dari minggu lalu!");
  else if (inThisWeek < inLastWeek) insights.push("📉 Pemasukan minggu ini turun. Coba tingkatkan penjualan!");
  if (outThisWeek > outLastWeek) insights.push("⚠️ Pengeluaran minggu ini lebih besar dari minggu lalu.");
  else if (outThisWeek < outLastWeek) insights.push("✅ Pengeluaran minggu ini berhasil ditekan!");
  if (profitThisWeek > profitLastWeek) insights.push("🎉 Profit naik dibanding minggu lalu!");
  else if (profitThisWeek < profitLastWeek) insights.push("🔻 Profit turun. Perhatikan pengeluaran!");
  if (insights.length === 0) insights.push("ℹ️ Belum cukup data untuk analisis mingguan.");

  // Monthly totals for targets
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTx = transactions.filter((t) => t.date.startsWith(currentMonth));
  const totalIn = monthTx.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const totalOut = monthTx.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const monthProfit = totalIn - totalOut;

  const handleSaveTarget = async () => {
    if (targetForm.value <= 0) { toast({ title: "Target harus > 0", variant: "destructive" }); return; }
    await saveTarget({ type: targetForm.type, value: Math.round(targetForm.value) });
    setTargetOpen(false);
    setTargets(await getAllTargets());
    toast({ title: "Target disimpan" });
  };

  const handleSaveRecurring = async () => {
    if (recurringForm.nominal <= 0) { toast({ title: "Nominal harus > 0", variant: "destructive" }); return; }
    await addRecurring({ ...recurringForm, nominal: Math.round(recurringForm.nominal), recurringType: "bulanan" });
    setRecurringOpen(false);
    setRecurrings(await getAllRecurring());
    toast({ title: "Pengeluaran rutin ditambahkan" });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insight</h1>
        <p className="text-sm text-muted-foreground">Analisis & target keuangan bisnis</p>
      </div>

      {/* Weekly comparison */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-warning" /> Insight Mingguan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Minggu Lalu</p>
              <p className="text-success font-medium">+{formatRp(inLastWeek)}</p>
              <p className="text-destructive font-medium">-{formatRp(outLastWeek)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Minggu Ini</p>
              <p className="text-success font-medium">+{formatRp(inThisWeek)}</p>
              <p className="text-destructive font-medium">-{formatRp(outThisWeek)}</p>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            {insights.map((ins, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="text-sm">
                {ins}
              </motion.p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Targets */}
      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Target Keuangan</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setTargetOpen(true)} className="gap-1"><Plus className="h-3.5 w-3.5" /> Tambah</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {targets.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada target</p>}
          {targets.map((t) => {
            let current = 0;
            if (t.type === "profit") current = monthProfit;
            else if (t.type === "omzet") current = totalIn;
            else current = Math.max(0, monthProfit);
            const progress = t.value > 0 ? Math.min(Math.round((current / t.value) * 100), 100) : 0;
            return (
              <div key={t.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{t.type}: {formatRp(t.value)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{progress}%</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={async () => { await deleteTarget(t.id!); setTargets(await getAllTargets()); }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recurring */}
      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">🔔 Pengeluaran Rutin</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setRecurringOpen(true)} className="gap-1"><Plus className="h-3.5 w-3.5" /> Tambah</Button>
        </CardHeader>
        <CardContent>
          {recurrings.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada pengeluaran rutin</p>}
          {recurrings.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <div>
                <p className="text-sm font-medium">{r.category}</p>
                <p className="text-xs text-muted-foreground">{r.note} • Bulanan</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-destructive">{formatRp(r.nominal)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={async () => { await deleteRecurring(r.id!); setRecurrings(await getAllRecurring()); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Target Dialog */}
      <Dialog open={targetOpen} onOpenChange={setTargetOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Tambah Target</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={targetForm.type} onValueChange={(v) => setTargetForm({ ...targetForm, type: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="tabungan">Tabungan</SelectItem>
                <SelectItem value="omzet">Omzet</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Target nominal" value={targetForm.value || ""} onChange={(e) => setTargetForm({ ...targetForm, value: Number(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTargetOpen(false)}>Batal</Button>
            <Button onClick={handleSaveTarget}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recurring Dialog */}
      <Dialog open={recurringOpen} onOpenChange={setRecurringOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Pengeluaran Rutin</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input type="number" placeholder="Nominal" value={recurringForm.nominal || ""} onChange={(e) => setRecurringForm({ ...recurringForm, nominal: Number(e.target.value) })} />
            <Input placeholder="Kategori" value={recurringForm.category} onChange={(e) => setRecurringForm({ ...recurringForm, category: e.target.value })} />
            <Input placeholder="Catatan" value={recurringForm.note} onChange={(e) => setRecurringForm({ ...recurringForm, note: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecurringOpen(false)}>Batal</Button>
            <Button onClick={handleSaveRecurring}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
