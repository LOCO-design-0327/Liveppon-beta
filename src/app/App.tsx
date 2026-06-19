import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  History,
  TrendingUp,
  Settings as SettingsIcon,
  Banknote,
  QrCode,
  BookOpen,
  Plus,
  Bell,
  Shield,
} from "lucide-react";
import { ProductCard } from "./components/ProductCard";
import { CartItem as CartItemComponent } from "./components/CartItem";
import { CheckoutModal } from "./components/CheckoutModal";
import { SettingsModal } from "./components/SettingsModal";
import { OwnerPinModal } from "./components/OwnerPinModal";
import { ProductSettingsModal } from "./components/ProductSettingsModal";
import { QRSettingsModal } from "./components/QRSettingsModal";
import { SceneManagementModal } from "./components/SceneManagementModal";
import { BackupModal } from "./components/BackupModal";
import { TestModeModal } from "./components/TestModeModal";
import { PinChangeModal } from "./components/PinChangeModal";
import { HelpModal } from "./components/HelpModal";
import { ResetModal } from "./components/ResetModal";
import { ArchiveModal } from "./components/ArchiveModal";
import {
  OperationLogModal,
  type OperationLog,
} from "./components/OperationLogModal";
import { CancelReasonModal } from "./components/CancelReasonModal";
import { ThankYouModal } from "./components/ThankYouModal";
import { UnshippedItemsModal } from "./components/UnshippedItemsModal";
import { NotificationPopover } from "./components/NotificationPopover";
import { ThemeModal } from "./components/ThemeModal";
import { OnlineStatus } from "./components/OnlineStatus";
import { SalesStyleModal } from "./components/SalesStyleModal";
import { SalesHistoryHelpModal } from "./components/SalesHistoryHelpModal";
import { SummaryHelpModal } from "./components/SummaryHelpModal";
import { OwnerModeInfoModal } from "./components/OwnerModeInfoModal";
import { ToastNotification } from "./components/ToastNotification";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Product, CartItem, Sale, ShippingItem, SalesStyle } from "./types";
import {
  INITIAL_PRODUCTS,
  SAMPLE_IMAGE_REPLACEMENTS,
} from "./constants/products";

import { BeginnerIcon } from "../assets/icons/BeginnerIcon";

import { AppInfoModal } from "./components/AppInfoModal";

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    "sales" | "history" | "summary"
  >("sales");
  const [isSummaryHelpOpen, setIsSummaryHelpOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [hideOutOfStock, setHideOutOfStock] = useLocalStorage<boolean>(
    "hideOutOfStock",
    false
  );
  const [salesStyle, setSalesStyle] = useLocalStorage<SalesStyle | null>(
    "salesStyle",
    null
  );
  const [products, setProducts] = useLocalStorage<Product[]>(
    "products",
    INITIAL_PRODUCTS
  );

  const [lastBackupAt, setLastBackupAt] = useLocalStorage<string | null>(
    "lastBackupAt",
    null
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useLocalStorage<Sale[]>("sales", []);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qr">("cash");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const [isOwnerPinOpen, setIsOwnerPinOpen] = useState(false);
  const [isProductSettingsOpen, setIsProductSettingsOpen] = useState(false);
  const [isQRSettingsOpen, setIsQRSettingsOpen] = useState(false);
  const [isSalesStyleOpen, setIsSalesStyleOpen] = useState(false);
  const [isSceneManagementOpen, setIsSceneManagementOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isTestModeOpen, setIsTestModeOpen] = useState(false);
  const [isPinChangeOpen, setIsPinChangeOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isOperationLogOpen, setIsOperationLogOpen] = useState(false);
  const [isCancelReasonOpen, setIsCancelReasonOpen] = useState(false);
  const [cancelTargetSaleId, setCancelTargetSaleId] = useState<string | null>(null);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isUnshippedItemsOpen, setIsUnshippedItemsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [swipedSaleId, setSwipedSaleId] = useState<string | null>(null);
  const [helpOpenedFrom, setHelpOpenedFrom] = useState<"guide" | "settings">(
    "guide"
  );
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<
    "all" | "cash" | "qr"
  >("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [isSalesHistoryHelpOpen, setIsSalesHistoryHelpOpen] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [isOwnerModeMenuOpen, setIsOwnerModeMenuOpen] = useState(false);

  const [isPortrait, setIsPortrait] = useState(false);

  const [showTestModeExitConfirm, setShowTestModeExitConfirm] = useState(false);

  const [ownerPin, setOwnerPin] = useLocalStorage<string>("ownerPin", "123456");
  const [isTestMode, setIsTestMode] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useLocalStorage<string | undefined>("qrCodeImage", undefined);
  const [scenes, setScenes] = useLocalStorage<any[]>("scenes", []);
  const [archives, setArchives] = useLocalStorage<any[]>("archives", []);
  const [operationLogs, setOperationLogs] = useLocalStorage<OperationLog[]>("operationLogs", []);
  const [shippingItems, setShippingItems] = useLocalStorage<ShippingItem[]>(
    "shippingItems",
    []
  );
  const [themeMode, setThemeMode] = useLocalStorage<"dark" | "light">("themeMode", "dark");
  const [themeColor, setThemeColor] = useLocalStorage<string>("themeColor", "#06c56d");
  const [lowStockThreshold, setLowStockThreshold] = useLocalStorage<number>("lowStockThreshold", 5);
  const [pinModalAction, setPinModalAction] = useState<(() => void) | null>(
    null
  );
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null
  );

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleSelectSalesStyle = (style: SalesStyle) => {
    const didChange = salesStyle !== style;

    setSalesStyle(style);

    if (isSalesStyleOpen) {
      setIsSettingsOpen(true);
    }

    setIsSalesStyleOpen(false);

    if (didChange) {
      showToast(
        style === "single"
          ? "一人販売に変更しました"
          : "複数スタッフ販売に変更しました"
      );
    }
  };

  const handleCloseSalesStyleSettings = () => {
    setIsSalesStyleOpen(false);
    setIsSettingsOpen(true);
  };

  useEffect(() => {
    let hasReplacement = false;
    const migratedProducts = products.map((product) => {
      const replacement =
        product.imageUrl && SAMPLE_IMAGE_REPLACEMENTS[product.imageUrl];

      if (!replacement) return product;

      hasReplacement = true;
      return { ...product, imageUrl: replacement };
    });

    if (hasReplacement) {
      setProducts(migratedProducts);
    }
  }, [products]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", themeMode === "dark");
    root.style.setProperty("--primary", themeColor);
    root.style.setProperty("--accent", themeColor);
    root.style.setProperty("--ring", themeColor);
  }, [themeMode, themeColor]);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  const addOperationLog = (
    operation: string,
    content: string,
    before?: string,
    after?: string
  ) => {
    const log: OperationLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      operation,
      content,
      before,
      after,
    };

    const hundredDaysAgo = new Date();
    hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

    const filteredLogs = operationLogs.filter(
      (log) => new Date(log.timestamp) > hundredDaysAgo
    );

    setOperationLogs([log, ...filteredLogs]);
  };

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = cart.find((item) => item.id === productId);
    const currentQuantity = existingItem?.quantity || 0;

    if (currentQuantity >= product.stock) return;

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          quantity: 1,
        },
      ]);
    }
  };

  const updateCartQuantity = (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            if (newQuantity > product.stock) {
              return { ...item, quantity: product.stock };
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const handleCompleteCheckout = (receivedAmount?: number) => {
    if (isTestMode) {
      setCart([]);
      setIsCheckoutOpen(false);
      return;
    }

    const sale: Sale = {
      id: Date.now().toString(),
      timestamp: new Date(),
      items: [...cart],
      total: cartTotal,
      paymentMethod,
      receivedAmount,
      change: receivedAmount ? receivedAmount - cartTotal : undefined,
    };

    setSales([sale, ...sales]);

    cart.forEach((item) => {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === item.id ? { ...p, stock: p.stock - item.quantity } : p
        )
      );

      const product = products.find((p) => p.id === item.id);
      if (product?.deliveryType === "shipping") {
        const shippingItem: ShippingItem = {
          saleId: sale.id,
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          isShipped: false,
        };
        setShippingItems((prev) => [...prev, shippingItem]);
      }
    });

    addOperationLog(
      "販売完了",
      `${paymentMethod === "cash" ? "現金決済" : "QRコード決済"} / ${cart.map((item) => `${item.name} × ${item.quantity}`).join(", ")}`,
      "",
      `¥${cartTotal.toLocaleString()}`
    );

    setCart([]);
    setIsCheckoutOpen(false);
    setIsThankYouOpen(true);
  };

  const handleOwnerLogin = () => {
    setIsOwnerPinOpen(true);
  };

  const handleVerifyPin = (pin: string): boolean => {
    if (pin === ownerPin) {
      setIsOwnerMode(true);
      addOperationLog("オーナーログイン", "オーナーモードに入りました");
      setIsOwnerPinOpen(false);
      if (pinModalAction) {
        setTimeout(() => {
          pinModalAction();
          setPinModalAction(null);
        }, 100);
      }
      return true;
    }
    return false;
  };

  const handleOwnerLogout = () => {
    setIsOwnerMode(false);
    setIsSettingsOpen(false);
    addOperationLog("オーナーログアウト", "オーナーモードを終了しました");
  };

  const handleOpenProductSettings = () => {
    setIsSettingsOpen(false);
    setIsProductSettingsOpen(true);
  };

  const handleAddFirstProduct = () => {
    if (!isOwnerMode) {
      setPinModalAction(() => () => {
        setIsProductSettingsOpen(true);
      });
      handleOwnerLogin();
    } else {
      setIsProductSettingsOpen(true);
    }
  };

  const handleOpenQRSettings = () => {
    setIsSettingsOpen(false);
    setIsQRSettingsOpen(true);
  };

  const handleOpenSceneManagement = () => {
    setIsSettingsOpen(false);
    setIsSceneManagementOpen(true);
  };

  const handleOpenBackup = () => {
    setIsSettingsOpen(false);
    setIsBackupOpen(true);
  };

  const handleOpenTestMode = () => {
    setIsSettingsOpen(false);
    setIsTestModeOpen(true);
  };

  const handleOpenSalesStyle = () => {
    setIsSettingsOpen(false);
    setIsSalesStyleOpen(true);
  };

  const handleOpenPinChange = () => {
    setIsSettingsOpen(false);
    setIsPinChangeOpen(true);
  };

  const handleMarkAsShipped = (saleId: string, productId: string) => {
    setShippingItems((prev) =>
      prev.map((item) =>
        item.saleId === saleId && item.productId === productId
          ? { ...item, isShipped: true, shippedAt: new Date() }
          : item
      )
    );
    addOperationLog(
      "発送完了",
      shippingItems.find(
        (item) => item.saleId === saleId && item.productId === productId
      )?.productName || ""
    );
  };

  const handleOpenHelp = (from: "guide" | "settings" = "guide") => {
    setHelpOpenedFrom(from);
    if (from === "settings") {
      setIsSettingsOpen(false);
    }
    setIsHelpOpen(true);
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false);
    if (helpOpenedFrom === "settings") {
      setIsSettingsOpen(true);
    }
  };

  const handleOpenReset = () => {
    setIsSettingsOpen(false);
    setIsResetOpen(true);
  };

  const handleOpenArchive = () => {
    setIsSettingsOpen(false);
    setIsArchiveOpen(true);
  };

  const handleOpenTheme = () => {
    setIsSettingsOpen(false);
    setIsThemeOpen(true);
  };

  const handleOpenOperationLog = () => {
    setIsSettingsOpen(false);
    setIsOperationLogOpen(true);
  };

  const handleSaveScene = (name: string, products: Product[]) => {
    const newScene = {
      id: Date.now().toString(),
      name,
      products,
      createdAt: new Date(),
    };
    setScenes([...scenes, newScene]);
    addOperationLog("シーン保存", `"${name}" を保存しました`);
    showToast("シーンを保存しました");
  };

  const handleLoadScene = (scene: any) => {
    setProducts(scene.products);
    addOperationLog("シーン呼び出し", `"${scene.name}" を呼び出しました`);
  };

  const handleDeleteScene = (sceneId: string) => {
    const scene = scenes.find((s: any) => s.id === sceneId);
    setScenes(scenes.filter((s: any) => s.id !== sceneId));
    if (scene) {
      addOperationLog("シーン削除", `"${scene.name}" を削除しました`);
    }
  };

  const handleExportBackup = () => {
    addOperationLog("バックアップ書き出し", "データをエクスポートしました");
    setLastBackupAt(new Date().toISOString());
    showToast("バックアップを保存しました");
    return {
      version: "1.0",
      exportDate: new Date().toISOString(),
      products,
      sales,
      scenes,
      archives,
      qrCodeImage,
      operationLogs,
    };
  };

  const handleImportBackup = (data: any) => {
    if (data.products) setProducts(data.products);
    if (data.sales) setSales(data.sales);
    if (data.scenes) setScenes(data.scenes);
    if (data.archives) setArchives(data.archives);
    if (data.qrCodeImage !== undefined) setQrCodeImage(data.qrCodeImage);
    if (data.operationLogs) setOperationLogs(data.operationLogs);
    addOperationLog("バックアップ読み込み", "データをインポートしました");
  };

  const handleSaveArchive = (name: string) => {
    const activeSales = sales.filter((s) => !s.isCancelled);
    const totalRevenue = activeSales.reduce(
      (sum, sale) => sum + sale.total,
      0
    );
    const cashRevenue = activeSales
      .filter((s) => s.paymentMethod === "cash")
      .reduce((sum, sale) => sum + sale.total, 0);
    const qrRevenue = activeSales
      .filter((s) => s.paymentMethod === "qr")
      .reduce((sum, sale) => sum + sale.total, 0);

    const newArchive = {
      id: Date.now().toString(),
      name,
      savedAt: new Date(),
      sales: [...sales],
      totalRevenue,
      totalCount: activeSales.length,
      cashRevenue,
      qrRevenue,
    };

    setArchives([...archives, newArchive]);
    addOperationLog("イベントアーカイブ保存", `"${name}" を保存しました`);
  };

  const handleDeleteArchive = (archiveId: string) => {
    const archive = archives.find((a: any) => a.id === archiveId);
    setArchives(archives.filter((a: any) => a.id !== archiveId));
    if (archive) {
      addOperationLog(
        "イベントアーカイブ削除",
        `"${archive.name}" を削除しました`
      );
    }
  };

  const handleExportOperationLogs = () => {
    const headers = ["日付", "時間", "操作種別", "内容", "変更前", "変更後"];
    const rows = operationLogs.map((log) => {
      const date = new Date(log.timestamp);
      return [
        date.toLocaleDateString("ja-JP"),
        date.toLocaleTimeString("ja-JP"),
        log.operation,
        log.content,
        log.before || "",
        log.after || "",
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `liveppon_logs_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    addOperationLog("操作ログCSV出力", "操作ログを書き出しました");
  };

  const handleReset = () => {
    addOperationLog("データ初期化", "すべてのデータを削除しました");
    setProducts([]);
    setSales([]);
    setScenes([]);
    setArchives([]);
    setQrCodeImage(undefined);
    setCart([]);
    setIsOwnerMode(false);
    setIsTestMode(false);
    setOperationLogs([]);
  };

  const cancelSale = (saleId: string) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale || sale.isCancelled) return;

    if (confirm("この取引をキャンセルしますか？")) {
      setCancelTargetSaleId(saleId);
      setIsCancelReasonOpen(true);
    } else {
      setSwipedSaleId(null);
    }
  };

  const handleCancelWithReason = (reason: string, shouldRestoreStock: boolean) => {
    if (!cancelTargetSaleId) return;

    const sale = sales.find((s) => s.id === cancelTargetSaleId);
    if (!sale || sale.isCancelled) return;

    setSales(
      sales.map((s) =>
        s.id === cancelTargetSaleId
          ? { ...s, isCancelled: true, cancelReason: reason }
          : s
      )
    );

    if (shouldRestoreStock) {
      sale.items.forEach((item) => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === item.id ? { ...p, stock: p.stock + item.quantity } : p
          )
        );
      });
    }

    addOperationLog(
      "販売キャンセル",
      `${reason} / ${sale.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}`,
      `¥${sale.total.toLocaleString()}`,
      `-¥${sale.total.toLocaleString()}`
    );

    setCancelTargetSaleId(null);
  };

  const exportSalesCSV = () => {
    const headers = [
      "ID",
      "日時",
      "決済方法",
      "商品名",
      "数量",
      "単価",
      "小計",
      "合計",
      "状態",
    ];
    const rows = sales.flatMap((sale) =>
      sale.items.map((item, index) => [
        index === 0 ? sale.id : "",
        index === 0
          ? new Date(sale.timestamp).toLocaleString("ja-JP")
          : "",
        index === 0 ? (sale.paymentMethod === "cash" ? "現金" : "QR") : "",
        item.name,
        item.quantity,
        item.price,
        item.price * item.quantity,
        index === 0 ? sale.total : "",
        index === 0 ? (sale.isCancelled ? "キャンセル" : "完了") : "",
      ])
    );

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `liveppon_sales_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const activeSales = sales.filter((s) => !s.isCancelled);
  const totalRevenue = activeSales.reduce((sum, sale) => sum + sale.total, 0);
  const cashRevenue = activeSales
    .filter((s) => s.paymentMethod === "cash")
    .reduce((sum, sale) => sum + sale.total, 0);
  const qrRevenue = activeSales
    .filter((s) => s.paymentMethod === "qr")
    .reduce((sum, sale) => sum + sale.total, 0);

  const productSales = activeSales.reduce(
    (acc, sale) => {
      sale.items.forEach((item) => {
        if (!acc[item.id]) {
          acc[item.id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        acc[item.id].quantity += item.quantity;
        acc[item.id].revenue += item.price * item.quantity;
      });
      return acc;
    },
    {} as Record<string, { name: string; quantity: number; revenue: number }>
  );

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);

  const categories = [
    "すべて",
    ...Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((category): category is string => Boolean(category))
      )
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "すべて" || product.category === selectedCategory;
    const stockMatch = !hideOutOfStock || product.stock > 0;
    return categoryMatch && stockMatch;
  });

  if (isPortrait) {
    const isDarkMode = themeMode === "dark";

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 text-center">
        <img
          src={
            isDarkMode
              ? "/liveppon-symbol-dark.svg"
              : "/liveppon-symbol-light.svg"
          }
          alt="Liveppon"
          className="h-20 w-auto mb-6"
        />

        <img
          src={
            isDarkMode
              ? "/liveppon-logo-dark.svg"
              : "/liveppon-logo-light.svg"
          }
          alt="Liveppon"
          className="h-10 w-auto mb-6"
        />

        <p className="text-lg font-semibold mb-3">
          横画面でご利用ください
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          Livepponは現在、タブレット横画面での利用を前提に設計されています。
          <br />
          端末を横向きにしてご利用ください。
        </p>

        <p className="text-xs text-muted-foreground mt-6">
          スマートフォン向けモデル「Liveppon Go」を開発中です。
          <br />
          今後のアップデートをお待ちください。
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden">      {isTestMode && (
      <div className="bg-warning text-warning-foreground px-6 py-2 text-center flex items-center justify-center gap-4">
        <span>テストモード中 - 販売履歴に記録されません</span>
        <button
          onClick={() => setShowTestModeExitConfirm(true)}
          className="px-3 py-1 bg-warning-foreground text-warning rounded text-sm hover:opacity-90"
        >
          終了
        </button>
      </div>
    )}

      {showTestModeExitConfirm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]"
          onClick={() => setShowTestModeExitConfirm(false)}
        >
          <div
            className="bg-background border border-border rounded-lg w-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold">
                テストモードを終了しますか？
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-muted-foreground">
                テストモードを終了し、通常モードに戻ります。
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowTestModeExitConfirm(false)}
                  className="px-4 py-2 bg-secondary rounded-lg"
                >
                  キャンセル
                </button>

                <button
                  onClick={() => {
                    setIsTestMode(false);
                    setShowTestModeExitConfirm(false);
                  }}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
                >
                  終了する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">


          <button
            type="button"
            onClick={() => setIsAppInfoOpen(true)}
            className="hover:opacity-80 transition-opacity"
            aria-label="アプリ情報を開く"
          >
            <img
              src={
                themeMode === "dark"
                  ? "/liveppon-logo-dark.svg"
                  : "/liveppon-logo-light.svg"
              }
              alt="Liveppon"
              className="h-8 w-auto"
            />
          </button>


          <nav className="flex gap-2">
            <button
              onClick={() => {
                setCurrentTab("sales");
                setSwipedSaleId(null);
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentTab === "sales"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
                }`}
            >
              <ShoppingBag className="w-4 h-4" />
              販売
            </button>
            <button
              onClick={() => {
                setCurrentTab("history");
                setSwipedSaleId(null);
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentTab === "history"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
                }`}
            >
              <History className="w-4 h-4" />
              履歴
            </button>
            <button
              onClick={() => {
                setCurrentTab("summary");
                setSwipedSaleId(null);
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentTab === "summary"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              売上サマリー
            </button>
          </nav>

          {shippingItems.filter((item) => !item.isShipped).length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-lg hover:bg-secondary"
              >
                <Bell className="w-5 h-5 text-warning" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
              </button>
              {isNotificationOpen && (
                <NotificationPopover
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  shippingItems={shippingItems}
                  onViewDetails={() => {
                    setIsNotificationOpen(false);
                    setIsUnshippedItemsOpen(true);
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOwnerMode && (
            <button
              onClick={() => setIsOwnerModeMenuOpen(true)}
              className="px-3 py-1 rounded-lg bg-primary/20 text-primary flex items-center gap-1"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">オーナーモード</span>
            </button>
          )}

          <OnlineStatus />

          <button
            onClick={() => handleOpenHelp("guide")}
            title="操作ガイド"
            aria-label="操作ガイド"
            className="
              w-10 h-10
              rounded-full
              bg-primary
              hover:opacity-90
              flex items-center justify-center
              transition-all
             "
          >
            <BeginnerIcon className="w-5 h-5 text-primary-foreground" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {currentTab === "sales" && (
          <div className="h-full flex">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-card hover:bg-card/80 border border-border"} text-[14px]`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 ml-auto mr-1 whitespace-nowrap">
                  <span className="text-sm text-foreground">
                    在庫0を隠す
                  </span>
                  <button
                    type="button"
                    onClick={() => setHideOutOfStock(!hideOutOfStock)}
                    className={`relative inline-flex h-7 w-14 flex-shrink-0 items-center rounded-full transition-colors ${hideOutOfStock ? "bg-primary" : "bg-secondary"
                      }`}
                    aria-pressed={hideOutOfStock}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${hideOutOfStock ? "translate-x-8" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={handleAddFirstProduct}
                    className="aspect-square w-64 bg-card hover:bg-card/80 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <Plus className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="mb-2">商品を追加</h3>
                      <p className="text-sm text-muted-foreground px-4">
                        商品がまだ登録されていません
                        <br />
                        タップして商品登録を始めます
                      </p>
                    </div>
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  このカテゴリの商品はありません
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      cartQuantity={
                        cart.find((item) => item.id === product.id)
                          ?.quantity || 0
                      }
                      lowStockThreshold={lowStockThreshold}
                      onAdd={() => addToCart(product.id)}
                      onUpdateQuantity={(change) =>
                        updateCartQuantity(product.id, change)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className="w-96 bg-card border-l border-border p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2>カート</h2>
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("カート内をクリアしますか？")) {
                        setCart([]);
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    カート内をクリア
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    カートが空です
                  </p>
                ) : (
                  cart.map((item) => (
                    <CartItemComponent
                      key={item.id}
                      {...item}
                      onIncrease={() => updateCartQuantity(item.id, 1)}
                      onDecrease={() => updateCartQuantity(item.id, -1)}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))
                )}
              </div>

              <div className="space-y-4">
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span>合計</span>
                    <span className="text-2xl text-primary">
                      ¥{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === "cash"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                        }`}
                    >
                      <Banknote className="w-4 h-4" />
                      現金
                    </button>
                    <button
                      onClick={() => setPaymentMethod("qr")}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === "qr"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                        }`}
                    >
                      <QrCode className="w-4 h-4" />
                      QR
                    </button>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    お会計へ進む
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {currentTab === "history" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2>販売履歴</h2>
                  <button
                    type="button"
                    onClick={() => setIsSalesHistoryHelpOpen(true)}
                    className="text-primary hover:text-primary/80"
                  >
                    ⓘ
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  販売履歴の検索・確認・CSV出力ができます
                </p>
              </div>

              <button
                onClick={isOwnerMode ? exportSalesCSV : handleOwnerLogin}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isOwnerMode
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-card/50 text-muted-foreground cursor-pointer hover:bg-card/70"
                  }`}
              >
                {!isOwnerMode && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                )}
                CSV出力
              </button>
            </div>

            <div className="mb-4 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="商品名で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-lg"
                />
                <select
                  value={filterPaymentMethod}
                  onChange={(e) =>
                    setFilterPaymentMethod(
                      e.target.value as "all" | "cash" | "qr"
                    )
                  }
                  className="px-4 py-2 bg-card border border-border rounded-lg"
                >
                  <option value="all">すべて</option>
                  <option value="cash">現金</option>
                  <option value="qr">QR</option>
                </select>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterPaymentMethod("all");
                    setFilterDateFrom("");
                    setFilterDateTo("");
                  }}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg whitespace-nowrap"
                >
                  クリア
                </button>
              </div>

              <div className="flex gap-3 items-center">
                <label className="text-sm text-muted-foreground whitespace-nowrap">
                  期間:
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-lg"
                />
                <span className="text-muted-foreground">〜</span>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-lg"
                />
              </div>
            </div>

            {sales.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                販売履歴がありません
              </p>
            ) : (
              <div className="space-y-3">
                {sales
                  .filter((sale) => {
                    if (
                      searchQuery &&
                      !sale.items.some((item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                    ) {
                      return false;
                    }

                    if (
                      filterPaymentMethod !== "all" &&
                      sale.paymentMethod !== filterPaymentMethod
                    ) {
                      return false;
                    }

                    if (filterDateFrom || filterDateTo) {
                      const saleDate = new Date(sale.timestamp)
                        .toISOString()
                        .split("T")[0];

                      if (filterDateFrom && saleDate < filterDateFrom) {
                        return false;
                      }

                      if (filterDateTo && saleDate > filterDateTo) {
                        return false;
                      }
                    }

                    return true;
                  })
                  .map((sale) => {
                    const isSwiped = swipedSaleId === sale.id;

                    return (
                      <div
                        key={sale.id}
                        className="relative overflow-hidden rounded-lg"
                      >
                        {!sale.isCancelled && (
                          <div className="absolute inset-0 bg-destructive flex items-center justify-end px-6">
                            <button
                              onClick={() => {
                                cancelSale(sale.id);
                                setSwipedSaleId(null);
                              }}
                              className="flex items-center gap-2 text-destructive-foreground"
                            >
                              <span>取引キャンセル</span>
                            </button>
                          </div>
                        )}

                        <div
                          className={`relative p-4 border transition-transform duration-200 ${sale.isCancelled
                            ? "bg-destructive/10 border-destructive/30"
                            : "bg-card border-border cursor-pointer"
                            } ${isSwiped && !sale.isCancelled ? "-translate-x-36" : ""}`}
                          onClick={() =>
                            !sale.isCancelled &&
                            setSwipedSaleId(isSwiped ? null : sale.id)
                          }
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(sale.timestamp).toLocaleString(
                                    "ja-JP"
                                  )}
                                </span>
                                {sale.isCancelled && (
                                  <span className="text-xs text-destructive">
                                    [キャンセル済み]
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {sale.paymentMethod === "cash" ? (
                                  <Banknote className="w-4 h-4" />
                                ) : (
                                  <QrCode className="w-4 h-4" />
                                )}
                                <span className="text-sm">
                                  {sale.paymentMethod === "cash" ? "現金" : "QR"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl text-primary">
                                ¥{sale.total.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            {sale.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="text-sm flex justify-between text-muted-foreground"
                              >
                                <span>
                                  {item.name} × {item.quantity}
                                </span>
                                <span>
                                  ¥{(item.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {currentTab === "summary" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2">
              <h2>売上サマリー</h2>

              <button
                onClick={() => setIsSummaryHelpOpen(true)}
                className="text-primary hover:opacity-80"
              >
                ⓘ
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              売上状況をまとめて確認できます
            </p>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-card p-6 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  総売上
                </div>
                <div className="text-3xl text-primary">
                  ¥{totalRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  販売件数
                </div>
                <div className="text-3xl text-primary">
                  {activeSales.length}件
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  現金売上
                </div>
                <div className="text-3xl text-primary">
                  ¥{cashRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  QR売上
                </div>
                <div className="text-3xl text-primary">
                  ¥{qrRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h3 className="mb-4">売れ筋ランキング</h3>
              {topProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  データがありません
                </p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map(([id, data], index) => (
                    <div
                      key={id}
                      className="flex items-center gap-4 p-3 bg-secondary rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div>{data.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {data.quantity}個 販売
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl text-primary">
                          ¥{data.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        paymentMethod={paymentMethod}
        qrCodeImage={qrCodeImage}
        isOwnerMode={isOwnerMode}
        onComplete={handleCompleteCheckout}
        onOpenQRSettings={() => {
          if (isOwnerMode) {
            handleOpenQRSettings();
          } else {
            handleOwnerLogin();
          }
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isOwnerMode={isOwnerMode}
        salesStyle={salesStyle}
        onOwnerLogin={handleOwnerLogin}
        onOwnerLogout={handleOwnerLogout}
        onOpenSalesStyle={handleOpenSalesStyle}
        onOpenProductSettings={handleOpenProductSettings}
        onOpenQRSettings={handleOpenQRSettings}
        onOpenSceneManagement={handleOpenSceneManagement}
        onOpenBackup={handleOpenBackup}
        onOpenArchive={handleOpenArchive}
        onOpenOperationLog={handleOpenOperationLog}
        onOpenPinChange={handleOpenPinChange}
        onOpenTestMode={handleOpenTestMode}
        onOpenHelp={() => handleOpenHelp("settings")}
        onOpenReset={handleOpenReset}
        onOpenTheme={handleOpenTheme}
        onOpenAppInfo={() => setIsAppInfoOpen(true)}
      />

      <AppInfoModal
        isOpen={isAppInfoOpen}
        onClose={() => setIsAppInfoOpen(false)}
      />

      <OwnerPinModal
        isOpen={isOwnerPinOpen}
        onClose={() => setIsOwnerPinOpen(false)}
        onVerify={handleVerifyPin}
      />

      <SalesStyleModal
        isOpen={salesStyle === null || isSalesStyleOpen}
        onSelect={handleSelectSalesStyle}
        onClose={
          isSalesStyleOpen ? handleCloseSalesStyleSettings : undefined
        }
      />

      <ProductSettingsModal
        isOpen={isProductSettingsOpen}
        onClose={() => {
          setIsProductSettingsOpen(false);
          setIsSettingsOpen(true);
        }}
        products={products}
        onUpdateProducts={setProducts}
        onLogOperation={addOperationLog}
        onShowToast={showToast}
        lowStockThreshold={lowStockThreshold}
        onUpdateLowStockThreshold={setLowStockThreshold}
      />

      <QRSettingsModal
        isOpen={isQRSettingsOpen}
        onClose={() => {
          setIsQRSettingsOpen(false);
          setIsSettingsOpen(true);
        }}
        qrCodeImage={qrCodeImage}
        onUpdateQRCode={setQrCodeImage}
        onLogOperation={addOperationLog}
      />

      <SceneManagementModal
        isOpen={isSceneManagementOpen}
        onClose={() => {
          setIsSceneManagementOpen(false);
          setIsSettingsOpen(true);
        }}
        scenes={scenes}
        currentProducts={products}
        onSaveScene={handleSaveScene}
        onLoadScene={handleLoadScene}
        onDeleteScene={handleDeleteScene}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => {
          setIsBackupOpen(false);
          setIsSettingsOpen(true);
        }}
        onExport={handleExportBackup}
        onImport={handleImportBackup}
        lastBackupAt={lastBackupAt}
      />

      <SalesHistoryHelpModal
        isOpen={isSalesHistoryHelpOpen}
        onClose={() => setIsSalesHistoryHelpOpen(false)}
      />

      <SummaryHelpModal
        isOpen={isSummaryHelpOpen}
        onClose={() => setIsSummaryHelpOpen(false)}
      />

      <OwnerModeInfoModal
        isOpen={isOwnerModeMenuOpen}
        onClose={() => setIsOwnerModeMenuOpen(false)}
        onLogout={() => {
          setIsOwnerModeMenuOpen(false);
          setIsOwnerMode(false);
        }}
      />

      <TestModeModal
        isOpen={isTestModeOpen}
        onClose={() => {
          setIsTestModeOpen(false);
          setIsSettingsOpen(true);
        }}
        isTestMode={isTestMode}
        onToggleTestMode={() => {
          const newMode = !isTestMode;
          setIsTestMode(newMode);
          addOperationLog(
            newMode ? "テストモード開始" : "テストモード終了",
            newMode
              ? "販売履歴に反映しない確認モードを開始"
              : "テストモードを終了"
          );
        }}
      />

      <PinChangeModal
        isOpen={isPinChangeOpen}
        onClose={() => {
          setIsPinChangeOpen(false);
          setIsSettingsOpen(true);
        }}
        currentPin={ownerPin}
        onChangePin={(newPin) => {
          setOwnerPin(newPin);
          addOperationLog("PIN変更", "オーナーPINを変更");
        }}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={handleCloseHelp}
        onBackToSettings={
          helpOpenedFrom === "settings" ? handleCloseHelp : undefined
        }
      />

      <ResetModal
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          setIsSettingsOpen(true);
        }}
        onReset={handleReset}
      />

      <ArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => {
          setIsArchiveOpen(false);
          setIsSettingsOpen(true);
        }}
        archives={archives}
        currentSales={sales}
        onSaveArchive={handleSaveArchive}
        onDeleteArchive={handleDeleteArchive}
      />

      <OperationLogModal
        isOpen={isOperationLogOpen}
        onClose={() => {
          setIsOperationLogOpen(false);
          setIsSettingsOpen(true);
        }}
        logs={operationLogs}
        onExportCSV={handleExportOperationLogs}
        onClearLogs={() => setOperationLogs([])}
      />

      <CancelReasonModal
        isOpen={isCancelReasonOpen}
        onClose={() => {
          setIsCancelReasonOpen(false);
          setCancelTargetSaleId(null);
        }}
        onConfirm={handleCancelWithReason}
        saleName={
          cancelTargetSaleId
            ? sales
              .find((s) => s.id === cancelTargetSaleId)
              ?.items.map((item) => `${item.name} × ${item.quantity}`)
              .join(", ") || ""
            : ""
        }
      />

      <ThankYouModal
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
      />

      <UnshippedItemsModal
        isOpen={isUnshippedItemsOpen}
        onClose={() => setIsUnshippedItemsOpen(false)}
        shippingItems={shippingItems}
        onMarkAsShipped={handleMarkAsShipped}
      />

      <ThemeModal
        isOpen={isThemeOpen}
        onClose={() => {
          setIsThemeOpen(false);
          setIsSettingsOpen(true);
        }}
        currentTheme={themeMode}
        currentColor={themeColor}
        onThemeChange={setThemeMode}
        onColorChange={setThemeColor}
      />

      <ToastNotification
        message={toast?.message ?? null}
        toastId={toast?.id ?? 0}
        onClose={hideToast}
      />
    </div>

  );
}
