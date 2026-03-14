import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">Grafik Proyeksi Laba 30 Hari</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
            />
            <Tooltip
              formatter={(value: number) => formatRp(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="Kondisi Rame" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Target" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Kondisi Sepi" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartProfit;
