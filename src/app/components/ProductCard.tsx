import { useState, useRef } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  cartQuantity?: number;
  lowStockThreshold?: number;
  onAdd: () => void;
  onUpdateQuantity: (change: number) => void;
}

export function ProductCard({
  name,
  price,
  stock,
  imageUrl,
  cartQuantity = 0,
  lowStockThreshold = 5,
  onAdd,
  onUpdateQuantity,
}: ProductCardProps) {
  const [showQuantityAdjust, setShowQuantityAdjust] = useState(false);

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const quantityRepeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    if (!showQuantityAdjust && stock > 0) {
      onAdd();
    }
  };

  const handlePressStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (stock <= 0 || cartQuantity <= 0) return;

    longPressTriggeredRef.current = false;

    pressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setShowQuantityAdjust(true);
    }, 500);
  };

  const handlePressEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleQuantityChange = (change: number) => {
    const nextQuantity = Math.max(0, cartQuantity + change);
    const safeChange = nextQuantity - cartQuantity;

    if (safeChange !== 0) {
      onUpdateQuantity(safeChange);
    }

    if (nextQuantity === 0) {
      stopQuantityRepeat();
      setShowQuantityAdjust(false);
    }
  };

  const startQuantityRepeat = (change: number) => {
    stopQuantityRepeat();

    handleQuantityChange(change);

    quantityRepeatRef.current = setInterval(() => {
      handleQuantityChange(change);
    }, 100);
  };

  const stopQuantityRepeat = () => {
    if (quantityRepeatRef.current) {
      clearInterval(quantityRepeatRef.current);
      quantityRepeatRef.current = null;
    }
  };

  const isOutOfStock = stock === 0;
  const isDangerStock = stock === 1;
  const isLowStock = stock > 1 && stock <= lowStockThreshold;

  return (
    <div
      className={`relative aspect-square rounded-lg overflow-hidden transition-all ${isOutOfStock
        ? "bg-card/50 cursor-not-allowed opacity-60"
        : "bg-card cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        }`}
      onClick={handleClick}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressEnd}
      onPointerLeave={handlePressEnd}
    >
      {isOutOfStock && (
        <div className="absolute top-0 left-0 w-0 h-0 border-l-[40px] border-l-destructive border-t-[40px] border-t-destructive border-r-[40px] border-r-transparent border-b-[40px] border-b-transparent z-10">
          <span className="absolute -top-[30px] -left-[30px] w-[40px] text-center text-destructive-foreground rotate-[-45deg] origin-center font-bold leading-tight text-[11px]">
            SOLD OUT
          </span>
        </div>
      )}

      <div className="w-full h-[60%] bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="p-3 h-[40%] flex flex-col justify-between">
        <h3 className="truncate whitespace-nowrap text-left text-[12px]">
          {name}
        </h3>

        <div className="flex justify-between items-end mt-1">
          <div className="text-lg">¥{price.toLocaleString()}</div>
          <div className="text-base">
            {isOutOfStock ? (
              <span className="text-destructive font-bold">
                残り0
              </span>
            ) : isDangerStock ? (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-bold">
                残り{stock}
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-1 bg-warning/20 text-warning rounded font-bold">
                残り{stock}
              </span>
            ) : (
              <span className="text-foreground font-bold">
                残り{stock}
              </span>
            )}
          </div>
        </div>
      </div>

      {cartQuantity > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowQuantityAdjust((prev) => !prev);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full min-w-[32px] h-8 px-2 flex items-center justify-center text-base font-bold z-40"
        >
          {showQuantityAdjust ? "✓" : cartQuantity}
        </button>
      )}

      {showQuantityAdjust && (
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-3 py-2 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                startQuantityRepeat(-1);
              }}
              onMouseUp={stopQuantityRepeat}
              onMouseLeave={stopQuantityRepeat}
              onTouchStart={(e) => {
                e.stopPropagation();
                startQuantityRepeat(-1);
              }}
              onTouchEnd={stopQuantityRepeat}
              className="w-8 h-8 rounded-full border border-primary-foreground/70 flex items-center justify-center text-xl leading-none"
            >
              −
            </button>

            <div className="min-w-[24px] text-center text-2xl font-bold">
              {cartQuantity}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                startQuantityRepeat(1);
              }}
              onMouseUp={stopQuantityRepeat}
              onMouseLeave={stopQuantityRepeat}
              onTouchStart={(e) => {
                e.stopPropagation();
                startQuantityRepeat(1);
              }}
              onTouchEnd={stopQuantityRepeat}
              className="w-8 h-8 rounded-full border border-primary-foreground/70 flex items-center justify-center text-xl leading-none"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
