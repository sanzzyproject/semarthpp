import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProdukTurunan } from "@/types";

interface Props {
  items: ProdukTurunan[];
  onChange: (items: ProdukTurunan[]) => void;
}

const InputProduk = ({ items, onChange }: Props) => {
  const addItem = () => {
    onChange([...items, { nama: "", qty: 0, satuan: "", hargaJual: 0 }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ProdukTurunan, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">Produk Turunan</h3>
        <Button variant="outline" size="sm" onClick={addItem} className="gap-1">
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Produk #{i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-destructive hover:text-destructive/80">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Input
            placeholder="Nama produk"
            value={item.nama}
            onChange={(e) => updateItem(i, "nama", e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="Qty"
              value={item.qty || ""}
              onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
            />
            <Input
              placeholder="Satuan"
              value={item.satuan}
              onChange={(e) => updateItem(i, "satuan", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Harga jual"
              value={item.hargaJual || ""}
              onChange={(e) => updateItem(i, "hargaJual", Number(e.target.value))}
            />
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">Belum ada produk turunan.</p>
      )}
    </div>
  );
};

export default InputProduk;
