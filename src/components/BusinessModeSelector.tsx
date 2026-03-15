import { motion } from "framer-motion";
import { Megaphone, ShoppingBag, Store, Factory, Layers, Briefcase } from "lucide-react";
import type { BusinessMode } from "@/types";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ElementType> = {
  Megaphone, ShoppingBag, Store, Factory, Layers, Briefcase,
};

const modes: { id: BusinessMode; label: string; icon: string }[] = [
  { id: "iklan_cod", label: "Iklan & COD", icon: "Megaphone" },
  { id: "marketplace", label: "Marketplace", icon: "ShoppingBag" },
  { id: "ritel_fnb", label: "Bisnis Ritel / F&B", icon: "Store" },
  { id: "manufaktur", label: "Manufaktur / Pabrik", icon: "Factory" },
  { id: "produksi_turunan", label: "Produksi Turunan", icon: "Layers" },
  { id: "produk_jasa", label: "Produk Jasa", icon: "Briefcase" },
];

interface Props {
  selected: BusinessMode | null;
  onSelect: (mode: BusinessMode) => void;
}

const BusinessModeSelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full gradient-primary" />
        Pilih Mode Bisnis
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {modes.map((mode, i) => {
          const Icon = icons[mode.icon];
          const isSelected = selected === mode.id;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(mode.id)}
              className={cn(
                "flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border/50 glass hover:border-primary/30 hover:shadow-card"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                isSelected ? "gradient-primary shadow-glow" : "bg-muted"
              )}>
                <Icon className={cn("h-5 w-5", isSelected ? "text-white" : "text-muted-foreground")} />
              </div>
              <span className={cn(
                "text-xs font-semibold text-center leading-tight",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {mode.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessModeSelector;
