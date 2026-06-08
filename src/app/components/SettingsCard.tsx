import { LucideIcon, Lock } from "lucide-react";

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isLocked?: boolean;
  isDangerous?: boolean;
  onClick: () => void;
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  isLocked = false,
  isDangerous = false,
  onClick,
}: SettingsCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-square rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${isDangerous
        ? "bg-destructive/10 border-2 border-destructive/50 hover:bg-destructive/20"
        : isLocked
          ? "bg-card/50 hover:bg-card/70"
          : "bg-card hover:bg-card/80"
        }`}
    >
      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-3 h-3 text-muted-foreground" />
        </div>
      )}

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDangerous
          ? "bg-destructive/20"
          : isLocked
            ? "bg-muted"
            : "bg-primary/20"
          }`}
      >
        {isLocked ? (
          <Lock className="w-6 h-6 text-muted-foreground" />
        ) : (
          <Icon
            className={`w-6 h-6 ${isDangerous ? "text-destructive" : "text-primary"}`}
          />
        )}
      </div>

      <h4
        className={`mb-2 text-base font-semibold ${isLocked
          ? "text-muted-foreground"
          : isDangerous
            ? "text-destructive"
            : ""
          }`}
      >
        {title}
      </h4>
      <p
        className={`text-xs leading-relaxed ${isLocked
            ? "text-muted-foreground/70"
            : "text-muted-foreground"
          }`}
      >
        {description}
      </p>
    </button>
  );
}
