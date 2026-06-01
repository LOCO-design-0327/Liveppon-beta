import { X, AlertCircle } from "lucide-react";
import { useState } from "react";

interface CancelReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, shouldRestoreStock: boolean) => void;
  saleName: string;
}

export function CancelReasonModal({
  isOpen,
  onClose,
  saleName,
  onConfirm,
}: CancelReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState("入力ミス");

  if (!isOpen) return null;

  const reasons = [
    { label: "お客様都合", restoreStock: true },
    { label: "入力ミス", restoreStock: true },
    { label: "製品不良", restoreStock: false },
    { label: "重複決済", restoreStock: true },
    { label: "決済失敗", restoreStock: true },
    { label: "その他", restoreStock: true },
  ];

  const handleConfirm = () => {
    const reason = reasons.find((r) => r.label === selectedReason);
    if (reason) {
      onConfirm(reason.label, reason.restoreStock);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[500px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h2>販売キャンセル</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm mb-2">この販売をキャンセルしますか？</p>
            <p className="text-sm text-muted-foreground">{saleName}</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              キャンセル理由
            </label>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label
                  key={reason.label}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg cursor-pointer hover:bg-card/80"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason.label}
                    checked={selectedReason === reason.label}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>{reason.label}</span>
                  {!reason.restoreStock && (
                    <span className="text-xs text-warning ml-auto">
                      在庫復元なし
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            キャンセル理由によって在庫復元の有無が変わります。この操作は操作ログに記録されます。
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
            >
              キャンセル実行
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-secondary rounded-lg hover:bg-secondary/80"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
