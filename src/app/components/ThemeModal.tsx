import { X, Palette, Moon, Sun } from "lucide-react";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: "dark" | "light";
  currentColor: string;
  onThemeChange: (theme: "dark" | "light") => void;
  onColorChange: (color: string) => void;
}

const themeColors = [
  "#39ff14",
  "#00d4ff",
  "#ff00ff",
  "#ffaa00",
  "#ff1493",
];

export function ThemeModal({
  isOpen,
  onClose,
  currentTheme,
  currentColor,
  onThemeChange,
  onColorChange,
}: ThemeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-background border border-border rounded-lg w-[600px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            <h2>テーマ設定</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="mb-4">表示モード</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onThemeChange("dark")}
                className={`p-4 rounded-lg border-2 transition-all ${currentTheme === "dark"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <Moon className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm text-center">ダークモード</div>
              </button>

              <button
                onClick={() => onThemeChange("light")}
                className={`p-4 rounded-lg border-2 transition-all ${currentTheme === "light"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <Sun className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm text-center">ライトモード</div>
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-4">テーマカラー</h3>
            <div className="flex justify-center gap-6">
              {themeColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={`relative transition-all hover:scale-110 ${currentColor === color ? "scale-110" : ""
                    }`}
                >
                  <div
                    className="w-16 h-16 rounded-full border-4 transition-all"
                    style={{
                      backgroundColor: color,
                      borderColor: currentColor === color ? color : "transparent",
                      opacity: currentColor === color ? 1 : 0.7,
                    }}
                  />
                  {currentColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
}
