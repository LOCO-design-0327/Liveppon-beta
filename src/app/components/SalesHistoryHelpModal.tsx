interface SalesHistoryHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SalesHistoryHelpModal({
  isOpen,
  onClose,
}: SalesHistoryHelpModalProps) {
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
          販売履歴とは？
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="text-primary font-semibold mb-1">
              何の機能か
            </h3>

            <p className="text-muted-foreground">
              販売履歴を確認・検索できる機能です。
            </p>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-1">
              できること
            </h3>

            <ul className="space-y-1 text-muted-foreground">
              <li>✓ 販売履歴確認</li>
              <li>✓ 商品検索</li>
              <li>✓ 期間検索</li>
              <li>✓ 販売種別検索</li>
              <li>✓ CSV出力</li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-1">
              注意事項
            </h3>

            <p className="text-muted-foreground">
              履歴データは売上集計に利用されます。
            </p>

            <p className="text-muted-foreground mt-2">
              重要なデータはバックアップ取得を推奨します。
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-lg bg-primary text-primary-foreground"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
