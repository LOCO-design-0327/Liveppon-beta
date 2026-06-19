import { X, Plus, Edit, Trash2, Upload, FileUp } from "lucide-react";
import { useState, useRef } from "react";
import type { Product } from "../types";
import { CSVImportModal } from "./CSVImportModal";
import { compressImage } from "../utils/imageCompression";

const PRODUCT_NAME_MAX_LENGTH = 15;

interface ProductSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogOperation?: (operation: string, content: string, before?: string, after?: string) => void;
  onShowToast?: (message: string) => void;
  lowStockThreshold: number;
  onUpdateLowStockThreshold: (threshold: number) => void;
}

export function ProductSettingsModal({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  onLogOperation,
  onShowToast,
  lowStockThreshold,
  onUpdateLowStockThreshold,
}: ProductSettingsModalProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "新しい商品",
      price: 0,
      stock: 0,
    };
    setEditingProduct(newProduct);
    setOriginalProduct(null);
    setIsAdding(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setOriginalProduct({ ...product });
    setIsAdding(false);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    if (isAdding) {
      onUpdateProducts([...products, editingProduct]);
      if (onLogOperation) {
        onLogOperation(
          "商品追加",
          editingProduct.name,
          "",
          `¥${editingProduct.price} / 在庫${editingProduct.stock}`
        );
      }
      onShowToast?.("商品を登録しました");
    } else {
      onUpdateProducts(
        products.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );

      if (onLogOperation && originalProduct) {
        const changes: string[] = [];
        if (originalProduct.name !== editingProduct.name) {
          onLogOperation(
            "商品名変更",
            editingProduct.id,
            originalProduct.name,
            editingProduct.name
          );
        }
        if (originalProduct.price !== editingProduct.price) {
          onLogOperation(
            "商品価格変更",
            editingProduct.name,
            `¥${originalProduct.price}`,
            `¥${editingProduct.price}`
          );
        }
        if (originalProduct.stock !== editingProduct.stock) {
          onLogOperation(
            "在庫数変更",
            editingProduct.name,
            `${originalProduct.stock}`,
            `${editingProduct.stock}`
          );
        }
        if (originalProduct.category !== editingProduct.category) {
          onLogOperation(
            "カテゴリ変更",
            editingProduct.name,
            originalProduct.category || "未設定",
            editingProduct.category || "未設定"
          );
        }
        if (originalProduct.imageUrl !== editingProduct.imageUrl) {
          onLogOperation(
            "商品画像変更",
            editingProduct.name,
            originalProduct.imageUrl ? "画像あり" : "画像なし",
            editingProduct.imageUrl ? "画像あり" : "画像なし"
          );
        }
      }
    }

    setEditingProduct(null);
    setOriginalProduct(null);
    setIsAdding(false);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (confirm("この商品を削除しますか？")) {
      onUpdateProducts(products.filter((p) => p.id !== productId));
      if (onLogOperation && product) {
        onLogOperation("商品削除", product.name);
      }
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    try {
      const compressedImage = await compressImage(file);
      setEditingProduct({ ...editingProduct, imageUrl: compressedImage });
    } catch (error) {
      console.error("画像の圧縮に失敗しました:", error);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setEditingProduct({ ...editingProduct, imageUrl: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, imageUrl: undefined });
    }
  };

  const handleCSVImport = (importedProducts: Product[]) => {
    const existingIds = new Set(products.map((p) => p.id));
    const added = importedProducts.filter((p) => !existingIds.has(p.id));
    const updated = importedProducts.filter((p) => existingIds.has(p.id));

    const newProducts = [
      ...products.map((p) => {
        const updatedProduct = importedProducts.find((ip) => ip.id === p.id);
        return updatedProduct || p;
      }),
      ...added,
    ];

    onUpdateProducts(newProducts);

    if (onLogOperation) {
      onLogOperation(
        "CSVインポート",
        `追加：${added.length}件 / 更新：${updated.length}件`,
        "",
        `合計${importedProducts.length}件`
      );
    }

    setIsCSVImportOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-background border border-border rounded-lg w-[90vw] max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <h2>商品設定</h2>
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="text-primary hover:text-primary/80"
            >
              ⓘ
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {editingProduct ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  商品画像
                </label>
                {editingProduct.imageUrl ? (
                  <div className="space-y-2">
                    <div className="w-full h-40 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={editingProduct.imageUrl}
                        alt="商品画像"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 bg-secondary rounded-lg hover:bg-secondary/80 flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        変更
                      </button>
                      <button
                        onClick={handleRemoveImage}
                        className="px-4 py-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 bg-card border-2 border-dashed border-border rounded-lg hover:bg-card/80 flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      画像を選択
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-sm text-muted-foreground">
                    商品名
                  </label>
                  <span className="text-xs text-muted-foreground">
                    15文字以内
                  </span>
                </div>
                <input
                  type="text"
                  value={editingProduct.name}
                  maxLength={PRODUCT_NAME_MAX_LENGTH}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value.slice(0, PRODUCT_NAME_MAX_LENGTH),
                    })
                  }
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  価格
                </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  在庫数
                </label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  販売形式
                </label>
                <select
                  value={editingProduct.deliveryType || "immediate"}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      deliveryType: e.target.value as
                        | "immediate"
                        | "shipping"
                        | "other",
                    })
                  }
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg"
                >
                  <option value="immediate">当日受渡</option>
                  <option value="shipping">後日発送</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  カテゴリ
                </label>
                <input
                  type="text"
                  value={editingProduct.category || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  placeholder="例: Tシャツ、タオル、缶バッジ"
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAdding(false);
                  }}
                  className="flex-1 py-2 bg-secondary rounded-lg hover:bg-secondary/80"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <>

              <div className="mb-4 p-4 bg-card rounded-lg">
                <label className="text-sm text-muted-foreground mb-2 block">
                  在庫アラート設定
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm">在庫が</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={lowStockThreshold}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      onUpdateLowStockThreshold(Math.max(1, Math.min(50, value)));
                    }}
                    className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-center"
                  />
                  <span className="text-sm">個以下の場合に警告表示</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleAddProduct}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  商品を追加
                </button>
                <button
                  onClick={() => setIsCSVImportOpen(true)}
                  className="flex-1 py-3 bg-secondary rounded-lg hover:bg-secondary/80 flex items-center justify-center gap-2"
                >
                  <FileUp className="w-5 h-5" />
                  CSVインポート
                </button>
              </div>

              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 bg-card rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div>{product.name}</div>
                        {product.category && (
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ¥{product.price.toLocaleString()} / 在庫
                        {product.stock}個
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="w-10 h-10 rounded bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-10 h-10 rounded bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <CSVImportModal
        isOpen={isCSVImportOpen}
        onClose={() => setIsCSVImportOpen(false)}
        onImport={handleCSVImport}
      />

      {showHelp && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-background border border-border rounded-lg w-[520px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4">商品設定とは？</h2>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="text-primary mb-1">何の機能か</h3>
                <p className="text-muted-foreground">
                  Livepponで販売する商品を管理する機能です。
                </p>
              </div>

              <div>
                <h3 className="text-primary mb-1">できること</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>✓ 商品登録</li>
                  <li>✓ 商品編集</li>
                  <li>✓ CSV一括登録</li>
                  <li>✓ 在庫アラート設定</li>
                </ul>
              </div>

              <div>
                <h3 className="text-primary mb-1">注意事項</h3>
                <p className="text-muted-foreground">
                  CSVインポート前は、バックアップ取得を推奨します。
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
