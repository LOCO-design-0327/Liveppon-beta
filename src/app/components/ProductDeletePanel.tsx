import { Trash2 } from "lucide-react";

interface ProductDeletePanelProps {
  selectedCount: number;
  onDelete: () => void;
}

export function ProductDeletePanel({
  selectedCount,
  onDelete,
}: ProductDeletePanelProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="mb-4">削除モード</h2>

      <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        {selectedCount === 0 ? (
          <>
            <p className="mb-2 text-foreground">
              削除したい商品を選択してください
            </p>
            <p className="text-sm">
              左の商品カードをタップすると、
              <br />
              削除対象に追加されます。
            </p>
          </>
        ) : (
          <p className="text-foreground">{selectedCount}件選択中</p>
        )}
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={selectedCount === 0}
        className="w-full mt-6 py-4 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        削除
      </button>
    </div>
  );
}
