import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastNotificationProps {
  message: string | null;
  toastId: number;
  onClose: () => void;
}

export function ToastNotification({
  message,
  toastId,
  onClose,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setIsVisible(true);

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 3200);

    const closeTimer = window.setTimeout(() => {
      onClose();
    }, 3600);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(closeTimer);
    };
  }, [message, toastId, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-6 bottom-6 z-[80] pointer-events-none inline-flex max-w-[calc(100vw-3rem)] items-center gap-2 rounded-lg border border-primary/30 bg-primary px-4 py-3 text-primary-foreground shadow-lg whitespace-nowrap transform-gpu transition-all ease-out ${isVisible
        ? "translate-x-0 opacity-100 duration-200"
        : "-translate-x-4 opacity-0 duration-300"
        }`}
    >
      <CheckCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium truncate">
        {message}
      </span>
    </div>
  );
}
