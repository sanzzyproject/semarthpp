import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HasilPerhitungan } from "@/types";

interface Props {
  hasil: HasilPerhitungan;
  batchPerMonth: number;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const ProfitProjection = ({ hasil, batchPerMonth }: Props) => {
  const [targetLaba, setTargetLaba] = useState(0);

  const omzetBulan = hasil.totalPotensiPenjualan * batchPerMonth;
  const biayaBulan = hasil.totalBiayaProduksi * batchPerMonth;
  const labaBulan = omzetBulan - biayaBulan;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Proyeksi Laba Bulanan</h2>

      <div className="space-y-2">
        <Label className="text-sm">Target Laba Bersih / Bulan</Label>
        <Input
          type="number"
          placeholder="Masukkan target laba"
          value={targetLaba || ""}
          onChange={(e) => setTargetLaba(Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Potensi Omzet / Bulan</p>
            <p className="text-sm font-bold text-foreground">{formatRp(omzetBulan)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Biaya / Bulan</p>
            <p className="text-sm font-bold text-foreground">{formatRp(biayaBulan)}</p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Proyeksi Laba Bersih / Bulan</p>
            <p className={`text-lg font-bold ${labaBulan >= 0 ? "text-success" : "text-destructive"}`}>
              {formatRp(labaBulan)}
            </p>
            {targetLaba > 0 && (
              <p className="text-xs mt-1 text-muted-foreground">
                {labaBulan >= targetLaba
                  ? `✅ Target tercapai! Surplus ${formatRp(labaBulan - targetLaba)}`
                  : `⚠️ Kurang ${formatRp(targetLaba - labaBulan)} dari target`}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfitProjection;
