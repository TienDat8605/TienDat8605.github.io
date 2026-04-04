import React from 'react';
import { Github, Linkedin, Facebook, Mail } from 'lucide-react';

const socials = [
  { icon: <Github className="w-5 h-5" />, href: 'https://github.com/TienDat8605', label: 'GitHub' },
  { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com/in/tiendat8605', label: 'LinkedIn' },
  { icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com', label: 'Facebook' },
  { icon: <Mail className="w-5 h-5" />, href: 'mailto:tiendat8605@gmail.com', label: 'Email' },
];

const ContactCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div>
        <h2 className="text-lg font-bold mb-1">Let's Connect</h2>
        <p className="text-sm text-muted-foreground">Open for collaborations & opportunities</p>
      </div>
      <div className="flex gap-3">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:glow-cyan hover:border-primary/30 border border-border transition-all duration-300"
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactCard;
