import { X, FileText, Download, Trash2 } from "lucide-react";

export interface OperationLog {
  id: string;
  timestamp: Date;
  operation: string;
  content: string;
  before?: string;
  after?: string;
}

interface OperationLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: OperationLog[];
  onExportCSV: () => void;
  onClearLogs: () => void;
}

export function OperationLogModal({
  isOpen,
  onClose,
  logs,
  onExportCSV,
  onClearLogs,
}: OperationLogModalProps) {
  if (!isOpen) return null;

  const handleClear = () => {
    if (
      confirm(
        "操作ログをすべて削除しますか？この操作は取り消せません。"
      )
    ) {
      onClearLogs();
    }
  };

  const handleExportWithPrompt = () => {
    onExportCSV();
    if (
      logs.length > 0 &&
      confirm("操作ログを書き出しました。今までのログを削除しますか？")
    ) {
      onClearLogs();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[800px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h2>操作ログ</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>操作ログはありません</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-card rounded-lg border border-border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString("ja-JP")}
                    </div>
                    <div className="text-sm px-2 py-1 bg-primary/20 text-primary rounded">
                      {log.operation}
                    </div>
                  </div>
                  <div className="text-sm mb-2">{log.content}</div>
                  {(log.before || log.after) && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      {log.before && <div>変更前：{log.before}</div>}
                      {log.after && <div>変更後：{log.after}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border flex gap-2">
          <button
            onClick={handleExportWithPrompt}
            disabled={logs.length === 0}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            CSV出力
          </button>
          <button
            onClick={handleClear}
            disabled={logs.length === 0}
            className="px-6 py-3 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
