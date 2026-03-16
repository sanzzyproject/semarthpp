import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Grafik Proyeksi Laba</h2>
          <p className="text-[11px] text-muted-foreground">Simulasi 30 hari dengan 3 skenario</p>
        </div>
      </div>

      <div className="card-premium p-4 pt-5">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" strokeOpacity={0.7} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(215 15% 50%)", fontWeight: 500 }}
              stroke="hsl(214 32% 91%)"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215 15% 50%)", fontWeight: 500 }}
              stroke="hsl(214 32% 91%)"
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => formatRp(value)}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid hsl(214 32% 91%)",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: 500,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                padding: "12px 16px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "12px" }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="Kondisi Rame"
              stroke="hsl(142 71% 45%)"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "hsl(142 71% 45%)", strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 7, strokeWidth: 3, stroke: "white" }}
            />
            <Line
              type="monotone"
              dataKey="Target"
              stroke="hsl(217 91% 55%)"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "hsl(217 91% 55%)", strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 7, strokeWidth: 3, stroke: "white" }}
            />
            <Line
              type="monotone"
              dataKey="Kondisi Sepi"
              stroke="hsl(0 72% 51%)"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "hsl(0 72% 51%)", strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 7, strokeWidth: 3, stroke: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartProfit;
