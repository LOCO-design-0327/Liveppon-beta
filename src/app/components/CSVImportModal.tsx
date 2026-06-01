import { X, Upload, Download, Info } from "lucide-react";
import { useState, useRef } from "react";
import type { Product } from "../types";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

interface ImportResult {
  added: number;
  updated: number;
  errors: string[];
}

export function CSVImportModal({
  isOpen,
  onClose,
  onImport,
}: CSVImportModalProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const template = `id,name,price,stock,image,category,deliveryType,visible
1,缶バッジ,500,100,,グッズ,当日受渡,true
2,Tシャツ,3500,30,,アパレル,当日受渡,true
3,受注チェキ,1000,50,,特典,後日発送,true`;

    const blob = new Blob(["﻿" + template], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "liveppon_products_template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const parseCSV = (text: string): Product[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) throw new Error("CSVファイルが空です");

    const headers = lines[0].split(",").map((h) => h.trim());
    const products: Product[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      if (!row.name || row.name === "") {
        errors.push(`${i + 1}行目：商品名が空欄です`);
        continue;
      }

      const price = parseInt(row.price);
      if (isNaN(price)) {
        errors.push(`${i + 1}行目：価格が数字ではありません`);
        continue;
      }

      const stock = parseInt(row.stock);
      if (isNaN(stock)) {
        errors.push(`${i + 1}行目：在庫数が数字ではありません`);
        continue;
      }

      products.push({
        id: row.id || Date.now().toString() + i,
        name: row.name,
        price: price,
        stock: stock,
        imageUrl: row.image || undefined,
        category: row.category || undefined,
      });
    }

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }

    return products;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const products = parseCSV(text);

        if (
          confirm(
            `CSVを読み込みますか？\n\n${products.length}件の商品を読み込みます。\n同じIDの商品は上書きされ、新しいIDの商品は追加されます。`
          )
        ) {
          onImport(products);
          setImportResult({
            added: products.length,
            updated: 0,
            errors: [],
          });
        }
      } catch (error) {
        alert(
          `CSVの読み込みに失敗しました。\n\n${error instanceof Error ? error.message : "不明なエラー"}`
        );
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  if (importResult) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-background border border-border rounded-lg w-[500px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2>読み込み完了</h2>
            <button
              onClick={() => {
                setImportResult(null);
                onClose();
              }}
              className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="mb-2">CSVを読み込みました</p>
              <div className="text-sm space-y-1">
                <p>追加：{importResult.added}件</p>
                <p>更新：{importResult.updated}件</p>
                <p>エラー：{importResult.errors.length}件</p>
              </div>
            </div>

            <button
              onClick={() => {
                setImportResult(null);
                onClose();
              }}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showInfo) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-background border border-border rounded-lg w-[600px] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Info className="w-6 h-6 text-primary" />
              <h2>CSVインポートについて</h2>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg">
              <p className="text-sm mb-3">
                CSVインポート機能を使うと、一気に複数の商品を登録できます。
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>イベント前にPCで商品一覧を準備できます</li>
                <li>ExcelやGoogleスプレッドシートで編集できます</li>
                <li>商品名、価格、在庫数などを一括で登録できます</li>
                <li>前回のイベントデータを流用できます</li>
              </ul>
            </div>

            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-sm mb-2">CSV形式</h3>
              <div className="text-xs text-muted-foreground font-mono bg-muted p-3 rounded">
                id,name,price,stock,image,category
                <br />
                1,缶バッジ,500,100,,グッズ
                <br />
                2,Tシャツ,3500,30,,アパレル
              </div>
            </div>

            <button
              onClick={downloadTemplate}
              className="w-full py-3 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              CSVテンプレートをダウンロード
            </button>

            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-3 bg-secondary rounded-lg hover:bg-secondary/80"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[500px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2>CSVインポート</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
            <button
              onClick={() => setShowInfo(true)}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center"
            >
              <Info className="w-4 h-4 text-primary" />
            </button>
            <div className="flex-1">
              <p className="text-sm mb-2">
                CSVファイルから商品を一括で登録できます
              </p>
              <button
                onClick={() => setShowInfo(true)}
                className="text-sm text-primary hover:underline"
              >
                詳しい説明を見る
              </button>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            CSVファイルを選択
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={onClose}
            className="w-full py-3 bg-secondary rounded-lg hover:bg-secondary/80"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
