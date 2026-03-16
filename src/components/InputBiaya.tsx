import { Plus, Trash2, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-accent/8 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Biaya Pengolahan</h3>
            <p className="text-[11px] text-muted-foreground">{items.length} item ditambahkan</p>
          </div>
        </div>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-accent/8 text-accent hover:bg-accent/12 transition-colors duration-200 active:scale-[0.97]"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah
        </button>
      </div>
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="card-premium p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{i + 1}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">Biaya #{i + 1}</span>
              </div>
              <button
                onClick={() => removeItem(i)}
                className="h-7 w-7 rounded-lg bg-destructive/8 flex items-center justify-center hover:bg-destructive/15 transition-colors duration-200"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
            <Input placeholder="Nama biaya" value={item.nama} onChange={(e) => updateItem(i, "nama", e.target.value)} className="input-modern h-10" />
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Harga" value={item.harga || ""} onChange={(e) => updateItem(i, "harga", Number(e.target.value))} className="input-modern h-10 text-xs" />
              <Select value={item.periode} onValueChange={(v) => updateItem(i, "periode", v)}>
                <SelectTrigger className="input-modern h-10 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_batch">Per Batch</SelectItem>
                  <SelectItem value="per_bulan">Per Bulan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="card-premium p-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <Wallet className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <p className="text-sm text-muted-foreground">Belum ada biaya pengolahan.</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">Klik "Tambah" untuk menambahkan.</p>
        </div>
      )}
    </div>
  );
};

export default InputBiaya;
