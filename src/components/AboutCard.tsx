import React from 'react';
import { GraduationCap, Cpu } from 'lucide-react';

const AboutCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">About</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          CS student at <span className="text-foreground font-medium">VNUHCM – University of Science</span>, 
          Advanced Program. Passionate about building scalable backend systems, 
          AI-powered applications, and distributed architecture.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono animate-float">
        <Cpu className="w-3.5 h-3.5 text-accent" />
        <span>Systems & AI enthusiast</span>
      </div>
    </div>
  );
};

export default AboutCard;
