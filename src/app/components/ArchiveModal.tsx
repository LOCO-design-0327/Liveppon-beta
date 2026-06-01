import { X, Archive, Save, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import type { Sale } from "../types";

interface ArchiveItem {
  id: string;
  name: string;
  savedAt: Date;
  sales: Sale[];
  totalRevenue: number;
  totalCount: number;
  cashRevenue: number;
  qrRevenue: number;
}

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  archives: ArchiveItem[];
  currentSales: Sale[];
  onSaveArchive: (name: string) => void;
  onDeleteArchive: (archiveId: string) => void;
}

export function ArchiveModal({
  isOpen,
  onClose,
  archives,
  currentSales,
  onSaveArchive,
  onDeleteArchive,
}: ArchiveModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [archiveName, setArchiveName] = useState("");
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(
    null
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (!archiveName.trim()) {
      alert("アーカイブ名を入力してください");
      return;
    }
    onSaveArchive(archiveName);
    setArchiveName("");
    setIsSaving(false);
  };

  const handleDelete = (archiveId: string) => {
    if (
      confirm(
        "このアーカイブを削除しますか？この操作は取り消せません。"
      )
    ) {
      onDeleteArchive(archiveId);
      setSelectedArchive(null);
    }
  };

  if (selectedArchive) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-background border border-border rounded-lg w-[800px] max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2>{selectedArchive.name}</h2>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedArchive.savedAt).toLocaleString("ja-JP")}
              </p>
            </div>
            <button
              onClick={() => setSelectedArchive(null)}
              className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-card p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  総売上
                </div>
                <div className="text-xl text-primary">
                  ¥{selectedArchive.totalRevenue.toLocaleString()}
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  販売件数
                </div>
                <div className="text-xl text-primary">
                  {selectedArchive.totalCount}件
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  現金売上
                </div>
                <div className="text-xl text-primary">
                  ¥{selectedArchive.cashRevenue.toLocaleString()}
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  QR売上
                </div>
                <div className="text-xl text-primary">
                  ¥{selectedArchive.qrRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            <h3 className="mb-3">販売履歴</h3>
            <div className="space-y-2">
              {selectedArchive.sales.map((sale) => (
                <div
                  key={sale.id}
                  className={`p-3 rounded-lg border ${
                    sale.isCancelled
                      ? "bg-destructive/10 border-destructive/30"
                      : "bg-card border-border"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(sale.timestamp).toLocaleTimeString("ja-JP")}
                      {sale.isCancelled && (
                        <span className="text-destructive ml-2">
                          [キャンセル済み]
                        </span>
                      )}
                    </div>
                    <div className="text-primary">
                      ¥{sale.total.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {sale.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-muted-foreground flex justify-between"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-border flex gap-2">
            <button
              onClick={() => handleDelete(selectedArchive.id)}
              className="px-6 py-3 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30"
            >
              削除
            </button>
            <button
              onClick={() => setSelectedArchive(null)}
              className="flex-1 py-3 bg-secondary rounded-lg hover:bg-secondary/80"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[700px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Archive className="w-6 h-6 text-primary" />
            <h2>イベントアーカイブ</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isSaving ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  アーカイブ名
                </label>
                <input
                  type="text"
                  value={archiveName}
                  onChange={(e) => setArchiveName(e.target.value)}
                  placeholder="例: side REAL 2026"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg"
                  autoFocus
                />
              </div>
              <div className="text-sm text-muted-foreground">
                現在の販売履歴{currentSales.length}件を保存します
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsSaving(false);
                    setArchiveName("");
                  }}
                  className="flex-1 py-2 bg-secondary rounded-lg hover:bg-secondary/80"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentSales.length > 0 && (
                <button
                  onClick={() => setIsSaving(true)}
                  className="w-full py-3 mb-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  販売履歴をアーカイブ保存
                </button>
              )}

              {archives.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">保存済みアーカイブはありません</p>
                  <p className="text-sm">
                    イベント終了後に販売履歴を保存すると、ここに表示されます
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {archives.map((archive) => (
                    <div
                      key={archive.id}
                      className="p-4 bg-card rounded-lg hover:bg-card/80 cursor-pointer"
                      onClick={() => setSelectedArchive(archive)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="mb-1">{archive.name}</h3>
                          <div className="text-xs text-muted-foreground">
                            保存日：
                            {new Date(archive.savedAt).toLocaleString("ja-JP")}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(archive.id);
                          }}
                          className="w-8 h-8 rounded bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-primary">
                            ¥{archive.totalRevenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          {archive.totalCount}件
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
