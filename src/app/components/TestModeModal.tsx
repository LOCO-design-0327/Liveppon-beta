import { X, FlaskConical, AlertCircle } from "lucide-react";

interface TestModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTestMode: boolean;
  onToggleTestMode: () => void;
}

export function TestModeModal({
  isOpen,
  onClose,
  isTestMode,
  onToggleTestMode,
}: TestModeModalProps) {
  if (!isOpen) return null;

  const handleToggle = () => {
    onToggleTestMode();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg w-[600px] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" />
            <h2>テストモード</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded hover:bg-secondary flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-card rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="mb-2">
                テストモードでは、販売操作を練習できます。
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>販売履歴に記録されません</li>
                <li>在庫が減りません</li>
                <li>決済画面の確認ができます</li>
                <li>スタッフ教育に最適です</li>
              </ul>
            </div>
          </div>

          {isTestMode ? (
            <div className="space-y-4">
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-center">
                <p className="text-warning">現在テストモード中です</p>
              </div>
              <button
                onClick={handleToggle}
                className="w-full py-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
              >
                テストモードを終了
              </button>
            </div>
          ) : (
            <button
              onClick={handleToggle}
              className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              テストモードを開始
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-secondary rounded-lg hover:bg-secondary/80"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
