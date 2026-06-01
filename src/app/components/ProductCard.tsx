import { useState, useEffect, useRef } from "react";

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
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());

  useEffect(() => {
    if (showQuantityAdjust) {
      const checkInactivity = setInterval(() => {
        if (Date.now() - lastInteractionRef.current >= 2000) {
          setShowQuantityAdjust(false);
          clearInterval(checkInactivity);
        }
      }, 100);

      return () => clearInterval(checkInactivity);
    }
  }, [showQuantityAdjust]);

  const handleTouchStart = () => {
    pressTimerRef.current = setTimeout(() => {
      if (stock > 0 && cartQuantity > 0) {
        setShowQuantityAdjust(true);
        lastInteractionRef.current = Date.now();
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleClick = () => {
    if (!showQuantityAdjust && stock > 0) {
      onAdd();
    }
  };

  const handleQuantityChange = (change: number) => {
    onUpdateQuantity(change);
    lastInteractionRef.current = Date.now();
  };

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= lowStockThreshold;

  return (
    <div
      className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
        isOutOfStock
          ? "bg-card/50 cursor-not-allowed opacity-60"
          : "bg-card cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      }`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
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
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="p-3 h-[40%] flex flex-col justify-between">
        <h3 className="line-clamp-2 text-left text-[12px]">{name}</h3>

        <div className="flex justify-between items-end mt-1">
          <div className="text-lg">¥{price.toLocaleString()}</div>
          <div className="text-base">
            {isOutOfStock ? (
              <span className="text-destructive font-bold">残り0</span>
            ) : isLowStock ? (
              <span className="px-2 py-1 bg-warning/20 text-warning rounded font-bold">
                残り{stock}
              </span>
            ) : (
              <span className="text-foreground font-bold">残り{stock}</span>
            )}
          </div>
        </div>
      </div>

      {cartQuantity > 0 && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full min-w-[32px] h-8 px-2 flex items-center justify-center text-base font-bold z-20">
          {cartQuantity}
        </div>
      )}

      {showQuantityAdjust && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(10);
              }}
              className="w-16 h-10 bg-secondary hover:bg-secondary/80 rounded-lg text-sm"
            >
              +10
            </button>
            <div className="flex gap-2 items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(-1);
                }}
                className="w-12 h-12 bg-secondary hover:bg-secondary/80 rounded-lg"
              >
                -1
              </button>
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
                {cartQuantity}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(1);
                }}
                className="w-12 h-12 bg-secondary hover:bg-secondary/80 rounded-lg"
              >
                +1
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(-10);
              }}
              className="w-16 h-10 bg-secondary hover:bg-secondary/80 rounded-lg text-sm"
            >
              -10
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
