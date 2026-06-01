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

  if (isOnline) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-destructive/20 text-destructive rounded text-xs">
      <WifiOff className="w-3 h-3" />
      <span>オフライン</span>
    </div>
  );
}
