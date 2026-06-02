import { X, Key } from "lucide-react";
import { useState } from "react";

interface PinChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPin: string;
  onChangePin: (newPin: string) => void;
}

export function PinChangeModal({
  isOpen,
  onClose,
  currentPin,
  onChangePin,
}: PinChangeModalProps) {
  const [inputCurrentPin, setInputCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError("");

    if (inputCurrentPin !== currentPin) {
      setError("現在のPINが違います");
      return;
    }

    if (newPin.length !== 6) {
      setError("新しいPINは6桁で入力してください");
      return;
    }

    if (newPin !== confirmPin) {
      setError("新しいPINと確認用PINが一致しません");
      return;
    }

    onChangePin(newPin);
    setInputCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setInputCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-background border border-border rounded-lg w-[500px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Key className="w-6 h-6 text-primary" />
            <h2>PIN変更</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              現在のPIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={inputCurrentPin}
              onChange={(e) => setInputCurrentPin(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              新しいPIN (6桁)
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              新しいPIN確認
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              PINを変更
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-secondary rounded-lg hover:bg-secondary/80"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
