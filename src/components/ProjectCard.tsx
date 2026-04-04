import React from 'react';
import { ExternalLink, Trophy, Search, HeartPulse, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  highlight?: string;
  icon: React.ReactNode;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectProps> = ({ title, description, tags, link, highlight, icon, featured }) => {
  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-secondary text-primary">{icon}</div>
            <h3 className="font-bold text-base">{title}</h3>
          </div>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        {highlight && (
          <div className="mb-3">
            <Badge variant="outline" className="border-primary/40 text-primary text-xs font-mono">
              <Trophy className="w-3 h-3 mr-1" />
              {highlight}
            </Badge>
          </div>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export const projects: ProjectProps[] = [
  {
    title: 'Kompas',
    description: 'AI-powered travel planning platform using GraphRAG for multimodal context understanding and personalized recommendations.',
    tags: ['GraphRAG', 'AI', 'Python', 'Travel'],
    link: 'https://github.com/TienDat8605',
    highlight: 'Runner-up — Lotus Hackathon',
    icon: <Trophy className="w-4 h-4" />,
    featured: true,
  },
  {
    title: 'Search Engine',
    description: 'Semantic search engine with AI-generated summaries. Achieved 30% accuracy improvement over baseline.',
    tags: ['NLP', 'Python', 'Search', 'AI'],
    link: 'https://github.com/TienDat8605',
    icon: <Search className="w-4 h-4" />,
  },
  {
    title: 'Medigent',
    description: 'AI health assistant backend with service-layer architecture for scalable medical advice processing.',
    tags: ['Spring Boot', 'AI', 'Healthcare'],
    link: 'https://github.com/TienDat8605',
    icon: <HeartPulse className="w-4 h-4" />,
  },
  {
    title: 'FoodApp',
    description: 'Real-time food ordering system with optimized database schema and order processing pipeline.',
    tags: ['Java', 'PostgreSQL', 'Real-time'],
    link: 'https://github.com/TienDat8605',
    icon: <UtensilsCrossed className="w-4 h-4" />,
  },
];

export default ProjectCard;
