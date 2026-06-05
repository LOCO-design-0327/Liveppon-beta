import { X, Download, Upload, Database } from "lucide-react";
import { useRef, useState } from "react";

interface BackupData {
  version: string;
  exportDate: string;
  products: any[];
  sales: any[];
  scenes: any[];
  archives: any[];
  qrCodeImage?: string;
  operationLogs: any[];
}

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => BackupData;
  onImport: (data: BackupData) => void;
  lastBackupAt: string | null;
}

export function BackupModal({
  isOpen,
  onClose,
  onExport,
  onImport,
  lastBackupAt,
}: BackupModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = onExport();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `liveppon_backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (
          confirm(
            "現在のデータを上書きして、バックアップを読み込みますか？"
          )
        ) {
          onImport(data);
          onClose();
        }
      } catch (error) {
        alert("バックアップファイルの読み込みに失敗しました");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-background border border-border rounded-lg w-[600px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />

            <h2>バックアップ</h2>

            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="text-primary hover:text-primary/80"
            >
              ⓘ
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            本番前・本番後・大きな変更前に
            バックアップを保存してください。
          </p>

          <p className="text-xs text-muted-foreground">
            データの保存・復元ができます。
          </p>

          <div className="text-sm text-gray-400">
            {lastBackupAt
              ? `最終バックアップ：${new Date(lastBackupAt).toLocaleString("ja-JP")}`
              : "最終バックアップ：未保存"}
          </div>

          <button
            onClick={handleExport}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            バックアップを書き出す
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-secondary rounded-lg hover:bg-secondary/80 flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            バックアップを読み込む
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <button
            onClick={onClose}
            className="w-full py-3 bg-card rounded-lg hover:bg-card/80"
          >
            戻る
          </button>
        </div>
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-background border border-border rounded-lg w-[560px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              バックアップとは？
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="text-primary font-semibold mb-1">
                  何の機能か
                </h3>

                <p className="text-muted-foreground">
                  Livepponのデータを保存し、将来の復元に利用できる機能です。
                </p>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-1">
                  できること
                </h3>

                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ バックアップ書き出し</li>
                  <li>✓ バックアップ読込</li>
                  <li>✓ データ復元</li>
                </ul>

                <p className="mt-3 text-muted-foreground">
                  保存対象
                </p>

                <ul className="space-y-1 text-muted-foreground mt-1">
                  <li>✓ 商品一覧</li>
                  <li>✓ 販売履歴</li>
                  <li>✓ シーン</li>
                  <li>✓ QRコード設定</li>
                  <li>✓ 操作ログ</li>
                </ul>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-1">
                  注意事項
                </h3>

                <p className="text-muted-foreground">
                  イベント前・イベント後・大きな変更前・アップデート前に
                  バックアップ取得を推奨します。
                </p>

                <p className="text-muted-foreground mt-2">
                  バックアップを保存していない場合、端末故障時にデータを復元できません。
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 rounded-lg bg-primary text-primary-foreground"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
