export const SWIPE_DISMISS_THRESHOLD = 60;
export const STACK_SCALE_STEP = 0.05;
export const STACK_TRANSLATE_STEP = 14;

export type ToastType = "default" | "success" | "error" | "warning" | "loading";

export const typeIcons: Record<ToastType, string> = {
  default: "✦",
  success: "✓",
  error: "✕",
  warning: "!",
  loading: "",
};

export const typeColors = {
  default: {
    bg: "#ffffff",
    border: "#e5e7eb",
    accent: "#111827",
    text: "#111827",
  },
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    accent: "#10b981",
    text: "#064e3b",
  },
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    accent: "#ef4444",
    text: "#7f1d1d",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
    text: "#78350f",
  },
  loading: {
    bg: "#f5f3ff",
    border: "#ddd6fe",
    accent: "#6366f1",
    text: "#2e1065",
  },
};
