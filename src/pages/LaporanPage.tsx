import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { getAllTransactions, type Transaction } from "@/lib/finance-db";
import { toast } from "@/hooks/use-toast";

const formatRp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

type FilterMode = "harian" | "mingguan" | "bulanan";

function getWeekStart(d: Date): string {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d);
  start.setDate(diff);
  return start.toISOString().slice(0, 10);
}

export default function LaporanPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterMode>("bulanan");

  useEffect(() => {
    getAllTransactions().then(setTransactions);
  }, []);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const weekStart = getWeekStart(now);

  const filtered = transactions.filter((t) => {
    if (filter === "harian") return t.date === today;
    if (filter === "mingguan") return t.date >= weekStart && t.date <= today;
    return t.date.startsWith(currentMonth);
  });

  const pemasukan = filtered.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const pengeluaran = filtered.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const profit = pemasukan - pengeluaran;

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  filtered.forEach((t) => {
    const key = `${t.category} (${t.type})`;
    categoryMap[key] = (categoryMap[key] || 0) + t.nominal;
  });
  const categorySorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const borosCategory = filtered
    .filter((t) => t.type === "pengeluaran")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.nominal;
      return acc;
    }, {});
  const topBoros = Object.entries(borosCategory).sort((a, b) => b[1] - a[1])[0];

  const reportText = `📊 Laporan ${filter === "harian" ? "Hari Ini" : filter === "mingguan" ? "Minggu Ini" : "Bulan Ini"}
Pemasukan: ${formatRp(pemasukan)}
Pengeluaran: ${formatRp(pengeluaran)}
Profit: ${formatRp(profit)}
${topBoros ? `\n⚠️ Kategori paling boros: ${topBoros[0]} (${formatRp(topBoros[1])})` : ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    toast({ title: "Laporan disalin!" });
  };

  const filterLabels: Record<FilterMode, string> = { harian: "Hari Ini", mingguan: "Minggu Ini", bulanan: "Bulan Ini" };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Laporan</h1>
        <p className="text-sm text-muted-foreground">Rekap keuangan otomatis</p>
      </div>

      <div className="flex gap-2">
        {(["harian", "mingguan", "bulanan"] as FilterMode[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {filterLabels[f]}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Pemasukan</p>
            <p className="text-lg font-bold text-success">{formatRp(pemasukan)}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Pengeluaran</p>
            <p className="text-lg font-bold text-destructive">{formatRp(pengeluaran)}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Profit</p>
            <p className={`text-lg font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>{formatRp(profit)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category breakdown */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Breakdown per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          {categorySorted.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>
          ) : (
            <div className="space-y-2">
              {categorySorted.map(([cat, val]) => (
                <div key={cat} className="flex items-center justify-between text-sm py-1.5 border-b border-border/40 last:border-0">
                  <span>{cat}</span>
                  <span className="font-medium">{formatRp(val)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {topBoros && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="shadow-card border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <p className="text-sm font-medium">⚠️ Kategori paling boros: <strong>{topBoros[0]}</strong></p>
              <p className="text-xs text-muted-foreground">Total: {formatRp(topBoros[1])}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Button variant="outline" onClick={handleCopy} className="gap-1.5">
        <Copy className="h-4 w-4" /> Copy Laporan
      </Button>
    </div>
  );
}
