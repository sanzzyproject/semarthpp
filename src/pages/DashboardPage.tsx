import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Lightbulb,
  Target,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllTransactions,
  getAllTargets,
  generateRecurringTransactions,
  type Transaction,
  type Target as TargetType,
} from "@/lib/finance-db";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const formatRp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
const formatRpShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
};

const PIE_COLORS = [
  "hsl(217, 91%, 55%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(280, 65%, 55%)",
  "hsl(190, 75%, 45%)",
];

type TimeFilter = "today" | "7days" | "30days";

function getFilteredTransactions(transactions: Transaction[], filter: TimeFilter) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  if (filter === "today") {
    return transactions.filter((t) => t.date === today);
  }
  if (filter === "7days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    const startStr = start.toISOString().slice(0, 10);
    return transactions.filter((t) => t.date >= startStr && t.date <= today);
  }
  // 30days
  const start = new Date(now);
  start.setDate(now.getDate() - 29);
  const startStr = start.toISOString().slice(0, 10);
  return transactions.filter((t) => t.date >= startStr && t.date <= today);
}

function getPercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function getWeekRange(offset: number) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30days");

  useEffect(() => {
    generateRecurringTransactions().then(() => {
      getAllTransactions().then(setTransactions);
    });
    getAllTargets().then(setTargets);
  }, []);

  const filtered = useMemo(() => getFilteredTransactions(transactions, timeFilter), [transactions, timeFilter]);

  // Previous period for comparison
  const previousFiltered = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    if (timeFilter === "today") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      return transactions.filter((t) => t.date === yStr);
    }
    if (timeFilter === "7days") {
      const start = new Date(now);
      start.setDate(now.getDate() - 13);
      const end = new Date(now);
      end.setDate(now.getDate() - 7);
      return transactions.filter((t) => t.date >= start.toISOString().slice(0, 10) && t.date <= end.toISOString().slice(0, 10));
    }
    const start = new Date(now);
    start.setDate(now.getDate() - 59);
    const end = new Date(now);
    end.setDate(now.getDate() - 30);
    return transactions.filter((t) => t.date >= start.toISOString().slice(0, 10) && t.date <= end.toISOString().slice(0, 10));
  }, [transactions, timeFilter]);

  const totalPemasukan = filtered.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const totalPengeluaran = filtered.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const profit = totalPemasukan - totalPengeluaran;

  const prevPemasukan = previousFiltered.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const prevPengeluaran = previousFiltered.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const prevProfit = prevPemasukan - prevPengeluaran;

  const pctPemasukan = getPercentChange(totalPemasukan, prevPemasukan);
  const pctPengeluaran = getPercentChange(totalPengeluaran, prevPengeluaran);
  const pctProfit = getPercentChange(profit, prevProfit);

  // Chart data: daily pemasukan vs pengeluaran
  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; pemasukan: number; pengeluaran: number }>();
    filtered.forEach((t) => {
      const existing = map.get(t.date) || { date: t.date, pemasukan: 0, pengeluaran: 0 };
      if (t.type === "pemasukan") existing.pemasukan += t.nominal;
      else existing.pengeluaran += t.nominal;
      map.set(t.date, existing);
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  // Pie chart: expense categories
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.filter((t) => t.type === "pengeluaran").forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + t.nominal);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Profit per product
  const productProfitData = useMemo(() => {
    const map = new Map<string, { pemasukan: number; pengeluaran: number }>();
    filtered.filter((t) => t.productName && t.productName.trim()).forEach((t) => {
      const existing = map.get(t.productName) || { pemasukan: 0, pengeluaran: 0 };
      if (t.type === "pemasukan") existing.pemasukan += t.nominal;
      else existing.pengeluaran += t.nominal;
      map.set(t.productName, existing);
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, profit: v.pemasukan - v.pengeluaran }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 6);
  }, [filtered]);

  // Insights
  const insights = useMemo(() => {
    const result: string[] = [];
    const thisWeek = getWeekRange(0);
    const lastWeek = getWeekRange(-1);
    const txThis = transactions.filter((t) => t.date >= thisWeek.start && t.date <= thisWeek.end);
    const txLast = transactions.filter((t) => t.date >= lastWeek.start && t.date <= lastWeek.end);

    const inThis = txThis.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
    const inLast = txLast.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
    const profThis = inThis - txThis.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
    const profLast = inLast - txLast.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);

    if (profThis > profLast && profLast !== 0) {
      const pct = Math.round(((profThis - profLast) / Math.abs(profLast)) * 100);
      result.push(`Profit naik ${pct}% minggu ini`);
    } else if (profThis < profLast) {
      result.push("Profit turun dari minggu lalu");
    }

    if (categoryData.length > 0) {
      result.push(`Kategori paling tinggi: ${categoryData[0].name}`);
    }

    if (productProfitData.length > 0 && productProfitData[0].profit > 0) {
      result.push(`Produk paling untung: ${productProfitData[0].name}`);
    }

    if (result.length === 0) result.push("Tambah transaksi untuk mendapat insight");

    return result;
  }, [transactions, categoryData, productProfitData]);

  const recentTx = filtered.slice(0, 7);

  // Monthly totals for targets
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTx = transactions.filter((t) => t.date.startsWith(currentMonth));
  const monthIn = monthTx.filter((t) => t.type === "pemasukan").reduce((s, t) => s + t.nominal, 0);
  const monthOut = monthTx.filter((t) => t.type === "pengeluaran").reduce((s, t) => s + t.nominal, 0);
  const monthProfit = monthIn - monthOut;

  const filterLabels: Record<TimeFilter, string> = { today: "Hari Ini", "7days": "7 Hari", "30days": "30 Hari" };

  const statCards = [
    {
      label: "Total Pemasukan",
      value: totalPemasukan,
      icon: TrendingUp,
      pct: pctPemasukan,
      color: "text-success",
      bgIcon: "bg-success/10",
    },
    {
      label: "Total Pengeluaran",
      value: totalPengeluaran,
      icon: TrendingDown,
      pct: pctPengeluaran,
      color: "text-destructive",
      bgIcon: "bg-destructive/10",
      invertPct: true,
    },
    {
      label: "Profit Bersih",
      value: profit,
      icon: Wallet,
      pct: pctProfit,
      color: profit >= 0 ? "text-success" : "text-destructive",
      bgIcon: profit >= 0 ? "bg-success/10" : "bg-destructive/10",
    },
    {
      label: "Total Transaksi",
      value: filtered.length,
      icon: Receipt,
      isCount: true,
      color: "text-primary",
      bgIcon: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan bisnis Anda</p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted/60 rounded-xl p-1">
          {(["today", "7days", "30days"] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                timeFilter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="shadow-card border-border/40 hover:shadow-card-hover transition-all duration-300">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                  <div className={`h-8 w-8 rounded-xl ${s.bgIcon} flex items-center justify-center`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>
                  {s.isCount ? s.value : formatRp(s.value)}
                </p>
                {!s.isCount && s.pct !== undefined && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {(s.invertPct ? s.pct <= 0 : s.pct >= 0) ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className={`text-xs font-medium ${(s.invertPct ? s.pct <= 0 : s.pct >= 0) ? "text-success" : "text-destructive"}`}>
                      {Math.abs(s.pct)}% dari periode lalu
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Line/Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2">
          <Card className="shadow-card border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Pemasukan vs Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {chartData.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                  Belum ada data untuk ditampilkan
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={formatRpShort} width={60} />
                    <Tooltip formatter={(v: number) => formatRp(v)} labelFormatter={(l) => `Tanggal: ${l}`} />
                    <Bar dataKey="pemasukan" name="Pemasukan" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pengeluaran" name="Pengeluaran" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-card border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Distribusi Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {categoryData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                  Belum ada data
                </div>
              ) : (
                <div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatRp(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-1">
                    {categoryData.slice(0, 4).map((c, idx) => (
                      <div key={c.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                          <span className="text-muted-foreground">{c.name}</span>
                        </div>
                        <span className="font-medium">{formatRpShort(c.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Profit per Product */}
      {productProfitData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="shadow-card border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Profit per Produk</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={productProfitData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={formatRpShort} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip formatter={(v: number) => formatRp(v)} />
                  <Bar dataKey="profit" fill="hsl(217, 91%, 55%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bottom Row: Insights + Targets + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Insight Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-card border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-warning" /> Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {insights.map((ins, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-muted-foreground">{ins}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Target Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="shadow-card border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" /> Target Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {targets.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Belum ada target. Atur di halaman Insight.</p>
              ) : (
                targets.map((t) => {
                  let current = 0;
                  if (t.type === "profit") current = monthProfit;
                  else if (t.type === "omzet") current = monthIn;
                  else current = Math.max(0, monthProfit);
                  const progress = t.value > 0 ? Math.min(Math.round((current / t.value) * 100), 100) : 0;
                  return (
                    <div key={t.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium capitalize text-foreground">{t.type}</span>
                        <span className="text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatRpShort(current)} / {formatRpShort(t.value)}
                      </p>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="shadow-card border-border/40 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Transaksi Terakhir</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary" onClick={() => navigate("/app/keuangan")}>
                Lihat Semua <ChevronRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentTx.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">Belum ada transaksi</p>
              ) : (
                <div className="space-y-2">
                  {recentTx.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{t.category}</p>
                        <p className="text-[10px] text-muted-foreground">{t.date}</p>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${t.type === "pemasukan" ? "text-success" : "text-destructive"}`}>
                        {t.type === "pemasukan" ? "+" : "-"}{formatRpShort(t.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
