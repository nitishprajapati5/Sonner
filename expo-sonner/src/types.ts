import { StyleProp, ViewStyle, TextStyle } from "react-native";

export type ToastType = "default" | "success" | "error" | "warning" | "loading";

export type ToastPosition =
  | "top-center"
  | "bottom-center"
  | "top-right"
  | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastT {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // ms — use Infinity to persist until manually dismissed
  action?: ToastAction;
  icon?: React.ReactNode;
  onDismiss?: (toast: ToastT) => void;
  onAutoClose?: (toast: ToastT) => void;
  // Styling
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  // Internal
  createdAt?: number;
  promise?: Promise<unknown>;
}

export type ExternalToast = Omit<
  ToastT,
  "id" | "type" | "createdAt" | "title"
> & {
  id?: string;
  title?: string;
};

export interface ToasterProps {
  position?: ToastPosition;
  duration?: number;
  visibleToasts?: number;
  closeButton?: boolean;
  richColors?: boolean;
  expand?: boolean;
  offset?: number;
  style?: StyleProp<ViewStyle>;
  toastOptions?: Partial<ExternalToast>;
}

export interface ToastStore {
  toasts: ToastT[];
  add: (toast: ToastT) => void;
  remove: (id: string) => void;
  update: (id: string, toast: Partial<ToastT>) => void;
  dismissAll: () => void;
}
