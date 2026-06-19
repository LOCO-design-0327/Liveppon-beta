import { X } from "lucide-react";
import type { SalesStyle } from "../types";

interface SalesStyleModalProps {
  isOpen: boolean;
  onSelect: (style: SalesStyle) => void;
  onClose?: () => void;
}

export function SalesStyleModal({
  isOpen,
  onSelect,
  onClose,
}: SalesStyleModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70]"
      onClick={() => onClose?.()}
    >
      <div
        className="bg-background border border-border rounded-lg w-[640px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">
              販売スタイルを選択
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Livepponの使い方に合わせて、販売スタイルを選んでください。
              <br />
              後から設定画面で変更できます。
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSelect("single")}
            className="relative min-h-48 rounded-lg bg-card hover:bg-card/80 border border-border p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute right-4 top-4 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
              おすすめ
            </span>

            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-lg font-bold mb-3">
              一人で販売する
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              自分で準備から販売まで行う方向け
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelect("team")}
            className="min-h-48 rounded-lg bg-card hover:bg-card/80 border border-border p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-lg font-bold mb-3">
              複数スタッフで販売する
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              販売担当と管理担当を分ける方向け
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
