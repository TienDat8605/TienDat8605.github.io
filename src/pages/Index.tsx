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
  defaultWidth: number;
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

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<string[]>(() =>
    BENTO_CONFIGS.map((config) => config.id),
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
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

      const deltaX = event.clientX - resizeStartX;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const deltaPercent = (deltaX / containerWidth) * 100;

      setSpans((previous) => ({
        ...previous,
        [activeResizeId]: clamp(resizeStartWidth + deltaPercent, 18, 100),
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
        <div className="flex flex-col justify-center items-center h-full text-center">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
            Currently
          </p>
          <p className="text-sm text-foreground font-medium">
            Building AI-powered systems
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
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

  const beginResize = (
    event: React.PointerEvent<HTMLDivElement>,
    id: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const currentWidth = widths[id] ?? 24;
    setActiveResizeId(id);
    setResizeStartX(event.clientX);
    setResizeStartWidth(currentWidth);
  };

  const isMobile = viewportWidth < 768;

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
        <div ref={containerRef} className="flex flex-wrap gap-4 items-stretch">
          {order.map((id) => {
            const config = configMap[id];
            if (!config) {
              return null;
            }

            const itemWidth = isMobile ? 100 : widths[id] ?? config.defaultWidth;

            return (
              <div
                key={id}
                draggable={!activeResizeId}
                onDragStart={(event) => {
                  setDraggedId(id);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", id);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDragEnter={(event) => {
                  event.preventDefault();
                  if (draggedId) {
                    reorderCards(draggedId, id);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDraggedId(null);
                }}
                onDragEnd={() => {
                  setDraggedId(null);
                }}
                style={{
                  flexBasis: `calc(${itemWidth}% - 1rem)`,
                  maxWidth: `calc(${itemWidth}% - 1rem)`,
                }}
                className={`relative transition-[transform,flex-basis,max-width,opacity] duration-300 ease-out ${draggedId === id ? "opacity-70 scale-[0.99]" : "opacity-100"}`}
              >
                <BentoCard
                  className={`h-[250px] ${draggedId === id ? "cursor-grabbing" : "cursor-grab"}`}
                  glowColor={config.glowColor}
                  delay={config.delay}
                >
                  {renderCard(id)}
                </BentoCard>

                <div
                  onPointerDown={(event) => {
                    beginResize(event, id);
                  }}
                  className="absolute right-0 top-0 z-30 h-full w-4 cursor-ew-resize hidden md:block"
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
