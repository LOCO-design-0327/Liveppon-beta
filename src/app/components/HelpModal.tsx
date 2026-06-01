import { X, HelpCircle, ShoppingBag, Package, CreditCard, FlaskConical } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToSettings?: () => void;
}

export function HelpModal({ isOpen, onClose, onBackToSettings }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-[800px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2>使い方</h2>
          </div>
          <button
            onClick={onBackToSettings || onClose}
            className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center"
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
              <li>数量を調整する場合は＋/－ボタンを使用</li>
              <li>決済方法（現金/QR）を選択</li>
              <li>「お会計へ進む」ボタンをタップ</li>
              <li>決済画面で金額を確認し、決済完了</li>
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
                  <li>「決済完了」ボタンをタップ</li>
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
                設定画面→商品設定からオーナーモードでログインして編集
              </p>
              <p>
                <strong>販売をキャンセルしたい：</strong>
                <br />
                販売履歴画面から該当の販売を選び、キャンセルボタンをタップ
              </p>
              <p>
                <strong>データをバックアップしたい：</strong>
                <br />
                設定画面→バックアップから「バックアップを書き出す」を実行
              </p>
            </div>
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
