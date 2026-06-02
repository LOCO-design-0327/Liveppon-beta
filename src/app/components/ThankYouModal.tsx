import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <div className="bg-background border-2 border-primary rounded-lg p-12 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <CheckCircle className="w-24 h-24 text-primary" />
        <h2 className="text-3xl">お買い上げありがとうございます</h2>
      </div>
    </div>
  );
}
