import { useState } from "react";
import { X, ChevronRight } from "lucide-react";

interface AppInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AppInfoModal({
    isOpen,
    onClose,
}: AppInfoModalProps) {
    const isDarkMode = document.documentElement.classList.contains("dark");

    const [aboutPage, setAboutPage] = useState<
        "home" | "about" | "developer" | "backup" | "changelog" | "terms" | "qr"
    >("home");

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
            onClick={() => {
                setAboutPage("home");
                onClose();
            }}
        >
            <div
                className="bg-background border border-border rounded-lg w-[700px] max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
                    <h2 className="text-xl font-bold">
                        {aboutPage === "home"
                            ? "About Liveppon"
                            : aboutPage === "about"
                                ? "Livepponについて"
                                : aboutPage === "developer"
                                    ? "開発者情報"
                                    : aboutPage === "backup"
                                        ? "バックアップについて"
                                        : aboutPage === "changelog"
                                            ? "更新履歴"
                                            : aboutPage === "terms"
                                                ? "利用規約"
                                                : "QRコード利用時の注意"
                        }
                    </h2>

                    <button
                        onClick={() => {
                            setAboutPage("home");
                            onClose();
                        }}
                        className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6">
                    {aboutPage === "home" && (
                        <>
                            <div className="rounded-lg border border-border bg-card p-4">

                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={
                                            isDarkMode
                                                ? "/liveppon-symbol-dark.svg"
                                                : "/liveppon-symbol-light.svg"
                                        }
                                        alt="Liveppon"
                                        className="h-16 w-auto mb-4"
                                    />

                                    <img
                                        src={
                                            isDarkMode
                                                ? "/liveppon-logo-dark.svg"
                                                : "/liveppon-logo-light.svg"
                                        }
                                        alt="Liveppon Logo"
                                        className="h-11 w-auto mb-4"
                                    />
                                </div>

                                {/*<h3 className="text-primary font-semibold mb-2">Liveppon</h3>*/}
                                <p className="text-sm text-muted-foreground">
                                    ライブ物販を、もっとスマートに。
                                </p>
                                <p className="text-xs text-muted-foreground mt-3">Version β版</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Developer：LOCO design
                                </p>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-3">基本情報</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setAboutPage("about")}
                                        className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80 flex items-center justify-between"
                                    >
                                        <span>Livepponについて</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setAboutPage("developer")}
                                        className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80 flex items-center justify-between"
                                    >
                                        <span>開発者情報</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-3">サポート</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setAboutPage("backup")}
                                        className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80 flex items-center justify-between"
                                    >
                                        <span>バックアップについて</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setAboutPage("changelog")}
                                        className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80 flex items-center justify-between"
                                    >
                                        <span>更新履歴</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-3">規約</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setAboutPage("terms")}
                                        className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80 flex items-center justify-between">
                                        <span>利用規約</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setAboutPage("qr")}
                                        className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80 flex items-center justify-between">
                                        <span>QRコード利用時の注意</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {aboutPage === "about" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    Livepponとは？
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Livepponは、ライブ・イベント物販向けに作られた販売支援アプリです。
                                    商品管理、販売履歴、売上集計、QRコード決済の補助、バックアップなどをシンプルに行えます。
                                </p>
                            </div>
                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    できること
                                </h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>✓ 商品登録・編集</li>
                                    <li>✓ 販売操作</li>
                                    <li>✓ 販売履歴の確認</li>
                                    <li>✓ 売上サマリー確認</li>
                                    <li>✓ QRコード決済の補助</li>
                                    <li>✓ バックアップ・復元</li>
                                </ul>
                            </div>
                            <button
                                onClick={() => setAboutPage("home")}
                                className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80"
                            >
                                戻る
                            </button>
                        </div>
                    )}

                    {aboutPage === "developer" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    開発者情報
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Livepponは、LOCO designによって制作・開発されています。
                                </p>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    Developer
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    LOCO design
                                </p>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    制作方針
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    ライブ・イベント物販の現場で、販売操作や売上確認をよりスムーズに行えることを目指して開発しています。
                                </p>
                            </div>

                            <button
                                onClick={() => setAboutPage("home")}
                                className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80"
                            >
                                戻る
                            </button>
                        </div>
                    )}

                    {aboutPage === "backup" && (
                        <div className="space-y-6">

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    バックアップとは？
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    商品情報や販売履歴などの重要なデータを保存する機能です。
                                </p>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    保存される内容
                                </h3>

                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>✓ 商品情報</li>
                                    <li>✓ 商品画像</li>
                                    <li>✓ カテゴリ</li>
                                    <li>✓ シーン情報</li>
                                    <li>✓ 販売履歴</li>
                                    <li>✓ 売上データ</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    推奨タイミング
                                </h3>

                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• イベント前</li>
                                    <li>• イベント終了後</li>
                                    <li>• CSVインポート前</li>
                                    <li>• 大きな設定変更前</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    注意事項
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    バックアップを取得していない場合、端末故障やデータ消失時に復元できない可能性があります。
                                </p>
                            </div>

                            <button
                                onClick={() => setAboutPage("home")}
                                className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80"
                            >
                                戻る
                            </button>

                        </div>
                    )}

                    {aboutPage === "terms" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    利用規約
                                </h3>

                                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                                    <p>LivepponはPOS補助アプリです。</p>
                                    <p>決済代行サービスではありません。</p>
                                    <p>
                                        商品の受け渡し、決済確認、現金管理、在庫管理、データ管理その他の運営上の判断については、利用者の責任で行ってください。
                                    </p>
                                    <p>重要なデータは定期的にバックアップしてください。</p>
                                    <p>本アプリは現状有姿で提供されます。</p>
                                    <p>
                                        本アプリの利用または利用できなかったことにより発生した損害について、開発者は責任を負いません。
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setAboutPage("home")}
                                className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80"
                            >
                                戻る
                            </button>
                        </div>
                    )}

                    {aboutPage === "qr" && (
                        <div className="space-y-6">

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    QRコード利用時の注意
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Livepponは決済代行サービスではありません。
                                </p>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    ご利用について
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    QRコード決済を利用する場合は、ご自身で契約している決済サービスの加盟店QRコードをご利用ください。
                                </p>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    注意事項
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    QRコードの利用・公開方法については、各決済サービスの利用規約に従ってください。
                                </p>
                            </div>

                            <button
                                onClick={() => setAboutPage("home")}
                                className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80"
                            >
                                戻る
                            </button>

                        </div>
                    )}

                    {aboutPage === "changelog" && (
                        <div className="space-y-6">

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    Version 0.9.0 β
                                </h3>

                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Liveppon公式ロゴ追加</li>
                                    <li>• PWA対応</li>
                                    <li>• PWAアイコン追加</li>
                                    <li>• About Liveppon追加</li>
                                    <li>• バックアップ機能改善</li>
                                    <li>• 最終バックアップ日時表示追加</li>
                                    <li>• 未保存状態表示追加</li>
                                    <li>• 在庫警告UI追加</li>
                                    <li>• QR決済確認文言追加</li>
                                    <li>• 各種ヘルプモーダル追加</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-primary font-semibold mb-2">
                                    今後の予定
                                </h3>

                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• 初回チュートリアル</li>
                                    <li>• UI改善</li>
                                    <li>• テスターFB反映</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => setAboutPage("home")}
                                className="w-full rounded-lg bg-secondary px-4 py-3 hover:bg-secondary/80"
                            >
                                戻る
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}