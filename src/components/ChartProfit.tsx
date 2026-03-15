import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { HasilPerhitungan } from "@/types";

interface Props {
  hasil: HasilPerhitungan;
  batchPerMonth: number;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const ChartProfit = ({ hasil, batchPerMonth }: Props) => {
  const labaPerBatch = hasil.proyeksiLaba;
  const dailyBatch = batchPerMonth / 30;

  const data = [1, 15, 30].map((day) => {
    const batches = dailyBatch * day;
    const target = labaPerBatch * batches;
    return {
      name: `Hari ${day}`,
      "Kondisi Rame": Math.round(target * 1.3),
      Target: Math.round(target),
      "Kondisi Sepi": Math.round(target * 0.5),
    };
  });

  return (
    <Card className="glass rounded-xl overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Grafik Proyeksi Laba 30 Hari
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
            />
            <Tooltip
              formatter={(value: number) => formatRp(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                backdropFilter: "blur(12px)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line type="monotone" dataKey="Kondisi Rame" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(var(--success))" }} />
            <Line type="monotone" dataKey="Target" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(var(--primary))" }} />
            <Line type="monotone" dataKey="Kondisi Sepi" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(var(--destructive))" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartProfit;
