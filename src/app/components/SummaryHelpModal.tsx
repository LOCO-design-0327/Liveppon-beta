interface SummaryHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SummaryHelpModal({
  isOpen,
  onClose,
}: SummaryHelpModalProps) {
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
          売上サマリーとは？
        </h2>

        <div className="space-y-4 text-sm">

          <div>
            <h3 className="text-primary font-semibold mb-1">
              何の機能か
            </h3>

            <p className="text-muted-foreground">
              売上データを集計し、
              イベント全体の状況を確認する機能です。
            </p>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-1">
              できること
            </h3>

            <ul className="space-y-1 text-muted-foreground">
              <li>✓ 総売上確認</li>
              <li>✓ 販売件数確認</li>
              <li>✓ 現金売上確認</li>
              <li>✓ QR売上確認</li>
              <li>✓ 売れ筋商品確認</li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-1">
              注意事項
            </h3>

            <p className="text-muted-foreground">
              売上サマリーは販売履歴をもとに
              自動集計されています。
            </p>

            <p className="text-muted-foreground mt-2">
              販売履歴を削除すると
              集計結果も変動します。
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
