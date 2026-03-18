import React, { useEffect, useRef, useCallback } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { ToastT } from "./types";
import { store } from "./store";

interface ToastItemProps {
  toast: ToastT;
  index: number;
  totalVisible: number;
  expanded: boolean;
  defaultDuration: number;
}

const SWIPE_DISMISS_THRESHOLD = 60;
const STACK_SCALE_STEP = 0.04;
const STACK_TRANSLATE_STEP = 10;

export const ToastItem: React.FC<ToastItemProps> = ({
  toast,
  index,
  expanded,
  defaultDuration,
}) => {
  // ✅ Split animations (IMPORTANT FIX)
  const entryTranslateY = useRef(new Animated.Value(80)).current;
  const stackTranslateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const timerProgress = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = toast.duration ?? defaultDuration;
  const isPersistent = duration === Infinity;

  // ─── Entry animation ─────────────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.spring(entryTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── Stack animation ─────────────────────────────────────────────
  useEffect(() => {
    const targetScale = expanded
      ? 1
      : Math.max(1 - index * STACK_SCALE_STEP, 0.88);

    const targetTranslateY = expanded ? 0 : index * STACK_TRANSLATE_STEP;

    Animated.parallel([
      Animated.spring(scale, {
        toValue: targetScale,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
      }),
      Animated.spring(stackTranslateY, {
        toValue: targetTranslateY,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
      }),
    ]).start();
  }, [expanded, index]);

  // ─── Dismiss ─────────────────────────────────────────────────────
  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(entryTranslateY, {
        toValue: -60,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      toast.onAutoClose?.(toast);
      store.remove(toast.id);
    });
  }, [toast]);

  // ─── Auto-dismiss ────────────────────────────────────────────────
  useEffect(() => {
    if (isPersistent) return;

    timerRef.current = setTimeout(dismiss, duration);

    Animated.timing(timerProgress, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, isPersistent]);

  // ─── Swipe gesture ───────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
      onPanResponderMove: (_, g) => {
        translateX.setValue(g.dx);
        opacity.setValue(Math.max(0, 1 - Math.abs(g.dx) / 140));
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > SWIPE_DISMISS_THRESHOLD) {
          const dir = g.dx > 0 ? 1 : -1;

          Animated.parallel([
            Animated.timing(translateX, {
              toValue: dir * 400,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }),
          ]).start(() => store.remove(toast.id));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }).start();

          Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const colors = typeColors[toast.type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: Animated.add(entryTranslateY, stackTranslateY),
            },
            { translateX },
            { scale },
          ],
          opacity,
          zIndex: 100 - index,
        },
        toast.style,
      ]}
      {...panResponder.panHandlers}
    >
      {/* Accent */}
      <View style={[styles.accent, { backgroundColor: colors.accent }]} />

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: colors.iconBg }]}>
        {toast.type === "loading" ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Text style={styles.iconText}>{typeIcons[toast.type]}</Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{toast.title}</Text>
        {toast.description && (
          <Text style={styles.description}>{toast.description}</Text>
        )}

        {toast.action && (
          <Pressable
            style={[styles.actionBtn, { borderColor: colors.accent }]}
            onPress={toast.action.onClick}
          >
            <Text style={[styles.actionText, { color: colors.accent }]}>
              {toast.action.label}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Close */}
      <Pressable onPress={() => store.remove(toast.id)}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      {/* Timer */}
      {!isPersistent && (
        <Animated.View
          style={[
            styles.timerBar,
            {
              backgroundColor: colors.accent,
              width: timerProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      )}
    </Animated.View>
  );
};

// ─── Config ─────────────────────────────────────────

const typeIcons = {
  default: "◆",
  success: "✓",
  error: "✕",
  warning: "⚠",
  loading: "",
};

const typeColors = {
  default: { accent: "#6366f1", iconBg: "#ede9fe" },
  success: { accent: "#22c55e", iconBg: "#dcfce7" },
  error: { accent: "#ef4444", iconBg: "#fee2e2" },
  warning: { accent: "#f59e0b", iconBg: "#fef3c7" },
  loading: { accent: "#6366f1", iconBg: "#ede9fe" },
};

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 8,
    paddingRight: 10,
    minHeight: 60,
    elevation: 8,
    overflow: "hidden",
  },
  accent: {
    width: 4,
    alignSelf: "stretch",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  iconText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
  },
  actionBtn: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  closeText: {
    padding: 12,
    fontSize: 12,
    color: "#9ca3af",
  },
  timerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    opacity: 0.6,
  },
});
