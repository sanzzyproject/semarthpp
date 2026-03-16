import { Plus, Trash2, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-success/8 flex items-center justify-center">
            <Box className="h-4 w-4 text-success" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Produk Turunan</h3>
            <p className="text-[11px] text-muted-foreground">{items.length} produk ditambahkan</p>
          </div>
        </div>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-success/8 text-success hover:bg-success/12 transition-colors duration-200 active:scale-[0.97]"
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
                <span className="text-xs font-semibold text-muted-foreground">Produk #{i + 1}</span>
              </div>
              <button
                onClick={() => removeItem(i)}
                className="h-7 w-7 rounded-lg bg-destructive/8 flex items-center justify-center hover:bg-destructive/15 transition-colors duration-200"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
            <Input placeholder="Nama produk" value={item.nama} onChange={(e) => updateItem(i, "nama", e.target.value)} className="input-modern h-10" />
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Qty" value={item.qty || ""} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} className="input-modern h-10 text-xs" />
              <Input placeholder="Satuan" value={item.satuan} onChange={(e) => updateItem(i, "satuan", e.target.value)} className="input-modern h-10 text-xs" />
              <Input type="number" placeholder="Harga jual" value={item.hargaJual || ""} onChange={(e) => updateItem(i, "hargaJual", Number(e.target.value))} className="input-modern h-10 text-xs" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="card-premium p-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <Box className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <p className="text-sm text-muted-foreground">Belum ada produk turunan.</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">Klik "Tambah" untuk menambahkan.</p>
        </div>
      )}
    </div>
  );
};

export default InputProduk;
