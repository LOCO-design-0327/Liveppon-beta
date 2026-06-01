import { X, KeyRound } from "lucide-react";
import { useState } from "react";

interface OwnerPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => boolean;
  title?: string;
}

export function OwnerPinModal({
  isOpen,
  onClose,
  onVerify,
  title = "オーナーモード",
}: OwnerPinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (pin.length !== 6) {
      setError("6桁のPINを入力してください");
      return;
    }

    if (onVerify(pin)) {
      setPin("");
      setError("");
      onClose();
    } else {
      setError("PINが正しくありません");
      setPin("");
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError("");

      if (newPin.length === 6) {
        if (onVerify(newPin)) {
          setPin("");
          onClose();
        } else {
          setError("PINが正しくありません");
          setPin("");
        }
      }
    }
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[400px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-primary" />
            <h2>{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-sm text-muted-foreground mb-2">
              6桁のPINを入力してください
            </div>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded border-2 flex items-center justify-center ${
                    pin.length > i
                      ? "border-primary bg-primary/20"
                      : "border-border"
                  }`}
                >
                  {pin.length > i && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
            {error && (
              <div className="text-sm text-destructive mt-2">{error}</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="h-14 bg-card hover:bg-card/80 rounded-lg text-xl"
              >
                {num}
              </button>
            ))}
            <div className="h-14"></div>
            <button
              onClick={() => handleKeyPress("0")}
              className="h-14 bg-card hover:bg-card/80 rounded-lg text-xl"
            >
              0
            </button>
            <button
              onClick={handleClear}
              className="h-14 bg-secondary hover:bg-secondary/80 rounded-lg"
            >
              クリア
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
