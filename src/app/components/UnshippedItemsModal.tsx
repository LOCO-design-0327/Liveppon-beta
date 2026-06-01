import { X, Package, Check } from "lucide-react";
import { useState } from "react";
import type { ShippingItem } from "../types";

interface UnshippedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shippingItems: ShippingItem[];
  onMarkAsShipped: (saleId: string, productId: string) => void;
}

export function UnshippedItemsModal({
  isOpen,
  onClose,
  shippingItems,
  onMarkAsShipped,
}: UnshippedItemsModalProps) {
  const [swipedItem, setSwipedItem] = useState<string | null>(null);

  const handleClose = () => {
    setSwipedItem(null);
    onClose();
  };

  if (!isOpen) return null;

  const unshippedItems = shippingItems.filter((item) => !item.isShipped);

  const handleSwipeStart = (itemId: string | null) => {
    setSwipedItem(itemId);
  };

  const handleMarkShipped = (saleId: string, productId: string) => {
    onMarkAsShipped(saleId, productId);
    setSwipedItem(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[800px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <h2>未発送商品一覧</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {unshippedItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>未発送の商品はありません</p>
            </div>
          ) : (
            <div className="space-y-2">
              {unshippedItems.map((item) => {
                const itemId = `${item.saleId}-${item.productId}`;
                const isSwiped = swipedItem === itemId;

                return (
                  <div
                    key={itemId}
                    className="relative h-24 rounded-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => handleMarkShipped(item.saleId, item.productId)}
                        className="flex items-center gap-2 text-primary-foreground"
                      >
                        <Check className="w-6 h-6" />
                        <span className="text-lg">発送済みにする</span>
                      </button>
                    </div>

                    <div
                      className={`absolute inset-0 bg-card p-4 border border-border rounded-lg cursor-pointer transition-transform duration-200 ${
                        isSwiped ? "translate-x-full" : ""
                      }`}
                      onClick={() =>
                        handleSwipeStart(isSwiped ? null : itemId)
                      }
                    >
                      <div className="flex justify-between items-center h-full">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            数量: {item.quantity}個
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            販売ID: {item.saleId}
                          </div>
                        </div>
                        <div className="text-warning">未発送</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
