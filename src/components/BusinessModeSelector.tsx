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
      <h2 className="text-lg font-bold text-foreground">Pilih Mode Bisnis</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = icons[mode.icon];
          const isSelected = selected === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                "hover:border-accent hover:shadow-md",
                isSelected
                  ? "border-accent bg-accent/10 shadow-md"
                  : "border-border bg-card"
              )}
            >
              <Icon className={cn("h-7 w-7", isSelected ? "text-accent" : "text-muted-foreground")} />
              <span className={cn("text-xs font-semibold text-center leading-tight", isSelected ? "text-accent" : "text-foreground")}>
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessModeSelector;
