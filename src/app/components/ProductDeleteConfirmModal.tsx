interface ProductDeleteConfirmModalProps {
  isOpen: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ProductDeleteConfirmModal({
  isOpen,
  count,
  onCancel,
  onConfirm,
}: ProductDeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]"
      onClick={onCancel}
    >
      <div
        className="w-[420px] bg-background border border-border rounded-lg p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-3">商品を削除します</h2>
        <p className="text-sm text-muted-foreground mb-6">
          選択中の商品{count}件を削除します。
          <br />
          この操作は取り消せません。
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-secondary hover:bg-secondary/80"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
