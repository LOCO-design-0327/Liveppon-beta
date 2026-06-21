import { Package, ChevronRight } from "lucide-react";
import type { ShippingItem } from "../types";

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  shippingItems: ShippingItem[];
  onViewDetails: () => void;
}

export function NotificationPopover({
  isOpen,
  onClose,
  shippingItems,
  onViewDetails,
}: NotificationPopoverProps) {
  if (!isOpen) return null;

  const unshippedItems = shippingItems.filter((item) => !item.isShipped);

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute left-full top-0 ml-3 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 text-warning">
            <Package className="w-5 h-5" />
            <span className="font-medium">未発送の商品があります</span>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-4">
          {unshippedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              未発送の商品はありません
            </p>
          ) : (
            <div className="space-y-2">
              {unshippedItems.slice(0, 5).map((item, idx) => (
                <div
                  key={`${item.saleId}-${item.productId}-${idx}`}
                  className="text-sm bg-card p-3 rounded"
                >
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    数量: {item.quantity}個
                  </div>
                </div>
              ))}
              {unshippedItems.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  他 {unshippedItems.length - 5} 件
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={onViewDetails}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <span>詳細</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
