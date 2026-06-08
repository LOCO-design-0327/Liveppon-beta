import { Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";

export function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    <div
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
    </div>
  );
}
