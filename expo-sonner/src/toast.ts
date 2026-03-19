import { store } from "./store";
import { ToastT, ExternalToast } from "./types";

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${toastCount}-${Date.now()}`;
}

function createToast(
  type: ToastT["type"],
  title: string,
  options?: ExternalToast,
): string {
  const id = options?.id ?? genId();
  store.add({
    ...options,
    id,
    type,
    title,
    createdAt: Date.now(),
  } as ToastT);
  return id;
}

function toast(title: string, options?: ExternalToast): string {
  return createToast("default", title, options);
}

toast.success = (title: string, options?: ExternalToast) =>
  createToast("success", title, options);

toast.error = (title: string, options?: ExternalToast) =>
  createToast("error", title, options);

toast.warning = (title: string, options?: ExternalToast) =>
  createToast("warning", title, options);

toast.loading = (title: string, options?: ExternalToast) =>
  createToast("loading", title, { duration: Infinity, ...options });

type PromiseData<T> = {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: unknown) => string);
} & Omit<ExternalToast, "id">;

toast.promise = <T>(promise: Promise<T>, data: PromiseData<T>): Promise<T> => {
  const id = genId();

  store.add({
    id,
    type: "loading",
    title: data.loading,
    duration: Infinity,
    createdAt: Date.now(),
  });

  promise
    .then((result) => {
      const title =
        typeof data.success === "function"
          ? data.success(result)
          : data.success;
      store.update(id, { type: "success", title, duration: undefined });
    })
    .catch((err) => {
      const title =
        typeof data.error === "function" ? data.error(err) : data.error;
      store.update(id, { type: "error", title, duration: undefined });
    });

  return promise;
};

toast.dismiss = (id?: string) => {
  if (id) {
    store.remove(id);
  } else {
    store.dismissAll();
  }
};

toast.custom = (title: string, options?: ExternalToast) =>
  createToast("default", title, options);

export { toast };
