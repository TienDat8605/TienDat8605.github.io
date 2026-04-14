import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BentoCard from "@/components/BentoCard";
import HeroCard from "@/components/HeroCard";
import AboutCard from "@/components/AboutCard";
import SkillsCard from "@/components/SkillsCard";
import ProjectCard, { projects } from "@/components/ProjectCard";
import StatsCard from "@/components/StatsCard";
import ContactCard from "@/components/ContactCard";
import ThemeToggle from "@/components/ThemeToggle";

type GlowColor = "cyan" | "purple" | "blue";

interface BentoConfig {
  id: string;
  glowColor: GlowColor;
  delay: number;
  defaultWidth: number;
}

interface RowItem {
  id: string;
  preferredWidth: number;
}

interface SortableBentoTileProps {
  id: string;
  glowColor: GlowColor;
  delay: number;
  span: number;
  isMobile: boolean;
  isResizing: boolean;
  onResizeStart: (event: React.PointerEvent<HTMLDivElement>, id: string) => void;
  children: React.ReactNode;
}

const BENTO_CONFIGS: BentoConfig[] = [
  { id: "hero", glowColor: "cyan", delay: 0, defaultWidth: 48 },
  { id: "about", glowColor: "purple", delay: 100, defaultWidth: 24 },
  { id: "currently", glowColor: "blue", delay: 150, defaultWidth: 24 },
  { id: "tech", glowColor: "blue", delay: 200, defaultWidth: 48 },
  { id: "kompas", glowColor: "cyan", delay: 300, defaultWidth: 72 },
  { id: "search", glowColor: "purple", delay: 400, defaultWidth: 24 },
  { id: "medigent", glowColor: "blue", delay: 500, defaultWidth: 48 },
  { id: "food", glowColor: "cyan", delay: 600, defaultWidth: 36 },
  { id: "ncs", glowColor: "purple", delay: 650, defaultWidth: 28 },
  { id: "kd", glowColor: "blue", delay: 700, defaultWidth: 42 },
  { id: "github", glowColor: "purple", delay: 750, defaultWidth: 34 },
  { id: "contact", glowColor: "cyan", delay: 850, defaultWidth: 34 },
];

const GRID_COLUMNS = 32;
const MIN_WIDTH_PERCENT = 18;
const MAX_WIDTH_PERCENT = 100;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const buildRows = (
  order: string[],
  widths: Record<string, number>,
  configMap: Record<string, BentoConfig>,
  isMobile: boolean,
) => {
  if (isMobile) {
    return order.map((id) => [{ id, preferredWidth: 100 }]);
  }

  const rows: RowItem[][] = [];
  let currentRow: RowItem[] = [];
  let currentRowTotal = 0;

  for (const id of order) {
    const config = configMap[id];
    if (!config) {
      continue;
    }

    const preferredWidth = clamp(
      widths[id] ?? config.defaultWidth,
      MIN_WIDTH_PERCENT,
      MAX_WIDTH_PERCENT,
    );

    if (currentRow.length === 0) {
      currentRow.push({ id, preferredWidth });
      currentRowTotal = preferredWidth;
      continue;
    }

    if (currentRowTotal + preferredWidth > 100) {
      rows.push(currentRow);
      currentRow = [{ id, preferredWidth }];
      currentRowTotal = preferredWidth;
      continue;
    }

    currentRow.push({ id, preferredWidth });
    currentRowTotal += preferredWidth;
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
};

const buildSpanMap = (
  order: string[],
  widths: Record<string, number>,
  configMap: Record<string, BentoConfig>,
  isMobile: boolean,
) => {
  const rows = buildRows(order, widths, configMap, isMobile);
  const spans: Record<string, number> = {};

  for (const row of rows) {
    if (row.length === 0) {
      continue;
    }

    if (row.length === 1) {
      spans[row[0].id] = GRID_COLUMNS;
      continue;
    }

    const rowTotal = row.reduce((sum, item) => sum + item.preferredWidth, 0);
    const rawSpans = row.map((item) =>
      rowTotal <= 0 ? GRID_COLUMNS / row.length : (item.preferredWidth / rowTotal) * GRID_COLUMNS,
    );

    const floorSpans = rawSpans.map((span) => Math.floor(span));
    const usedColumns = floorSpans.reduce((sum, span) => sum + span, 0);
    const remainingColumns = GRID_COLUMNS - usedColumns;

    const fractions = rawSpans
      .map((span, index) => ({ index, fraction: span - floorSpans[index] }))
      .sort((a, b) => b.fraction - a.fraction);

    for (let i = 0; i < remainingColumns; i += 1) {
      const nextIndex = fractions[i % fractions.length]?.index;
      if (nextIndex === undefined) {
        continue;
      }
      floorSpans[nextIndex] += 1;
    }

    row.forEach((item, index) => {
      spans[item.id] = Math.max(1, floorSpans[index]);
    });
  }

  return spans;
};

const SortableBentoTile = ({
  id,
  glowColor,
  delay,
  span,
  isMobile,
  isResizing,
  onResizeStart,
  children,
}: SortableBentoTileProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: isResizing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
    gridColumn: isMobile ? "span 1 / span 1" : `span ${span} / span ${span}`,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative h-full select-none ${isDragging ? "opacity-70" : "opacity-100"}`}
      {...attributes}
      {...listeners}
    >
      <BentoCard
        className={`h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        glowColor={glowColor}
        delay={delay}
      >
        {children}
      </BentoCard>

      {!isMobile && (
        <div
          onPointerDown={(event) => onResizeStart(event, id)}
          className="absolute right-0 top-0 z-30 h-full w-4 cursor-ew-resize"
          aria-label="Resize card width"
          aria-orientation="vertical"
          role="separator"
        />
      )}
    </div>
  );
};

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<string[]>(() =>
    BENTO_CONFIGS.map((config) => config.id),
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeResizeId, setActiveResizeId] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );
  const [widths, setWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const config of BENTO_CONFIGS) {
      initial[config.id] = config.defaultWidth;
    }
    return initial;
  });

  const configMap = useMemo(() => {
    return BENTO_CONFIGS.reduce<Record<string, BentoConfig>>((acc, config) => {
      acc[config.id] = config;
      return acc;
    }, {});
  }, []);

  const isMobile = viewportWidth < 768;

  const spanMap = useMemo(
    () => buildSpanMap(order, widths, configMap, isMobile),
    [order, widths, configMap, isMobile],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isMobile
        ? { delay: 180, tolerance: 8 }
        : { distance: 6 },
    }),
  );

  useEffect(() => {
    const onResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!activeResizeId) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!containerRef.current) {
        return;
      }

      const containerWidth = containerRef.current.getBoundingClientRect().width;
      if (containerWidth <= 0) {
        return;
      }

      const deltaX = event.clientX - resizeStartX;
      const deltaPercent = (deltaX / containerWidth) * 100;

      setWidths((previous) => ({
        ...previous,
        [activeResizeId]: clamp(
          resizeStartWidth + deltaPercent,
          MIN_WIDTH_PERCENT,
          MAX_WIDTH_PERCENT,
        ),
      }));
    };

    const onPointerUp = () => {
      setActiveResizeId(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [activeResizeId, resizeStartWidth, resizeStartX]);

  const renderCard = (id: string) => {
    if (id === "hero") return <HeroCard />;
    if (id === "about") return <AboutCard />;
    if (id === "currently") {
      return (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Currently
          </p>
          <p className="text-sm font-medium text-foreground">
            Building AI-powered systems
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-2 w-2 animate-glow-pulse rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              Available for work
            </span>
          </div>
        </div>
      );
    }
    if (id === "tech") return <SkillsCard />;
    if (id === "kompas") return <ProjectCard {...projects[0]} />;
    if (id === "search") return <ProjectCard {...projects[1]} />;
    if (id === "medigent") return <ProjectCard {...projects[2]} />;
    if (id === "food") return <ProjectCard {...projects[3]} />;
    if (id === "ncs") return <ProjectCard {...projects[4]} />;
    if (id === "kd") return <ProjectCard {...projects[5]} />;
    if (id === "github") return <StatsCard />;
    return <ContactCard />;
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (activeResizeId) {
      return;
    }

    setActiveDragId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (activeResizeId) {
      return;
    }

    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;

    if (!overId || activeId === overId) {
      return;
    }

    setOrder((previous) => {
      const sourceIndex = previous.indexOf(activeId);
      const targetIndex = previous.indexOf(overId);

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return previous;
      }

      return arrayMove(previous, sourceIndex, targetIndex);
    });
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
  };

  const beginResize = (
    event: React.PointerEvent<HTMLDivElement>,
    id: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const config = configMap[id];
    const currentWidth = widths[id] ?? config?.defaultWidth ?? 24;

    setActiveResizeId(id);
    setResizeStartX(event.clientX);
    setResizeStartWidth(currentWidth);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background bg-grid">
      <div className="fixed right-4 top-4 z-30 md:right-6 md:top-6">
        <ThemeToggle />
      </div>

      <div className="pointer-events-none fixed left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragCancel={handleDragEnd}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={order} strategy={rectSortingStrategy}>
            <div
              ref={containerRef}
              className="grid grid-cols-1 auto-rows-[250px] gap-4 md:grid-cols-none"
              style={
                isMobile
                  ? undefined
                  : {
                      gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
                    }
              }
            >
              {order.map((id) => {
                const config = configMap[id];
                if (!config) {
                  return null;
                }

                return (
                  <SortableBentoTile
                    key={id}
                    id={id}
                    span={spanMap[id] ?? GRID_COLUMNS}
                    isMobile={isMobile}
                    isResizing={Boolean(activeResizeId)}
                    onResizeStart={beginResize}
                    glowColor={config.glowColor}
                    delay={config.delay}
                  >
                    {renderCard(id)}
                  </SortableBentoTile>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        <footer className="mt-16 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            (c) 2024 TienDat8605 - Built with passion
          </p>
        </footer>
      </main>

      {activeDragId && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-border/70 bg-card/90 px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground shadow-lg backdrop-blur">
          Dragging {activeDragId}
        </div>
      )}
    </div>
  );
};

export default Index;
