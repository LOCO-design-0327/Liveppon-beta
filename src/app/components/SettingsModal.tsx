import { X, Package, QrCode, Layers, Database, Archive, FileText, Shield, Key, FlaskConical, HelpCircle, Trash2, Palette } from "lucide-react";
import { SettingsCard } from "./SettingsCard";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOwnerMode: boolean;
  onOwnerLogin: () => void;
  onOwnerLogout: () => void;
  onOpenProductSettings: () => void;
  onOpenQRSettings: () => void;
  onOpenSceneManagement: () => void;
  onOpenBackup: () => void;
  onOpenArchive: () => void;
  onOpenOperationLog: () => void;
  onOpenPinChange: () => void;
  onOpenTestMode: () => void;
  onOpenHelp: () => void;
  onOpenReset: () => void;
  onOpenTheme: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  isOwnerMode,
  onOwnerLogin,
  onOwnerLogout,
  onOpenProductSettings,
  onOpenQRSettings,
  onOpenSceneManagement,
  onOpenBackup,
  onOpenArchive,
  onOpenOperationLog,
  onOpenPinChange,
  onOpenTestMode,
  onOpenHelp,
  onOpenReset,
  onOpenTheme,
}: SettingsModalProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isOwnerModeInfoOpen, setIsOwnerModeInfoOpen] = useState(false);
  if (!isOpen) return null;

  const handleCardClick = (requiresOwner: boolean, action: () => void) => {
    if (requiresOwner && !isOwnerMode) {
      onOwnerLogin();
    } else {
      action();
    }
  };

  const handleOwnerModeToggle = () => {
    if (isOwnerMode) {
      if (confirm("オーナーモードを終了しますか？")) {
        onOwnerLogout();
      }
    } else {
      onOwnerLogin();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-background border border-border rounded-lg w-[90vw] max-w-6xl h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >

          {isOwnerMode && (
            <div className="bg-primary text-primary-foreground px-6 py-2 flex items-center justify-center gap-4">
              <span>オーナーモード中です</span>
              <button
                onClick={() => {
                  if (confirm("オーナーモードを終了しますか？")) {
                    onOwnerLogout();
                  }
                }}
                className="px-3 py-1 bg-primary-foreground text-primary rounded text-sm hover:opacity-90"
              >
                終了する
              </button>
            </div>
          )}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="mb-1">設定</h2>

                <button
                  type="button"
                  onClick={() => setIsAboutOpen(true)}
                  className="text-sm text-primary hover:opacity-80"
                >
                  About Liveppon
                </button>
              </div>

              <p className="text-sm text-muted-foreground">
                Livepponの管理・保存・練習・オーナー設定を行います
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-4">基本設定</h3>
              <div className="grid grid-cols-5 gap-3">
                <SettingsCard
                  icon={HelpCircle}
                  title="使い方"
                  description="基本操作を確認"
                  onClick={onOpenHelp}
                />
                <SettingsCard
                  icon={FlaskConical}
                  title="テストモード"
                  description="履歴に残さず練習"
                  onClick={onOpenTestMode}
                />
                <SettingsCard
                  icon={Package}
                  title="商品設定"
                  description="商品登録・価格・在庫を編集"
                  isLocked={!isOwnerMode}
                  onClick={() =>
                    handleCardClick(true, onOpenProductSettings)
                  }
                />
                <SettingsCard
                  icon={QrCode}
                  title="QRコード設定"
                  description="決済用QR画像を登録"
                  isLocked={!isOwnerMode}
                  onClick={() =>
                    handleCardClick(true, onOpenQRSettings)
                  }
                />
                <SettingsCard
                  icon={Palette}
                  title="テーマ"
                  description="配色・表示モードを設定"
                  onClick={onOpenTheme}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-4">
                データ管理
              </h3>
              <div className="grid grid-cols-5 gap-3">
                <SettingsCard
                  icon={Layers}
                  title="シーン管理"
                  description="イベントごとの状態を保存"
                  isLocked={!isOwnerMode}
                  onClick={() =>
                    handleCardClick(true, onOpenSceneManagement)
                  }
                />
                <SettingsCard
                  icon={Database}
                  title="バックアップ"
                  description="データを書き出し・読み込み"
                  isLocked={!isOwnerMode}
                  onClick={() => handleCardClick(true, onOpenBackup)}
                />
                <SettingsCard
                  icon={Archive}
                  title="イベントアーカイブ"
                  description="終了したイベントを保存"
                  isLocked={!isOwnerMode}
                  onClick={() => handleCardClick(true, onOpenArchive)}
                />
                <SettingsCard
                  icon={FileText}
                  title="操作ログ"
                  description="重要操作の履歴を確認"
                  isLocked={!isOwnerMode}
                  onClick={() =>
                    handleCardClick(true, onOpenOperationLog)
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-4">
                オーナー設定
              </h3>
              <div className="grid grid-cols-5 gap-3">
                <SettingsCard
                  icon={Shield}
                  title={isOwnerMode ? "オーナーモード中" : "オーナーモード"}
                  description={
                    isOwnerMode
                      ? "重要操作が利用可能です"
                      : "PINで重要操作を解放"
                  }
                  onClick={() => setIsOwnerModeInfoOpen(true)} />
                <SettingsCard
                  icon={Key}
                  title="PIN変更"
                  description="オーナーPINを変更"
                  isLocked={!isOwnerMode}
                  onClick={() => handleCardClick(true, onOpenPinChange)}
                />
                <SettingsCard
                  icon={Trash2}
                  title="初期化"
                  description="全データをリセット"
                  isLocked={!isOwnerMode}
                  isDangerous
                  onClick={() => handleCardClick(true, onOpenReset)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwnerModeInfoOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
          onClick={() => setIsOwnerModeInfoOpen(false)}
        >
          <div
            className="bg-background border border-border rounded-lg w-[560px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              オーナーモードとは？
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="text-primary font-semibold mb-1">
                  何の機能か
                </h3>
                <p className="text-muted-foreground">
                  重要な設定やデータ管理機能をPINで保護する機能です。
                </p>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-1">
                  できること
                </h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ 商品設定</li>
                  <li>✓ シーン管理</li>
                  <li>✓ バックアップ</li>
                  <li>✓ PIN変更</li>
                  <li>✓ 初期化</li>
                  <li>✓ 操作ログ確認</li>
                </ul>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-1">
                  注意事項
                </h3>
                <p className="text-muted-foreground">
                  PINを忘れると管理機能を利用できません。
                </p>
                <p className="text-muted-foreground mt-2">
                  イベント中の誤操作防止のため、管理者のみ利用してください。
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsOwnerModeInfoOpen(false);
                  handleOwnerModeToggle();
                }}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground"
              >
                オーナーモード開始
              </button>

              <button
                onClick={() => setIsOwnerModeInfoOpen(false)}
                className="flex-1 py-3 rounded-lg bg-card border border-border"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {isAboutOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="bg-background border border-border rounded-lg w-[700px] max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">
              About Liveppon
            </h2>

            <div className="space-y-6">

              <div>
                <h3 className="text-primary font-semibold mb-2">
                  Version
                </h3>
                <p className="text-muted-foreground">
                  β版
                </p>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-2">
                  Developer
                </h3>
                <p className="text-muted-foreground">
                  LOCO design
                </p>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-2">
                  利用規約
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>LivepponはPOS補助アプリです。</p>
                  <p>決済代行サービスではありません。</p>
                  <p>商品の受け渡し、決済確認、現金管理、在庫管理、データ管理その他の運営上の判断については、利用者の責任で行ってください。</p>
                  <p>重要なデータは定期的にバックアップしてください。</p>
                  <p>本アプリは現状有姿で提供されます。</p>
                  <p>本アプリの利用または利用できなかったことにより発生した損害について、開発者は責任を負いません。</p>
                </div>
              </div>

              <div>
                <h3 className="text-primary font-semibold mb-2">
                  QRコード利用時の注意
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Livepponは決済代行サービスではありません。</p>
                  <p>QRコード決済を利用する場合は、ご自身で契約している決済サービスの加盟店QRコードをご利用ください。</p>
                  <p>QRコードの利用・公開方法については、各サービスの利用規約に従ってください。</p>
                </div>
              </div>

            </div>

            <button
              onClick={() => setIsAboutOpen(false)}
              className="w-full mt-8 py-3 bg-primary text-primary-foreground rounded-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
