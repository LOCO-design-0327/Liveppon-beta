import { X, Upload, Trash2, QrCode } from "lucide-react";
import { useRef } from "react";

interface QRSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeImage?: string;
  onUpdateQRCode: (imageData: string | undefined) => void;
  onLogOperation?: (operation: string, content: string) => void;
}

export function QRSettingsModal({
  isOpen,
  onClose,
  qrCodeImage,
  onUpdateQRCode,
  onLogOperation,
}: QRSettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      onUpdateQRCode(imageData);
      if (onLogOperation) {
        onLogOperation(
          "QRコード画像設定",
          qrCodeImage ? "QRコード画像を変更" : "QRコード画像を登録"
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (confirm("QRコード画像を削除しますか？")) {
      onUpdateQRCode(undefined);
      if (onLogOperation) {
        onLogOperation("QRコード画像削除", "QRコード画像を削除");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg w-[600px] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">          <div className="flex items-center gap-2">
          <QrCode className="w-6 h-6 text-primary" />
          <h2>QRコード設定</h2>
        </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded hover:bg-secondary flex items-center justify-center"          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {qrCodeImage ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-8 flex items-center justify-center">
                <img
                  src={qrCodeImage}
                  alt="QRコード"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                決済画面でこのQRコードが表示されます
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-lg p-12 text-center">
              <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                QRコードが登録されていません
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              QR画像を選択
            </button>
            {qrCodeImage && (
              <button
                onClick={handleDelete}
                className="py-3 px-6 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                削除
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={onClose}
            className="w-full py-3 bg-secondary rounded-lg hover:bg-secondary/80"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
