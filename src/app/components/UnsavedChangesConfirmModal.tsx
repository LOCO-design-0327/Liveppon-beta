interface UnsavedChangesConfirmModalProps {
  isOpen: boolean;
  onDiscard: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function UnsavedChangesConfirmModal({
  isOpen,
  onDiscard,
  onSave,
  onCancel,
}: UnsavedChangesConfirmModalProps) {
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
        <h2 className="mb-3">未保存の変更があります</h2>
        <p className="text-sm text-muted-foreground mb-6">
          変更内容を保存しますか？
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onDiscard}
            className="flex-1 py-3 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30"
          >
            破棄
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            保存
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-secondary hover:bg-secondary/80"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
