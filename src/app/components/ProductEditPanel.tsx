import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Edit } from "lucide-react";
import type { Product } from "../types";

const PRODUCT_NAME_MAX_LENGTH = 15;
const DEFAULT_CATEGORY_OPTIONS = ["アパレル", "グッズ", "メディア"];
const NEW_CATEGORY_VALUE = "__new_category__";
const EMPTY_FORM_VALUES = {
  name: "",
  price: "",
  stock: "",
  category: "",
};

interface ProductEditPanelProps {
  product: Product | null;
  products: Product[];
  onSave: (product: Product) => void;
}

export interface ProductEditPanelHandle {
  isDirty: () => boolean;
  saveEditingProduct: () => boolean;
  discardChanges: () => void;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
  newCategory?: string;
}

interface ProductEditFormValues {
  name: string;
  price: string;
  stock: string;
  category: string;
}

const getProductFormValues = (product: Product | null): ProductEditFormValues => {
  if (!product) return EMPTY_FORM_VALUES;

  return {
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    category: product.category ?? "",
  };
};

const areFormValuesEqual = (
  first: ProductEditFormValues,
  second: ProductEditFormValues
) =>
  first.name === second.name &&
  first.price === second.price &&
  first.stock === second.stock &&
  first.category === second.category;

export const ProductEditPanel = forwardRef<
  ProductEditPanelHandle,
  ProductEditPanelProps
>(function ProductEditPanel({ product, products, onSave }, ref) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [initialValues, setInitialValues] =
    useState<ProductEditFormValues>(EMPTY_FORM_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addedCategories, setAddedCategories] = useState<string[]>([]);

  const resetForm = useCallback((values: ProductEditFormValues) => {
    setName(values.name);
    setPrice(values.price);
    setStock(values.stock);
    setCategory(values.category);
    setErrors({});
    setIsCreatingCategory(false);
    setNewCategoryName("");
  }, []);

  useEffect(() => {
    const nextValues = getProductFormValues(product);
    setInitialValues(nextValues);
    resetForm(nextValues);
  }, [
    product?.id,
    product?.name,
    product?.price,
    product?.stock,
    product?.category,
    resetForm,
  ]);

  const currentValues = useMemo(
    () => ({ name, price, stock, category }),
    [category, name, price, stock]
  );

  const isDirty =
    product !== null && !areFormValuesEqual(currentValues, initialValues);

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    return [
      ...products
        .map((item) => item.category?.trim())
        .filter((item): item is string => Boolean(item)),
      ...DEFAULT_CATEGORY_OPTIONS,
      ...addedCategories,
      category.trim(),
    ].filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }, [addedCategories, category, products]);

  const isValidInteger = (value: string) => /^\d+$/.test(value.trim());

  const discardChanges = useCallback(() => {
    resetForm(initialValues);
  }, [initialValues, resetForm]);

  const handleAddCategory = () => {
    const trimmedCategory = newCategoryName.trim();

    if (!trimmedCategory) {
      setErrors((prev) => ({
        ...prev,
        newCategory: "新しいカテゴリ名を入力してください",
      }));
      return;
    }

    setAddedCategories((prev) =>
      prev.includes(trimmedCategory) ? prev : [...prev, trimmedCategory]
    );
    setCategory(trimmedCategory);
    setNewCategoryName("");
    setIsCreatingCategory(false);
    setErrors((prev) => ({ ...prev, newCategory: undefined }));
  };

  const saveEditingProduct = useCallback(() => {
    if (!product) return false;

    const nextErrors: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedPrice = price.trim();
    const trimmedStock = stock.trim();
    const trimmedCategory = category.trim();

    if (!trimmedName) {
      nextErrors.name = "商品名を入力してください";
    }

    if (!isValidInteger(trimmedPrice)) {
      nextErrors.price = "価格を正しく入力してください";
    }

    if (!isValidInteger(trimmedStock)) {
      nextErrors.stock = "在庫数を正しく入力してください";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return false;

    const updatedProduct: Product = {
      ...product,
      name: trimmedName,
      price: Number(trimmedPrice),
      stock: Number(trimmedStock),
      category: trimmedCategory || undefined,
    };

    onSave(updatedProduct);
    const savedValues = getProductFormValues(updatedProduct);
    setInitialValues(savedValues);
    resetForm(savedValues);
    return true;
  }, [category, name, onSave, price, product, resetForm, stock]);

  useImperativeHandle(
    ref,
    () => ({
      isDirty: () => isDirty,
      saveEditingProduct,
      discardChanges,
    }),
    [discardChanges, isDirty, saveEditingProduct]
  );

  if (!product) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="mb-4">商品編集モード</h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Edit className="w-6 h-6" />
          </div>
          <p className="mb-2 text-foreground">編集したい商品を選択してください</p>
          <p className="text-sm">
            左の商品カードをタップすると、ここで編集できます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2>商品編集</h2>
        <p className="text-sm text-muted-foreground mt-1">
          選択中の商品を編集できます
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="text-sm text-muted-foreground">商品名</label>
            <span className="text-xs text-muted-foreground">15文字以内</span>
          </div>
          <input
            type="text"
            value={name}
            maxLength={PRODUCT_NAME_MAX_LENGTH}
            onChange={(event) =>
              setName(event.target.value.slice(0, PRODUCT_NAME_MAX_LENGTH))
            }
            className="w-full px-4 py-3 bg-background border border-border rounded-lg"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            価格
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-destructive">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            在庫数
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg"
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-destructive">{errors.stock}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            カテゴリ
          </label>
          <select
            value={isCreatingCategory ? NEW_CATEGORY_VALUE : category}
            onChange={(event) => {
              if (event.target.value === NEW_CATEGORY_VALUE) {
                setIsCreatingCategory(true);
                return;
              }

              setCategory(event.target.value);
              setIsCreatingCategory(false);
              setNewCategoryName("");
              setErrors((prev) => ({ ...prev, newCategory: undefined }));
            }}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg"
          >
            <option value="">未設定</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value={NEW_CATEGORY_VALUE}>
              ＋ 新しいカテゴリを作成
            </option>
          </select>

          {isCreatingCategory && (
            <div className="mt-3 p-3 bg-background border border-border rounded-lg space-y-2">
              <label className="text-sm text-muted-foreground block">
                新しいカテゴリ名
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  className="min-w-0 flex-1 px-3 py-2 bg-card border border-border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 whitespace-nowrap"
                >
                  追加
                </button>
              </div>
              {errors.newCategory && (
                <p className="text-xs text-destructive">
                  {errors.newCategory}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={saveEditingProduct}
        className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        保存
      </button>
    </div>
  );
});
