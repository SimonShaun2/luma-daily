interface GiftProgressBarProps {
  subtotal: number;
  threshold?: number;
}

export default function GiftProgressBar({ subtotal, threshold = 60 }: GiftProgressBarProps) {
  const remaining = Math.max(threshold - subtotal, 0);
  const progress = Math.min((subtotal / threshold) * 100, 100);

  return (
    <div className="px-6 py-4 border-b border-[#E8E0D4] bg-[#FFFDF8]">
      <div className="flex items-center justify-between gap-4 mb-2">
        <p className="font-body text-xs font-600 text-[#1E1B16]">
          {remaining > 0
            ? `Add $${remaining.toFixed(2)} more for free shipping`
            : "Free shipping unlocked"}
        </p>
        <span className="font-body text-[10px] font-600 text-[#C8813A]">
          ${threshold.toFixed(0)} goal
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#E8E0D4] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#C8813A] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
