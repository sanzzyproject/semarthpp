import { Plus, Trash2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BahanBaku } from "@/types";

interface Props {
  items: BahanBaku[];
  onChange: (items: BahanBaku[]) => void;
}

const InputBahanBaku = ({ items, onChange }: Props) => {
  const addItem = () => {
    onChange([...items, { nama: "", hargaTotal: 0, jumlah: 0, satuan: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BahanBaku, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
          Bahan Baku Utama
        </h3>
        <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5 glass rounded-lg text-xs">
          <Plus className="h-3.5 w-3.5" /> Tambah
        </Button>
      </div>
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">Bahan #{i + 1}</span>
              </div>
              <button onClick={() => removeItem(i)} className="h-7 w-7 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
            <Input placeholder="Nama bahan" value={item.nama} onChange={(e) => updateItem(i, "nama", e.target.value)} />
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Harga total" value={item.hargaTotal || ""} onChange={(e) => updateItem(i, "hargaTotal", Number(e.target.value))} />
              <Input type="number" placeholder="Jumlah" value={item.jumlah || ""} onChange={(e) => updateItem(i, "jumlah", Number(e.target.value))} />
              <Input placeholder="Satuan" value={item.satuan} onChange={(e) => updateItem(i, "satuan", e.target.value)} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="glass rounded-xl p-6 text-center">
          <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada bahan baku. Klik "Tambah" untuk menambahkan.</p>
        </div>
      )}
    </div>
  );
};

export default InputBahanBaku;
