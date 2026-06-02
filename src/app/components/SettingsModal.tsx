import { X, Package, QrCode, Layers, Database, Archive, FileText, Shield, Key, FlaskConical, HelpCircle, Trash2, Palette } from "lucide-react";
import { SettingsCard } from "./SettingsCard";

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
            <h2 className="mb-1">設定</h2>
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
                onClick={handleOwnerModeToggle}
              />
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
  );
}
