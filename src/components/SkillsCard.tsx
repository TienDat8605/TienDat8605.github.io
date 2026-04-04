import React from "react";
import { Code2 } from "lucide-react";

const languages = ["C++", "Java", "Go", "Python", "JavaScript"];
const frameworks = ["Spring Boot", "Gin", "Express.js", "FastAPI"];
const tools = ["Docker", "PostgreSQL", "Redis", "MongoDB"];

const SkillBadge: React.FC<{ name: string }> = ({ name }) => (
  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-secondary text-secondary-foreground border border-border hover:border-primary/50 hover:glow-cyan hover:text-primary transition-all duration-300 cursor-default">
    {name}
  </span>
);

const SkillsCard: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <Code2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">Tech Stack</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Languages</p>
          <div className="flex flex-wrap gap-2">
            {languages.map((s) => (
              <SkillBadge key={s} name={s} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Frameworks</p>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((s) => (
              <SkillBadge key={s} name={s} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Tools</p>
          <div className="flex flex-wrap gap-2">
            {tools.map((s) => (
              <SkillBadge key={s} name={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsCard;
