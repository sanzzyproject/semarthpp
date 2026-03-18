import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllProducts, addProduct, deleteProduct, getAllCategories, addCategory, deleteCategory, type Product, type Category } from "@/lib/finance-db";
import { toast } from "@/hooks/use-toast";

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<"pemasukan" | "pengeluaran">("pengeluaran");

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([getAllProducts(), getAllCategories()]);
    setProducts(p);
    setCategories(c);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAddProduct = async () => {
    if (!newProduct.trim()) return;
    await addProduct({ name: newProduct.trim() });
    setNewProduct("");
    toast({ title: "Produk ditambahkan" });
    await load();
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await addCategory({ name: newCatName.trim(), type: newCatType });
    setNewCatName("");
    toast({ title: "Kategori ditambahkan" });
    await load();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Produk & Kategori</h1>
        <p className="text-sm text-muted-foreground">Kelola daftar produk dan kategori transaksi</p>
      </div>

      {/* Products */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" /> Daftar Produk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Nama produk baru..."
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
            />
            <Button onClick={handleAddProduct} size="sm"><Plus className="h-4 w-4" /></Button>
          </div>
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
              >
                <span className="text-sm">{p.name}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={async () => { await deleteProduct(p.id!); await load(); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {products.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada produk</p>}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kategori Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Nama kategori..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1"
            />
            <select
              value={newCatType}
              onChange={(e) => setNewCatType(e.target.value as "pemasukan" | "pengeluaran")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
            <Button onClick={handleAddCategory} size="sm"><Plus className="h-4 w-4" /></Button>
          </div>
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-sm">{c.name}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${c.type === "pemasukan" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {c.type}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={async () => { await deleteCategory(c.id!); await load(); }}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
