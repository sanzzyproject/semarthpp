import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X, Camera } from "lucide-react";

interface Props {
  image: string | null;
  onChange: (image: string | null) => void;
}

const ProductImageUpload = ({ image, onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card-premium p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
          <Camera className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Gambar Produk (Opsional)</h2>
          <p className="text-[11px] text-muted-foreground">Upload gambar produk Anda</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {image ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-4"
        >
          <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-primary/15 flex-shrink-0">
            <img src={image} alt="Produk" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-4 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/15 transition-colors"
              >
                Pilih Gambar
              </button>
              <button
                onClick={() => onChange(null)}
                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Gambar akan membantu AI memberikan saran komponen biaya yang lebih akurat.
            </p>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-28 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ImagePlus className="h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-foreground">Pilih Gambar</p>
            <p className="text-[10px] text-muted-foreground">JPG, PNG, WEBP</p>
          </div>
        </button>
      )}
    </div>
  );
};

export default ProductImageUpload;
