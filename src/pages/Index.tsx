import React from 'react';
import BentoCard from '@/components/BentoCard';
import HeroCard from '@/components/HeroCard';
import AboutCard from '@/components/AboutCard';
import SkillsCard from '@/components/SkillsCard';
import ProjectCard, { projects } from '@/components/ProjectCard';
import StatsCard from '@/components/StatsCard';
import ContactCard from '@/components/ContactCard';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="fixed top-4 right-4 z-30 md:top-6 md:right-6">
        <ThemeToggle />
      </div>

      {/* Ambient glow blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {/* Hero - spans 2 cols */}
          <BentoCard className="md:col-span-2 min-h-[220px]" glowColor="cyan" delay={0}>
            <HeroCard />
          </BentoCard>

          {/* About */}
          <BentoCard className="min-h-[220px]" glowColor="purple" delay={100}>
            <AboutCard />
          </BentoCard>

          {/* Tech Stack - full width */}
          <BentoCard className="md:col-span-2 lg:col-span-3" glowColor="blue" delay={200}>
            <SkillsCard />
          </BentoCard>

          {/* Kompas - featured large */}
          <BentoCard className="md:col-span-2 min-h-[200px]" glowColor="cyan" delay={300}>
            <ProjectCard {...projects[0]} />
          </BentoCard>

          {/* Search Engine */}
          <BentoCard className="min-h-[200px]" glowColor="purple" delay={400}>
            <ProjectCard {...projects[1]} />
          </BentoCard>

          {/* Medigent */}
          <BentoCard className="min-h-[200px]" glowColor="blue" delay={500}>
            <ProjectCard {...projects[2]} />
          </BentoCard>

          {/* FoodApp */}
          <BentoCard className="min-h-[200px]" glowColor="cyan" delay={600}>
            <ProjectCard {...projects[3]} />
          </BentoCard>

          {/* ncs-visualizer */}
          <BentoCard className="min-h-[200px]" glowColor="purple" delay={650}>
            <ProjectCard {...projects[4]} />
          </BentoCard>

          {/* Knowledge Distillation */}
          <BentoCard className="min-h-[200px]" glowColor="blue" delay={700}>
            <ProjectCard {...projects[5]} />
          </BentoCard>

          {/* GitHub Stats */}
          <BentoCard className="min-h-[200px]" glowColor="purple" delay={750}>
            <StatsCard />
          </BentoCard>

          {/* Contact */}
          <BentoCard className="lg:col-span-2" glowColor="cyan" delay={850}>
            <ContactCard />
          </BentoCard>

          {/* Stats small */}
          <BentoCard className="min-h-[120px]" glowColor="blue" delay={950}>
            <div className="flex flex-col justify-center items-center h-full text-center">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Currently</p>
              <p className="text-sm text-foreground font-medium">Building AI-powered systems</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
                <span className="text-xs text-muted-foreground">Available for work</span>
              </div>
            </div>
          </BentoCard>
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
