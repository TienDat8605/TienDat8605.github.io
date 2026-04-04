import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'blue';
  delay?: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className, glowColor = 'cyan', delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    }
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const glowColors = {
    cyan: 'hsl(180 80% 50% / 0.12)',
    purple: 'hsl(260 60% 55% / 0.12)',
    blue: 'hsl(210 80% 55% / 0.12)',
  };

  return (
    <div
      ref={setRef}
      className={cn(
        'relative rounded-xl bg-card overflow-hidden transition-transform duration-300 ease-out gradient-border',
        isVisible ? 'animate-fade-up' : 'opacity-0',
        className
      )}
      style={{
        transform,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColors[glowColor]}, transparent 60%)`,
        }}
      />
      <div className="relative z-20 h-full p-6">
        {children}
      </div>
    </div>
  );
};

export default BentoCard;
