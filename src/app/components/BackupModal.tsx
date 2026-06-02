import { X, Download, Upload, Database } from "lucide-react";
import { useRef } from "react";

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
}

export function BackupModal({
  isOpen,
  onClose,
  onExport,
  onImport,
}: BackupModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            本番前・本番後・大きな変更前にバックアップを保存してください。
          </p>

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

          <div className="text-xs text-muted-foreground">
            <p className="mb-2">バックアップに含まれるデータ：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>商品一覧</li>
              <li>販売履歴</li>
              <li>シーン</li>
              <li>イベントアーカイブ</li>
              <li>QRコード設定</li>
              <li>操作ログ</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-card rounded-lg hover:bg-card/80"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
