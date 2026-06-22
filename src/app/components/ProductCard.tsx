import { useState, useRef, type CSSProperties } from "react";
import { Check, Edit, Trash2 } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  cartQuantity?: number;
  lowStockThreshold?: number;
  isEditMode?: boolean;
  isSelectedForEdit?: boolean;
  isDeleteMode?: boolean;
  isSelectedForDelete?: boolean;
  isReorderEnabled?: boolean;
  isDragging?: boolean;
  isDropSettling?: boolean;
  dragPosition?: { x: number; y: number };
  dragSize?: { width: number; height: number };
  onAdd: () => void;
  onUpdateQuantity: (change: number) => void;
  onSelectForEdit?: () => void;
  onToggleDeleteSelect?: () => void;
  onReorderStart?: (productId: string, clientX: number, clientY: number) => void;
  onReorderMove?: (clientX: number, clientY: number) => void;
  onReorderEnd?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  stock,
  imageUrl,
  cartQuantity = 0,
  lowStockThreshold = 5,
  isEditMode = false,
  isSelectedForEdit = false,
  isDeleteMode = false,
  isSelectedForDelete = false,
  isReorderEnabled = false,
  isDragging = false,
  isDropSettling = false,
  dragPosition = { x: 0, y: 0 },
  dragSize = { width: 0, height: 0 },
  onAdd,
  onUpdateQuantity,
  onSelectForEdit,
  onToggleDeleteSelect,
  onReorderStart,
  onReorderMove,
  onReorderEnd,
}: ProductCardProps) {
  const [showQuantityAdjust, setShowQuantityAdjust] = useState(false);

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const quantityRepeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const pointerCurrentRef = useRef<{ x: number; y: number } | null>(null);

  const handleClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    if (isEditMode) {
      setShowQuantityAdjust(false);
      if (isDeleteMode) {
        onToggleDeleteSelect?.();
        return;
      }

      onSelectForEdit?.();
      return;
    }

    if (!showQuantityAdjust && stock > 0) {
      onAdd();
    }
  };

  const handlePressStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEditMode) {
      longPressTriggeredRef.current = false;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      pointerCurrentRef.current = { x: e.clientX, y: e.clientY };
      const target = e.currentTarget;
      const pointerId = e.pointerId;

      pressTimerRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        setShowQuantityAdjust(false);
        if (isReorderEnabled) {
          try {
            if (!target.hasPointerCapture(pointerId)) {
              target.setPointerCapture(pointerId);
            }
          } catch {
            return;
          }

          const pointer =
            pointerCurrentRef.current ?? pointerStartRef.current;

          if (pointer) {
            onReorderStart?.(id, pointer.x, pointer.y);
          }
        }
      }, 500);
      return;
    }

    e.preventDefault();
    if (stock <= 0 || cartQuantity <= 0) return;

    longPressTriggeredRef.current = false;

    pressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setShowQuantityAdjust(true);
    }, 500);
  };

  const handlePressEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEditMode) {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }

      pointerStartRef.current = null;
      pointerCurrentRef.current = null;

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (longPressTriggeredRef.current) {
        e.preventDefault();
        if (isReorderEnabled) {
          onReorderEnd?.();
        }
      }
      return;
    }

    e.preventDefault();

    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditMode) return;

    pointerCurrentRef.current = { x: e.clientX, y: e.clientY };

    if (!longPressTriggeredRef.current) {
      const start = pointerStartRef.current;
      if (!start) return;

      const movedDistance = Math.hypot(
        e.clientX - start.x,
        e.clientY - start.y
      );

      if (movedDistance > 8 && pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      return;
    }

    if (!isReorderEnabled) return;

    e.preventDefault();
    onReorderMove?.(e.clientX, e.clientY);
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
  const cardHighlightClass =
    isDeleteMode && isSelectedForDelete
      ? "ring-2 ring-destructive"
      : isSelectedForEdit && !isDeleteMode
        ? "ring-2 ring-primary"
        : "";
  const cardMotionClass = isDragging
    ? `z-[60] opacity-90 shadow-[0_16px_32px_rgba(0,0,0,0.35)] cursor-grabbing touch-none select-none ${
        isDropSettling
          ? "transition-[left,top,transform,opacity,box-shadow] duration-200 ease-out"
          : "transition-[opacity,box-shadow] duration-150 ease-out"
      }`
    : "transform-gpu transition-transform duration-100 ease-out";
  const cardInteractionClass =
    isOutOfStock && !isEditMode
      ? "bg-card/50 cursor-not-allowed opacity-60 active:scale-[0.98]"
      : isDragging
        ? "bg-card"
        : "bg-card cursor-pointer hover:scale-[1.02] active:scale-[0.98]";
  const cardStyle: CSSProperties | undefined = isDragging
    ? {
        position: "fixed",
        left: dragPosition.x,
        top: dragPosition.y,
        width: dragSize.width,
        height: dragSize.height,
        transform: `translate3d(-50%, -50%, 0) scale(${isDropSettling ? 1 : 1.04})`,
      }
    : undefined;

  return (
    <div
      data-product-id={id}
      style={cardStyle}
      className={`relative w-full h-full rounded-lg overflow-hidden ${cardMotionClass} ${cardInteractionClass} ${cardHighlightClass}`}
      onClick={handleClick}
      onPointerDown={handlePressStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressEnd}
      onPointerLeave={(e) => {
        if (isEditMode && isReorderEnabled) return;
        handlePressEnd(e);
      }}
    >
      {isOutOfStock && (
        <div className="absolute top-0 left-0 w-0 h-0 border-l-[40px] border-l-destructive border-t-[40px] border-t-destructive border-r-[40px] border-r-transparent border-b-[40px] border-b-transparent z-10">
          <span className="absolute -top-[30px] -left-[30px] w-[40px] text-center text-destructive-foreground rotate-[-45deg] origin-center font-bold leading-tight text-[11px]">
            SOLD OUT
          </span>
        </div>
      )}

      {isEditMode && (
        <div
          className={`absolute top-2 right-2 z-40 rounded-full px-2 py-1 text-[11px] flex items-center gap-1 border ${isDeleteMode
            ? isSelectedForDelete
              ? "bg-destructive text-destructive-foreground border-destructive"
              : "bg-card/95 text-muted-foreground border-muted-foreground/40"
            : isSelectedForEdit
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card/95 text-foreground border-primary/40"
            }`}
        >
          {isDeleteMode ? (
            <Trash2 className="w-3 h-3" />
          ) : isSelectedForEdit ? (
            <Check className="w-3 h-3" />
          ) : (
            <Edit className="w-3 h-3" />
          )}
          {isDeleteMode
            ? "削除"
            : isSelectedForEdit
              ? "選択中"
              : "編集"}
        </div>
      )}

      <div className="w-full h-[60%] bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            decoding="async"
            draggable={false}
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

      {cartQuantity > 0 && !isEditMode && (
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

      {showQuantityAdjust && !isEditMode && (
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
