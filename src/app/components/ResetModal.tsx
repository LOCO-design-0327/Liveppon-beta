import { X, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export function ResetModal({ isOpen, onClose, onReset }: ResetModalProps) {
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const handleReset = () => {
    if (confirmText !== "初期化") {
      alert("確認テキストが正しくありません");
      return;
    }

    if (
      confirm(
        "本当にすべてのデータを削除しますか？この操作は取り消せません。"
      )
    ) {
      onReset();
      setConfirmText("");
      onClose();
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border-2 border-destructive rounded-lg w-[600px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-destructive" />
            <h2 className="text-destructive">データ初期化</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
            <div className="text-sm">
              <p className="text-destructive mb-2">
                この操作により、以下のすべてのデータが削除されます：
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>商品一覧</li>
                <li>販売履歴</li>
                <li>操作ログ</li>
                <li>シーン</li>
                <li>イベントアーカイブ</li>
                <li>QRコード設定</li>
                <li>カート内容</li>
              </ul>
              <p className="text-destructive mt-3">
                この操作は取り消せません。
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              確認のため「初期化」と入力してください
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="初期化"
              className="w-full px-4 py-2 bg-card border border-border rounded-lg"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={confirmText !== "初期化"}
              className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              初期化する
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-secondary rounded-lg hover:bg-secondary/80"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
