import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllTransactions, getAllTargets, generateRecurringTransactions, type Transaction, type Target as TargetType } from "@/lib/finance-db";

const formatRp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [targets, setTargets] = useState<TargetType[]>([]);

  useEffect(() => {
    generateRecurringTransactions().then(() => {
      getAllTransactions().then(setTransactions);
    });
    getAllTargets().then(setTargets);
  }, []);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTx = transactions.filter((t) => t.date.startsWith(currentMonth));

  const totalPemasukan = monthTx.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const totalPengeluaran = monthTx.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const profit = totalPemasukan - totalPengeluaran;

  const recentTx = transactions.slice(0, 5);

  const statCards = [
    { label: "Pemasukan", value: totalPemasukan, icon: TrendingUp, color: "text-success" },
    { label: "Pengeluaran", value: totalPengeluaran, icon: TrendingDown, color: "text-destructive" },
    { label: "Profit", value: profit, icon: Wallet, color: profit >= 0 ? "text-success" : "text-destructive" },
    { label: "Transaksi", value: monthTx.length, icon: Target, color: "text-primary", isCount: true },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan keuangan bulan ini</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
                <p className={`text-lg font-bold ${s.color}`}>
                  {s.isCount ? s.value : formatRp(s.value)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Targets */}
      {targets.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Target Keuangan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {targets.map((t) => {
              let current = 0;
              if (t.type === "profit") current = profit;
              else if (t.type === "omzet") current = totalPemasukan;
              else if (t.type === "tabungan") current = Math.max(0, profit);
              const progress = t.value > 0 ? Math.min(Math.round((current / t.value) * 100), 100) : 0;
              return (
                <div key={t.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{t.type}</span>
                    <span className="text-muted-foreground">{formatRp(current)} / {formatRp(t.value)}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{progress}% tercapai</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recent transactions */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTx.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Belum ada transaksi</p>
          ) : (
            <div className="space-y-3">
              {recentTx.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{t.category}</p>
                    <p className="text-xs text-muted-foreground">{t.date}{t.note ? ` • ${t.note}` : ""}</p>
                  </div>
                  <span className={`text-sm font-bold ${t.type === "pemasukan" ? "text-success" : "text-destructive"}`}>
                    {t.type === "pemasukan" ? "+" : "-"}{formatRp(t.nominal)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
