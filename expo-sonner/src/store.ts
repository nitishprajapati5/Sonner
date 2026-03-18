import { ToastT, ToastStore } from "./types";

type Listener = (toasts: ToastT[]) => void;

class ToastStoreImpl implements ToastStore {
  toasts: ToastT[] = [];
  private listeners: Set<Listener> = new Set();

  private notify() {
    this.listeners.forEach((l) => l([...this.toasts]));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  add(toast: ToastT) {
    // Replace if same id already exists (e.g. promise updates)
    const existing = this.toasts.findIndex((t) => t.id === toast.id);
    if (existing !== -1) {
      this.toasts[existing] = { ...this.toasts[existing], ...toast };
    } else {
      this.toasts = [toast, ...this.toasts];
    }
    this.notify();
  }

  remove(id: string) {
    const toast = this.toasts.find((t) => t.id === id);
    toast?.onDismiss?.(toast);
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  update(id: string, data: Partial<ToastT>) {
    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, ...data } : t));
    this.notify();
  }

  dismissAll() {
    this.toasts.forEach((t) => t.onDismiss?.(t));
    this.toasts = [];
    this.notify();
  }
}

export const store = new ToastStoreImpl();
