import { motion } from "framer-motion";
import { Megaphone, ShoppingBag, Store, Factory, Layers, Briefcase } from "lucide-react";
import type { BusinessMode } from "@/types";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ElementType> = {
  Megaphone, ShoppingBag, Store, Factory, Layers, Briefcase,
};

const modes: { id: BusinessMode; label: string; icon: string; desc: string }[] = [
  { id: "iklan_cod", label: "Iklan & COD", icon: "Megaphone", desc: "Jualan via iklan" },
  { id: "marketplace", label: "Marketplace", icon: "ShoppingBag", desc: "Tokped, Shopee" },
  { id: "ritel_fnb", label: "Ritel / F&B", icon: "Store", desc: "Toko & restoran" },
  { id: "manufaktur", label: "Manufaktur", icon: "Factory", desc: "Produksi pabrik" },
  { id: "produksi_turunan", label: "Turunan", icon: "Layers", desc: "Multi produk" },
  { id: "produk_jasa", label: "Jasa", icon: "Briefcase", desc: "Layanan & jasa" },
];

interface Props {
  selected: BusinessMode | null;
  onSelect: (mode: BusinessMode) => void;
}

const BusinessModeSelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
          <Store className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Mode Bisnis</h2>
          <p className="text-[11px] text-muted-foreground">Pilih jenis bisnis Anda</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
        {modes.map((mode, i) => {
          const Icon = icons[mode.icon];
          const isSelected = selected === mode.id;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(mode.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-300",
                isSelected
                  ? "border-primary bg-primary/5 shadow-card-hover"
                  : "border-border/50 bg-white hover:border-primary/20 hover:shadow-card"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary flex items-center justify-center shadow-glow"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                >
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
              <div className={cn(
                "h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300",
                isSelected ? "gradient-primary shadow-glow" : "bg-muted/60"
              )}>
                <Icon className={cn("h-5 w-5 transition-colors", isSelected ? "text-white" : "text-muted-foreground")} />
              </div>
              <div className="text-center">
                <span className={cn(
                  "text-xs font-bold leading-tight block",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {mode.label}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">{mode.desc}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessModeSelector;
