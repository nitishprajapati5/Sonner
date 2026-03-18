import { useState, useEffect } from "react";
import { store } from "./store";
import { ToastT } from "./types";

export function useToastStore(): ToastT[] {
  const [toasts, setToasts] = useState<ToastT[]>(store.toasts);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setToasts(store.toasts);
    });
    return unsubscribe;
  }, []);

  return toasts;
}
