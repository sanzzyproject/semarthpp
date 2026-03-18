import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, X, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  getAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getAllProducts,
  getAllCategories,
  addCategory,
  type Transaction,
  type Product,
  type Category,
} from "@/lib/finance-db";
import { toast } from "@/hooks/use-toast";

const formatRp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

const defaultCategories: Category[] = [
  { name: "Penjualan", type: "pemasukan" },
  { name: "Jasa", type: "pemasukan" },
  { name: "Bahan Baku", type: "pengeluaran" },
  { name: "Operasional", type: "pengeluaran" },
  { name: "Gaji", type: "pengeluaran" },
  { name: "Marketing", type: "pengeluaran" },
  { name: "Lainnya", type: "pemasukan" },
];

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [filterTag, setFilterTag] = useState("");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [form, setForm] = useState({
    type: "pengeluaran" as "pemasukan" | "pengeluaran",
    nominal: 0,
    category: "",
    productName: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
    tags: "",
  });

  const load = useCallback(async () => {
    const [tx, prods, cats] = await Promise.all([
      getAllTransactions(),
      getAllProducts(),
      getAllCategories(),
    ]);
    setTransactions(tx);
    setProducts(prods);
    if (cats.length === 0) {
      for (const c of defaultCategories) {
        await addCategory(c);
      }
      setCategories(await getAllCategories());
    } else {
      setCategories(cats);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ type: "pengeluaran", nominal: 0, category: "", productName: "", date: new Date().toISOString().slice(0, 10), note: "", tags: "" });
    setEditingTx(null);
  };

  const handleSave = async () => {
    if (form.nominal <= 0 || isNaN(form.nominal)) {
      toast({ title: "Nominal harus lebih dari 0", variant: "destructive" });
      return;
    }
    if (!form.category) {
      toast({ title: "Pilih kategori", variant: "destructive" });
      return;
    }
    const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const now = Date.now();

    if (editingTx) {
      await updateTransaction({
        ...editingTx,
        type: form.type,
        nominal: Math.round(form.nominal),
        category: form.category,
        productName: form.productName,
        date: form.date,
        note: form.note,
        tags: tagsArr,
        updatedAt: now,
      });
      toast({ title: "Transaksi diperbarui" });
    } else {
      await addTransaction({
        type: form.type,
        nominal: Math.round(form.nominal),
        category: form.category,
        productName: form.productName,
        date: form.date,
        note: form.note,
        tags: tagsArr,
        createdAt: now,
        updatedAt: now,
      });
      toast({ title: "Transaksi ditambahkan" });
    }

    resetForm();
    setOpen(false);
    await load();
  };

  const handleEdit = (t: Transaction) => {
    setEditingTx(t);
    setForm({
      type: t.type,
      nominal: t.nominal,
      category: t.category,
      productName: t.productName,
      date: t.date,
      note: t.note,
      tags: t.tags.join(", "),
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    toast({ title: "Transaksi dihapus" });
    await load();
  };

  const filteredTx = filterTag
    ? transactions.filter((t) => t.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase())))
    : transactions;

  const filteredCats = categories.filter((c) => c.type === form.type);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Keuangan</h1>
          <p className="text-sm text-muted-foreground">Catat pemasukan & pengeluaran</p>
        </div>
        <Button onClick={() => { resetForm(); setOpen(true); }} className="gap-1.5">
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </div>

      {/* Tag filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter tag..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="max-w-xs h-9"
        />
        {filterTag && (
          <Button variant="ghost" size="icon" onClick={() => setFilterTag("")} className="h-9 w-9">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Transaction list */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          {filteredTx.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada transaksi</p>
          ) : (
            <AnimatePresence>
              {filteredTx.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start justify-between py-3 border-b border-border/40 last:border-0 gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{t.category}</p>
                      {t.productName && <Badge variant="secondary" className="text-[10px]">{t.productName}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.date}{t.note ? ` • ${t.note}` : ""}</p>
                    {t.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {t.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-sm font-bold ${t.type === "pemasukan" ? "text-success" : "text-destructive"}`}>
                      {t.type === "pemasukan" ? "+" : "-"}{formatRp(t.nominal)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(t)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(t.id!)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTx ? "Edit Transaksi" : "Tambah Transaksi"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={form.type === "pemasukan" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setForm({ ...form, type: "pemasukan", category: "" })}
              >
                Pemasukan
              </Button>
              <Button
                variant={form.type === "pengeluaran" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setForm({ ...form, type: "pengeluaran", category: "" })}
              >
                Pengeluaran
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Nominal</label>
              <Input
                type="number"
                value={form.nominal || ""}
                onChange={(e) => setForm({ ...form, nominal: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Kategori</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {filteredCats.map((c) => (
                    <SelectItem key={c.id ?? c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Produk (opsional)</label>
              <Select value={form.productName} onValueChange={(v) => setForm({ ...form, productName: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">— Tanpa produk —</SelectItem>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tanggal</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Catatan</label>
              <Input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Catatan..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tags (pisah koma)</label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="contoh: rutin, urgent"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Batal</Button>
            <Button onClick={handleSave}>{editingTx ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
