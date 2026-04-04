import React, { useEffect, useRef, useState } from 'react';
import { GitCommit, Star } from 'lucide-react';

const useCountUp = (end: number, duration = 2000, trigger = false) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, trigger]);

  return count;
};

const StatsCard: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const total = useCountUp(562, 2000, visible);
  const year = useCountUp(426, 2000, visible);
  const repos = useCountUp(30, 1500, visible);

  return (
    <div ref={ref} className="flex flex-col justify-between h-full gap-4">
      <div className="flex items-center gap-2">
        <GitCommit className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">GitHub Stats</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <p className="text-2xl font-bold font-mono text-primary">{total}+</p>
          <p className="text-[10px] text-muted-foreground mt-1">Total Contributions</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <p className="text-2xl font-bold font-mono text-accent">{year}</p>
          <p className="text-[10px] text-muted-foreground mt-1">This Year</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <p className="text-2xl font-bold font-mono text-glow-blue">{repos}+</p>
          <p className="text-[10px] text-muted-foreground mt-1">Repositories</p>
        </div>
      </div>

      {/* Mini contribution graph */}
      <div className="flex gap-0.5 justify-center flex-wrap">
        {Array.from({ length: 52 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {Array.from({ length: 7 }).map((_, j) => {
              const intensity = Math.random();
              return (
                <div
                  key={j}
                  className="w-2 h-2 rounded-[2px] transition-colors"
                  style={{
                    backgroundColor: intensity > 0.7
                      ? 'hsl(180 80% 50% / 0.8)'
                      : intensity > 0.4
                        ? 'hsl(180 80% 50% / 0.4)'
                        : intensity > 0.2
                          ? 'hsl(180 80% 50% / 0.15)'
                          : 'hsl(220 15% 12%)',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
