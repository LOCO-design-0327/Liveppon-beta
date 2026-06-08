import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({
  name,
  price,
  image,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {

  return (
    <div className="py-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-sm font-medium leading-snug break-words">
                {name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                ¥{price.toLocaleString()} × {quantity}
              </p>
            </div>

            <div className="text-right font-medium whitespace-nowrap">
              ¥{(price * quantity).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-3">
            <button
              onClick={onDecrease}
              className="w-7 h-7 rounded-full border border-primary/60 text-primary hover:bg-primary/10 flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-5 text-center text-sm">
              {quantity}
            </span>

            <button
              onClick={onIncrease}
              className="w-7 h-7 rounded-full border border-primary/60 text-primary hover:bg-primary/10 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={onRemove}
              className="ml-6 w-7 h-7 rounded-full bg-destructive/30 hover:bg-destructive/40 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
