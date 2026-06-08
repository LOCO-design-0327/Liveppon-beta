import { Wifi, WifiOff, X } from "lucide-react";
import { useState, useEffect } from "react";

export function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setShowInfo(true)}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${isOnline
            ? "bg-green-500/20 text-green-400"
            : "bg-orange-500/20 text-orange-400"
          }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>オンライン</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>オフライン利用中</span>
          </>
        )}
      </button>

      {showInfo && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-background border border-border rounded-lg w-[600px] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold">接続状態について</h2>

              <button
                onClick={() => setShowInfo(false)}
                className="w-10 h-10 rounded hover:bg-secondary flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <p>
                Livepponは、インターネットに接続していない状態でも販売操作を続けられます。
              </p>

              <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                <p className="font-bold">🟢 オンライン</p>
                <p className="text-muted-foreground">
                  インターネットに接続されています。
                </p>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                <p className="font-bold">🟠 オフライン利用中</p>
                <p className="text-muted-foreground">
                  インターネットに接続していませんが、Livepponの基本的な販売操作はそのまま利用できます。
                </p>
              </div>

              <p className="text-muted-foreground">
                ただし、ブラウザや端末の状態によってはデータが失われる可能性があります。大切なイベント前後にはバックアップを作成しておくことをおすすめします。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
