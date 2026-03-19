import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  useWindowDimensions,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToastStore } from "./useToastStore";
import { ToastItem } from "./ToastItem";
import { ToasterProps } from "./types";

const DEFAULT_DURATION = 4000;
const DEFAULT_VISIBLE_TOASTS = 3;
const DEFAULT_OFFSET = 16;

export const Toaster: React.FC<ToasterProps> = ({
  position = "top-center",
  duration = DEFAULT_DURATION,
  visibleToasts = DEFAULT_VISIBLE_TOASTS,
  expand = false,
  offset = DEFAULT_OFFSET,
  style,
  toastOptions,
}) => {
  const toasts = useToastStore();
  const [expanded, setExpanded] = useState(expand);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isTop = position.startsWith("top");
  const visibleSlice = toasts.slice(0, visibleToasts);

  const safeOffset = offset + (isTop ? insets.top : insets.bottom);
  const TOAST_HEIGHT = 64; // estimated per toast
  const COLLAPSED_STACK_HEIGHT = TOAST_HEIGHT + (visibleSlice.length - 1) * 14;
  const EXPANDED_STACK_HEIGHT = visibleSlice.length * (TOAST_HEIGHT + 8);
  const stackHeight = expanded ? EXPANDED_STACK_HEIGHT : COLLAPSED_STACK_HEIGHT;

  // Responsive width: use full width on small screens, cap on large screens
  const horizontalPadding = width < 380 ? 12 : 16;
  const toastWidth = Math.min(width - horizontalPadding * 2, 420);

  // Horizontal alignment based on position
  const isRight = position.endsWith("right");
  const isLeft = position.endsWith("left");
  const hAlign = isRight
    ? { right: horizontalPadding }
    : isLeft
      ? { left: horizontalPadding }
      : { alignSelf: "center" as const };

  if (toasts.length === 0) return null;

  return (
    <Modal
      visible={toasts.length > 0}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable
          style={[
            styles.stack,
            isTop ? { top: safeOffset } : { bottom: safeOffset },
            { width: toastWidth, minHeight: stackHeight },
            hAlign,
            style,
          ]}
          onPress={() => setExpanded((v) => !v)}
        >
          {visibleSlice.map((t, index) => (
              <ToastItem
                key={t.id}
                toast={{ ...toastOptions, ...t }}
                position={position}
                index={index}
                totalVisible={visibleSlice.length}
                expanded={expanded}
                defaultDuration={duration}
              />
            ))}
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    alignItems: "center",
    pointerEvents: "box-none",
  },
  stack: {
    position: "absolute",
  },
});
