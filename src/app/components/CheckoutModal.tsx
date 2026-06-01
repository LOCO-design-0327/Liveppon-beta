import { X, Banknote, QrCode } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  paymentMethod: "cash" | "qr";
  qrCodeImage?: string;
  isOwnerMode: boolean;
  onComplete: (receivedAmount?: number) => void;
  onOpenQRSettings: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  total,
  paymentMethod,
  qrCodeImage,
  isOwnerMode,
  onComplete,
  onOpenQRSettings,
}: CheckoutModalProps) {
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const change = receivedAmount - total;

  const addAmount = (amount: number) => {
    setReceivedAmount((prev) => prev + amount);
  };

  const setExact = () => {
    setReceivedAmount(total);
  };

  const handleNumpadInput = (num: string) => {
    const newValue = inputValue + num;
    const amount = parseInt(newValue) || 0;
    setInputValue(newValue);
    setReceivedAmount(amount);
  };

  const handleClearInput = () => {
    setInputValue("");
    setReceivedAmount(0);
  };

  const handleComplete = () => {
    onComplete(paymentMethod === "cash" ? receivedAmount : undefined);
    setReceivedAmount(0);
    setInputValue("");
  };

  const handleQRImageClick = () => {
    if (!qrCodeImage) {
      onClose();
      onOpenQRSettings();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[90vw] max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="flex items-center gap-2">
            {paymentMethod === "cash" ? (
              <>
                <Banknote className="w-6 h-6 text-primary" />
                現金決済
              </>
            ) : (
              <>
                <QrCode className="w-6 h-6 text-primary" />
                QRコード決済
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 p-6 border-r border-border overflow-y-auto">
            <h3 className="mb-4">お会計内容</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm bg-card p-3 rounded"
                >
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ¥{item.price.toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                  <div>¥{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between">
                <span>合計金額</span>
                <span className="text-primary text-2xl">
                  ¥{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-6 flex flex-col">
            {paymentMethod === "qr" ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <button
                  onClick={handleQRImageClick}
                  disabled={!!qrCodeImage}
                  className={`w-64 h-64 bg-white rounded-lg flex items-center justify-center mb-6 p-4 ${
                    !qrCodeImage ? "hover:bg-gray-100 cursor-pointer" : ""
                  }`}
                >
                  {qrCodeImage ? (
                    <img
                      src={qrCodeImage}
                      alt="QRコード"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-black">
                      <QrCode className="w-32 h-32 mx-auto mb-4" />
                      <p className="text-sm mb-1">QRコード未設定</p>
                      <p className="text-xs text-gray-600">
                        QRコードを設定してください
                      </p>
                    </div>
                  )}
                </button>
                <div className="text-center mb-8">
                  <div className="text-sm text-muted-foreground mb-2">
                    お支払い金額
                  </div>
                  <div className="text-4xl text-primary">
                    ¥{total.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={handleComplete}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  決済完了
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    預かり金額
                  </div>
                  <div className="text-4xl text-primary">
                    ¥{receivedAmount.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumpadInput(num.toString())}
                      className="py-3 bg-card hover:bg-card/80 rounded-lg"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNumpadInput("00")}
                    className="py-3 bg-card hover:bg-card/80 rounded-lg"
                  >
                    00
                  </button>
                  <button
                    onClick={() => handleNumpadInput("0")}
                    className="py-3 bg-card hover:bg-card/80 rounded-lg"
                  >
                    0
                  </button>
                  <button
                    onClick={handleClearInput}
                    className="py-3 bg-secondary hover:bg-secondary/80 rounded-lg"
                  >
                    C
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  <button
                    onClick={() => addAmount(500)}
                    className="py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    ¥500
                  </button>
                  <button
                    onClick={() => addAmount(1000)}
                    className="py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    ¥1,000
                  </button>
                  <button
                    onClick={() => addAmount(5000)}
                    className="py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    ¥5,000
                  </button>
                  <button
                    onClick={() => addAmount(10000)}
                    className="py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    ¥10,000
                  </button>
                  <button
                    onClick={setExact}
                    className="py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm"
                  >
                    ちょうど
                  </button>
                </div>

                {receivedAmount >= total && (
                  <div className="mb-6 p-4 bg-card rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      お釣り
                    </div>
                    <div className="text-3xl text-primary">
                      ¥{change.toLocaleString()}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleComplete}
                  disabled={receivedAmount < total}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                >
                  決済完了
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
