import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-card rounded-lg">
      <div className="flex-1">
        <h4 className="text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground mt-1">
          ¥{price.toLocaleString()} × {quantity}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className="w-8 h-8 rounded bg-secondary hover:bg-secondary/80 flex items-center justify-center"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-8 text-center">{quantity}</span>

        <button
          onClick={onIncrease}
          className="w-8 h-8 rounded bg-secondary hover:bg-secondary/80 flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={onRemove}
          className="w-8 h-8 rounded bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center ml-2"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </div>

      <div className="ml-4 min-w-[80px] text-right">
        ¥{(price * quantity).toLocaleString()}
      </div>
    </div>
  );
}
