import React, { useMemo } from "react";
import {
  Animated,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import { typeColors, typeIcons, ToastType } from "./constants";
import { makeStyles } from "./styles";
import { useToastAnimation } from "./useToastAnimation";
import { useToastGesture } from "./useToastGesture";
import { store } from "./store";

export const ToastItem = ({
  toast,
  position,
  index,
  expanded,
  defaultDuration,
}: any) => {
  const { width } = useWindowDimensions();

  const sf = Math.min(Math.max(width / 390, 0.82), 1.2);
  const s = (n: number) => Math.round(n * sf);
  const styles = useMemo(() => makeStyles(s), [sf]);

  const duration = toast.duration ?? defaultDuration;
  const isPersistent = duration === Infinity;

  const colors = typeColors[(toast.type as ToastType) || "default"];

  const animation = useToastAnimation({
    toast,
    index,
    position,
    expanded,
    duration,
    isPersistent,
  });

  const panResponder = useToastGesture({
    translateX: animation.translateX,
    opacity: animation.opacity,
    toast,
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          transform: [
            {
              translateY: Animated.add(
                animation.entryTranslateY,
                animation.stackTranslateY,
              ),
            },
            { translateX: animation.translateX },
            { scale: animation.scale },
          ],
          opacity: animation.opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.iconSection}>
        {toast.type === "loading" ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <View style={[styles.iconBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.iconText}>
              {typeIcons[(toast.type as ToastType) || "default"]}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {toast.title}
        </Text>
        {toast.description && (
          <Text style={styles.description}>{toast.description}</Text>
        )}
      </View>

      <Pressable onPress={() => store.remove(toast.id)}>
        <Text>✕</Text>
      </Pressable>
    </Animated.View>
  );
};
