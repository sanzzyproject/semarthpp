import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BiayaPengolahan } from "@/types";

interface Props {
  items: BiayaPengolahan[];
  onChange: (items: BiayaPengolahan[]) => void;
}

const InputBiaya = ({ items, onChange }: Props) => {
  const addItem = () => {
    onChange([...items, { nama: "", harga: 0, periode: "per_batch" }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BiayaPengolahan, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">Biaya Pengolahan</h3>
        <Button variant="outline" size="sm" onClick={addItem} className="gap-1">
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Biaya #{i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-destructive hover:text-destructive/80">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Input
            placeholder="Nama biaya"
            value={item.nama}
            onChange={(e) => updateItem(i, "nama", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Harga"
              value={item.harga || ""}
              onChange={(e) => updateItem(i, "harga", Number(e.target.value))}
            />
            <Select
              value={item.periode}
              onValueChange={(v) => updateItem(i, "periode", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_batch">Per Batch</SelectItem>
                <SelectItem value="per_bulan">Per Bulan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">Belum ada biaya pengolahan.</p>
      )}
    </div>
  );
};

export default InputBiaya;
