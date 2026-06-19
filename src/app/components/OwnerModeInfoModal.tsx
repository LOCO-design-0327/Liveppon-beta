interface OwnerModeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function OwnerModeInfoModal({
  isOpen,
  onClose,
  onLogout,
}: OwnerModeInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg w-[560px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          オーナーモード
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="text-primary font-semibold mb-1">
              何の機能か
            </h3>
            <p className="text-muted-foreground">
              重要な設定やデータ管理機能をPINで保護する機能です。
            </p>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-1">
              できること
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ 商品設定</li>
              <li>✓ シーン管理</li>
              <li>✓ バックアップ</li>
              <li>✓ PIN変更</li>
              <li>✓ 初期化</li>
              <li>✓ 操作ログ確認</li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-1">
              注意事項
            </h3>
            <p className="text-muted-foreground">
              現在オーナーモードで動作中です。
            </p>
            <p className="text-muted-foreground mt-2">
              設定変更が終わったら、オーナーモードを終了してください。
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onLogout}
            className="flex-1 py-3 rounded-lg bg-destructive text-destructive-foreground"
          >
            オーナーモードを終了
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-card border border-border"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
