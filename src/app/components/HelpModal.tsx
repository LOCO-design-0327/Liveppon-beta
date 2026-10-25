import { X, HelpCircle, ShoppingBag, Package, CreditCard, FlaskConical } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToSettings?: () => void;
}

export function HelpModal({ isOpen, onClose, onBackToSettings }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-background border border-border rounded-lg w-[700px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2>使い方</h2>
          </div>
          <button
            onClick={onBackToSettings || onClose}
            className="w-10 h-10 rounded hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-primary" />
              はじめに
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Livepponは、ライブやイベント向けの物販POSアプリです。iPadの横画面で使用することを想定しています。
            </p>
          </section>

          <section>
            <h3 className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-primary" />
              販売する
            </h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>販売画面で商品カードをタップしてカートに追加</li>
              <li>必要に応じてカート内の＋／−で数量を調整</li>
              <li>「お会計へ進む」をタップ</li>
              <li>会計画面で決済方法を選択</li>
              <li>金額を確認して決済を完了</li>
            </ol>
          </section>

          <section>
            <h3 className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              決済する
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm mb-2">
                  <strong>現金決済の場合：</strong>
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                  <li>預かり金額を入力（¥1,000/¥5,000などのボタン使用可）</li>
                  <li>お釣りが自動計算されます</li>
                  <li>預かり金額が合計金額以上になると決済完了できます</li>
                </ul>
              </div>
              <div>
                <p className="text-sm mb-2">
                  <strong>QRコード決済の場合：</strong>
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                  <li>表示されたQRコードをお客様に提示</li>
                  <li>お客様がスキャン後、「決済完了」ボタンをタップ</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 mb-3">
              <FlaskConical className="w-5 h-5 text-primary" />
              テストモードを使う
            </h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>設定画面から「テストモード」を開く</li>
              <li>「テストモードを開始」ボタンをタップ</li>
              <li>通常通り販売操作を練習</li>
              <li>終了時は「テストモードを終了」ボタンをタップ</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              ※テストモード中の販売は履歴に記録されず、在庫も減りません
            </p>
          </section>

          <section>
            <h3 className="mb-3">困ったとき</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>商品を編集したい：</strong>
                <br />
                販売画面右上の「編集」から商品を追加・編集します。チーム販売ではオーナーPINが必要です。
              </p>
              <p>
                <strong>販売をキャンセルしたい：</strong>
                <br />
                販売履歴で対象の取引をタップし、右側に表示された「取引キャンセル」から操作します。
              </p>
              <p>
                <strong>データをバックアップしたい：</strong>
                <br />
                設定画面→バックアップから「バックアップを書き出す」を実行します。読み込みは現在のデータを上書きします。
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3">販売履歴を出力する</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              販売履歴画面からCSV・PDF形式で販売記録を出力できます。出力にはオーナーモードが必要です。
            </p>
          </section>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
