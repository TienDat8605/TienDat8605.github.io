import React, { useEffect, useMemo, useRef, useState } from "react";
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
  minHeightClass: string;
  defaultMdSpan: number;
  defaultXlSpan: number;
}

const BENTO_CONFIGS: BentoConfig[] = [
  { id: "hero", glowColor: "cyan", delay: 0, minHeightClass: "min-h-[250px]", defaultMdSpan: 2, defaultXlSpan: 2 },
  { id: "about", glowColor: "purple", delay: 100, minHeightClass: "min-h-[250px]", defaultMdSpan: 1, defaultXlSpan: 1 },
  { id: "currently", glowColor: "blue", delay: 150, minHeightClass: "min-h-[250px]", defaultMdSpan: 1, defaultXlSpan: 1 },
  { id: "tech", glowColor: "blue", delay: 200, minHeightClass: "min-h-[220px]", defaultMdSpan: 2, defaultXlSpan: 2 },
  { id: "kompas", glowColor: "cyan", delay: 300, minHeightClass: "min-h-[260px]", defaultMdSpan: 2, defaultXlSpan: 3 },
  { id: "search", glowColor: "purple", delay: 400, minHeightClass: "min-h-[170px]", defaultMdSpan: 1, defaultXlSpan: 1 },
  { id: "medigent", glowColor: "blue", delay: 500, minHeightClass: "min-h-[245px]", defaultMdSpan: 2, defaultXlSpan: 2 },
  { id: "food", glowColor: "cyan", delay: 600, minHeightClass: "min-h-[205px]", defaultMdSpan: 1, defaultXlSpan: 2 },
  { id: "ncs", glowColor: "purple", delay: 650, minHeightClass: "min-h-[180px]", defaultMdSpan: 1, defaultXlSpan: 1 },
  { id: "kd", glowColor: "blue", delay: 700, minHeightClass: "min-h-[215px]", defaultMdSpan: 2, defaultXlSpan: 2 },
  { id: "github", glowColor: "purple", delay: 750, minHeightClass: "min-h-[205px]", defaultMdSpan: 1, defaultXlSpan: 2 },
  { id: "contact", glowColor: "cyan", delay: 850, minHeightClass: "min-h-[170px]", defaultMdSpan: 1, defaultXlSpan: 2 },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<string[]>(() => BENTO_CONFIGS.map((config) => config.id));
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeResizeId, setActiveResizeId] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartMdSpan, setResizeStartMdSpan] = useState(1);
  const [resizeStartXlSpan, setResizeStartXlSpan] = useState(1);
  const [spans, setSpans] = useState<Record<string, { md: number; xl: number }>>(() => {
    const initial: Record<string, { md: number; xl: number }> = {};
    for (const config of BENTO_CONFIGS) {
      initial[config.id] = { md: config.defaultMdSpan, xl: config.defaultXlSpan };
    }
    return initial;
  });

  const configMap = useMemo(() => {
    return BENTO_CONFIGS.reduce<Record<string, BentoConfig>>((acc, config) => {
      acc[config.id] = config;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    if (!activeResizeId) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!containerRef.current) {
        return;
      }

      const deltaX = event.clientX - resizeStartX;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const mdColWidth = containerWidth / 2;
      const xlColWidth = containerWidth / 4;
      const mdDeltaCols = Math.round(deltaX / mdColWidth);
      const xlDeltaCols = Math.round(deltaX / xlColWidth);

      setSpans((previous) => ({
        ...previous,
        [activeResizeId]: {
          md: clamp(resizeStartMdSpan + mdDeltaCols, 1, 2),
          xl: clamp(resizeStartXlSpan + xlDeltaCols, 1, 4),
        },
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
  }, [activeResizeId, resizeStartMdSpan, resizeStartX, resizeStartXlSpan]);

  const renderCard = (id: string) => {
    if (id === "hero") return <HeroCard />;
    if (id === "about") return <AboutCard />;
    if (id === "currently") {
      return (
        <div className="flex flex-col justify-center items-center h-full text-center">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Currently</p>
          <p className="text-sm text-foreground font-medium">Building AI-powered systems</p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-xs text-muted-foreground">Available for work</span>
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

  const reorderCards = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      return;
    }

    setOrder((previous) => {
      const next = [...previous];
      const sourceIndex = next.indexOf(sourceId);
      const targetIndex = next.indexOf(targetId);
      if (sourceIndex === -1 || targetIndex === -1) {
        return previous;
      }
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const getSpanClasses = (id: string) => {
    const span = spans[id] ?? { md: 1, xl: 1 };
    const mdClass = span.md === 2 ? "md:col-span-2" : "";
    const xlClass =
      span.xl === 4
        ? "xl:col-span-4"
        : span.xl === 3
          ? "xl:col-span-3"
          : span.xl === 2
            ? "xl:col-span-2"
            : "";
    return `${mdClass} ${xlClass}`.trim();
  };

  const beginResize = (event: React.PointerEvent<HTMLDivElement>, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    const currentSpan = spans[id] ?? { md: 1, xl: 1 };
    setActiveResizeId(id);
    setResizeStartX(event.clientX);
    setResizeStartMdSpan(currentSpan.md);
    setResizeStartXlSpan(currentSpan.xl);
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="fixed top-4 right-4 z-30 md:top-6 md:right-6">
        <ThemeToggle />
      </div>

      {/* Ambient glow blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Bento Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-auto">
          {order.map((id) => {
            const config = configMap[id];
            if (!config) {
              return null;
            }

            return (
              <div
                key={id}
                draggable={!activeResizeId}
                onDragStart={(event) => {
                  setDraggedId(id);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedId) {
                    reorderCards(draggedId, id);
                  }
                  setDraggedId(null);
                }}
                onDragEnd={() => {
                  setDraggedId(null);
                }}
                className={`relative ${getSpanClasses(id)}`}
              >
                <BentoCard
                  className={`${config.minHeightClass} ${draggedId === id ? "cursor-grabbing" : "cursor-grab"}`}
                  glowColor={config.glowColor}
                  delay={config.delay}
                >
                  {renderCard(id)}
                </BentoCard>

                <div
                  onPointerDown={(event) => {
                    beginResize(event, id);
                  }}
                  className="absolute right-0 top-0 z-30 h-full w-3 cursor-ew-resize"
                  aria-label="Resize card width"
                  role="separator"
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            © 2024 TienDat8605 — Built with passion
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
