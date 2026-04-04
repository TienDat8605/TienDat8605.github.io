import React, { useState, useEffect } from 'react';
import { Github, MapPin } from 'lucide-react';

const roles = ['Backend Developer', 'AI Engineer', 'CS Student'];

const HeroCard: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < currentRole.length) {
      timeout = setTimeout(() => setDisplayed(currentRole.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <div className="flex flex-col justify-between h-full gap-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-mono text-primary mb-2 tracking-wider uppercase">Portfolio</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-3">
            Tien Dat
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">Ho Chi Minh City, Vietnam</span>
          </div>
          <div className="h-8 flex items-center">
            <span className="font-mono text-lg text-foreground">
              {displayed}
            </span>
            <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-glow-pulse" />
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden glow-cyan">
            <img
              src="https://avatars.githubusercontent.com/u/117081981"
              alt="TienDat8605"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <a
        href="https://github.com/TienDat8605"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
      >
        <Github className="w-4 h-4" />
        github.com/TienDat8605
      </a>
    </div>
  );
};

export default HeroCard;
