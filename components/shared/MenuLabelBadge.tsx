import { Flame, Leaf, Star, type LucideIcon } from "lucide-react";
import type { MenuLabel } from "@/data/menu";

const styles: Record<MenuLabel, { className: string; Icon: LucideIcon }> = {
  Populair: { className: "bg-tomaat text-white", Icon: Star },
  Vegetarisch: { className: "bg-blad text-white", Icon: Leaf },
  Pittig: { className: "bg-antraciet text-goud", Icon: Flame },
};

export function MenuLabelBadge({ label }: { label: MenuLabel }) {
  const { className, Icon } = styles[label];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-none ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
      {label}
    </span>
  );
}
