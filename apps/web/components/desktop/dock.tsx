"use client";

import {
  CalendarDays,
  FolderOpen,
  LayoutGrid,
  type LucideIcon,
  MessageCircle,
  Settings2,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type DockTone = "mint" | "gold" | "violet" | "blue" | "rose" | "slate";

type DockEntry = {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: DockTone;
};

const brandEntry: DockEntry = {
  id: "desktop",
  label: "桌面",
  detail: "回到壶天",
  icon: Sparkles,
  tone: "mint",
};

const primaryEntries: DockEntry[] = [
  {
    id: "market",
    label: "坊市",
    detail: "发现新的星子",
    icon: ShoppingBag,
    tone: "gold",
  },
  {
    id: "space",
    label: "星图",
    detail: "整理你的空间",
    icon: LayoutGrid,
    tone: "violet",
  },
  {
    id: "calendar",
    label: "时辰",
    detail: "看看今天的安排",
    icon: CalendarDays,
    tone: "blue",
  },
  {
    id: "notes",
    label: "札记",
    detail: "记下此刻的想法",
    icon: MessageCircle,
    tone: "rose",
  },
  {
    id: "files",
    label: "收纳",
    detail: "浏览你的文件",
    icon: FolderOpen,
    tone: "gold",
  },
];

const utilityEntries: DockEntry[] = [
  {
    id: "settings",
    label: "设置",
    detail: "调整壶天",
    icon: Settings2,
    tone: "slate",
  },
  {
    id: "trash",
    label: "归墟",
    detail: "暂存不再需要的东西",
    icon: Trash2,
    tone: "slate",
  },
];

const toneClasses: Record<DockTone, string> = {
  mint: "bg-celestial-mint/15 text-celestial-mint group-hover:bg-celestial-mint/25",
  gold: "bg-celestial-gold/15 text-celestial-gold group-hover:bg-celestial-gold/25",
  violet: "bg-celestial-violet/15 text-celestial-violet group-hover:bg-celestial-violet/25",
  blue: "bg-celestial-blue/15 text-celestial-blue group-hover:bg-celestial-blue/25",
  rose: "bg-celestial-rose/15 text-celestial-rose group-hover:bg-celestial-rose/25",
  slate: "bg-white/[0.07] text-white/60 group-hover:bg-white/[0.13] group-hover:text-white/90",
};

const allEntries = [brandEntry, ...primaryEntries, ...utilityEntries];

export function calculateDockScale(distance: number): number {
  const sigma = 84;
  const maxScale = 1.55;

  return 1 + (maxScale - 1) * Math.exp(-0.5 * (distance / sigma) ** 2);
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

function getDockIcon(item: HTMLDivElement): HTMLElement | null {
  return item.querySelector<HTMLElement>(".dock-icon");
}

export function Dock() {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeId, setActiveId] = useState(brandEntry.id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const resetMagnification = useCallback(() => {
    setHoveredId(null);

    for (const item of itemRefs.current) {
      if (!item) {
        continue;
      }

      const icon = getDockIcon(item);
      icon?.style.setProperty("--dock-scale", "1");
      icon?.style.setProperty("--dock-shift", "0px");
    }
  }, []);

  const magnifyAt = useCallback(
    (pointerY: number) => {
      if (prefersReducedMotion()) {
        resetMagnification();
        return;
      }

      let nearestItem: HTMLDivElement | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const item of itemRefs.current) {
        if (!item) {
          continue;
        }

        const bounds = item.getBoundingClientRect();
        const centerY = bounds.top + bounds.height / 2;
        const distance = Math.abs(pointerY - centerY);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestItem = item;
        }

        const scale = calculateDockScale(distance);
        const direction = centerY < pointerY ? -1 : 1;
        const shift = direction * (scale - 1) * 12;
        const icon = getDockIcon(item);

        icon?.style.setProperty("--dock-scale", scale.toFixed(3));
        icon?.style.setProperty("--dock-shift", `${shift.toFixed(1)}px`);
      }

      if (nearestItem) {
        setHoveredId(nearestItem.dataset.dockId ?? null);
      }
    },
    [resetMagnification],
  );

  const magnifyEntry = useCallback(
    (index: number) => {
      const item = itemRefs.current[index];

      if (!item) {
        return;
      }

      const bounds = item.getBoundingClientRect();
      magnifyAt(bounds.top + bounds.height / 2);
    },
    [magnifyAt],
  );

  const registerItem = useCallback((index: number, node: HTMLDivElement | null) => {
    itemRefs.current[index] = node;
  }, []);

  useEffect(() => resetMagnification, [resetMagnification]);

  return (
    <aside
      aria-label="壶天应用栏"
      className="fixed inset-y-0 left-0 z-40 flex w-[88px] flex-col border-r border-white/[0.08] bg-celestial-deep/75 px-3 py-5 text-white/80 shadow-[18px_0_50px_color-mix(in_oklch,var(--celestial-deep)_55%,transparent)] backdrop-blur-2xl"
      onPointerMove={(event) => {
        if (event.pointerType === "touch") {
          resetMagnification();
          return;
        }

        magnifyAt(event.clientY);
      }}
      onPointerLeave={resetMagnification}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-celestial-mint/25 to-transparent" />

      <div className="relative flex h-full flex-col items-center">
        <DockItem
          entry={brandEntry}
          index={0}
          active={activeId === brandEntry.id}
          hovered={hoveredId === brandEntry.id}
          registerItem={registerItem}
          onFocus={magnifyEntry}
          onSelect={setActiveId}
        />

        <div className="my-5 h-px w-8 bg-white/[0.1]" aria-hidden="true" />

        <nav aria-label="应用" className="flex w-full flex-col gap-1">
          {primaryEntries.map((entry, index) => (
            <DockItem
              key={entry.id}
              entry={entry}
              index={index + 1}
              active={activeId === entry.id}
              hovered={hoveredId === entry.id}
              registerItem={registerItem}
              onFocus={magnifyEntry}
              onSelect={setActiveId}
            />
          ))}
        </nav>

        <div className="mt-auto w-full">
          <div className="mb-5 h-px w-8 bg-white/[0.1]" aria-hidden="true" />
          <nav aria-label="系统" className="flex w-full flex-col gap-1">
            {utilityEntries.map((entry, index) => (
              <DockItem
                key={entry.id}
                entry={entry}
                index={primaryEntries.length + index + 1}
                active={activeId === entry.id}
                hovered={hoveredId === entry.id}
                registerItem={registerItem}
                onFocus={magnifyEntry}
                onSelect={setActiveId}
              />
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

type DockItemProps = {
  entry: DockEntry;
  index: number;
  active: boolean;
  hovered: boolean;
  registerItem: (index: number, node: HTMLDivElement | null) => void;
  onFocus: (index: number) => void;
  onSelect: (id: string) => void;
};

function DockItem({
  entry,
  index,
  active,
  hovered,
  registerItem,
  onFocus,
  onSelect,
}: DockItemProps) {
  const Icon = entry.icon;

  return (
    <div
      ref={(node) => registerItem(index, node)}
      data-dock-id={entry.id}
      className="dock-item relative flex h-14 w-full items-center justify-center"
    >
      <button
        type="button"
        aria-label={entry.label}
        aria-pressed={active}
        title={entry.label}
        className={cn(
          "group relative flex size-12 items-center justify-center rounded-2xl border border-transparent bg-transparent outline-none transition-colors duration-200 focus-visible:border-celestial-mint/70 focus-visible:ring-4 focus-visible:ring-celestial-mint/15",
          hovered
            ? "bg-white/[0.12] shadow-[0_10px_26px_color-mix(in_oklch,var(--celestial-deep)_45%,transparent)]"
            : false,
        )}
        onClick={() => onSelect(entry.id)}
        onFocus={() => onFocus(index)}
        onBlur={() => {
          if (document.activeElement !== document.body) {
            return;
          }

          onFocus(index);
        }}
      >
        <span
          className={cn(
            "dock-icon flex size-10 items-center justify-center rounded-[0.9rem] border border-white/[0.08] shadow-[0_8px_20px_color-mix(in_oklch,var(--celestial-deep)_35%,transparent)] transition-colors duration-200",
            toneClasses[entry.tone],
          )}
        >
          <Icon aria-hidden="true" className="size-[1.15rem] stroke-[1.7]" />
        </span>

        <span
          className={cn(
            "absolute -left-1 top-1/2 h-5 w-1 -translate-x-full -translate-y-1/2 rounded-r-full bg-celestial-mint opacity-0 transition-opacity duration-200",
            active ? "opacity-100" : false,
          )}
          aria-hidden="true"
        />

        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-x-1 -translate-y-1/2 rounded-xl border border-white/[0.1] bg-celestial-surface/95 px-3 py-2 text-left opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
          <span className="block whitespace-nowrap text-sm font-medium text-white">
            {entry.label}
          </span>
          <span className="mt-0.5 block whitespace-nowrap text-xs text-white/45">
            {entry.detail}
          </span>
        </span>
      </button>
    </div>
  );
}

export { allEntries };
