import { FaArrowUp } from "react-icons/fa";

type BackToTopButtonProps = {
  visible: boolean;
  onClick: () => void;
};

export function BackToTopButton({
  visible,
  onClick,
}: BackToTopButtonProps) {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-[60] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-slate-950/85 text-slate-50 shadow-[0_18px_40px_rgba(2,6,23,0.42)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-teal-300/40 hover:text-teal-200 sm:bottom-8 sm:right-8 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <FaArrowUp className="text-sm" />
    </button>
  );
}
