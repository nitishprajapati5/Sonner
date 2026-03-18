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
  const toastWidth = Math.min(width - 32, 420);

  if (toasts.length === 0) return null;

  return (
    <Modal
      visible={toasts.length > 0}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => setExpanded((v) => !v)}
        pointerEvents="box-none"
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.stack,
              isTop ? { top: safeOffset } : { bottom: safeOffset },
              { width: toastWidth },
              style,
            ]}
          >
            {visibleSlice.map((t, index) => (
              <ToastItem
                key={t.id}
                toast={{ ...toastOptions, ...t }}
                index={index}
                totalVisible={visibleSlice.length}
                expanded={expanded}
                defaultDuration={duration}
              />
            ))}
          </View>
        </View>
      </Pressable>
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
    alignSelf: "center",
    left: 16,
    right: 16,
  },
});
