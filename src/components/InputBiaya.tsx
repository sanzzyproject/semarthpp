import { Plus, Trash2, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
          Biaya Pengolahan
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
                <div className="h-6 w-6 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wallet className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">Biaya #{i + 1}</span>
              </div>
              <button onClick={() => removeItem(i)} className="h-7 w-7 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
            <Input placeholder="Nama biaya" value={item.nama} onChange={(e) => updateItem(i, "nama", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Harga" value={item.harga || ""} onChange={(e) => updateItem(i, "harga", Number(e.target.value))} />
              <Select value={item.periode} onValueChange={(v) => updateItem(i, "periode", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
        <div className="glass rounded-xl p-6 text-center">
          <Wallet className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada biaya pengolahan.</p>
        </div>
      )}
    </div>
  );
};

export default InputBiaya;
