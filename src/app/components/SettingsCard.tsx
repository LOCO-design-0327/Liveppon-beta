import { LucideIcon, Lock } from "lucide-react";

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isLocked?: boolean;
  isDisabled?: boolean;
  isDangerous?: boolean;
  statusLabel?: string;
  onClick: () => void;
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  isLocked = false,
  isDisabled = false,
  isDangerous = false,
  statusLabel,
  onClick,
}: SettingsCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative aspect-square rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all ${isDisabled ? "" : "hover:scale-[1.02] active:scale-[0.98]"} ${isDangerous
        ? "bg-destructive/10 border-2 border-destructive/50 hover:bg-destructive/20"
        : isDisabled
          ? "bg-card/50 cursor-not-allowed opacity-80"
          : isLocked
            ? "bg-card/50 hover:bg-card/70"
            : "bg-card hover:bg-card/80"
        }`}
    >
      {statusLabel && (
        <div className="absolute top-2 right-2 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-semibold text-warning">
          {statusLabel}
        </div>
      )}

      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-3 h-3 text-muted-foreground" />
        </div>
      )}

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDangerous
          ? "bg-destructive/20"
          : isDisabled
            ? "bg-muted"
            : isLocked
              ? "bg-muted"
              : "bg-primary/20"
          }`}
      >
        {isLocked ? (
          <Lock className="w-6 h-6 text-muted-foreground" />
        ) : (
          <Icon
            className={`w-6 h-6 ${isDangerous
              ? "text-destructive"
              : isDisabled
                ? "text-muted-foreground"
                : "text-primary"}`}
          />
        )}
      </div>

      <h4
        className={`mb-2 text-base font-semibold ${isLocked || isDisabled
          ? "text-muted-foreground"
          : isDangerous
            ? "text-destructive"
            : ""
          }`}
      >
        {title}
      </h4>
      <p
        className={`text-xs leading-relaxed ${isLocked || isDisabled
            ? "text-muted-foreground/70"
            : "text-muted-foreground"
          }`}
      >
        {description}
      </p>
    </button>
  );
}
