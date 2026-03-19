import { useEffect, useRef, useCallback } from "react";
import { Animated } from "react-native";
import { STACK_SCALE_STEP, STACK_TRANSLATE_STEP } from "./constants";
import { store } from "./store";

export const useToastAnimation = ({
  toast,
  index,
  position,
  expanded,
  duration,
  isPersistent,
}: any) => {
  const isTop = position.startsWith("top");

  const entryTranslateY = useRef(
    new Animated.Value(isTop ? -100 : 100),
  ).current;
  const stackTranslateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(entryTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const targetScale = expanded
      ? 1
      : Math.max(1 - index * STACK_SCALE_STEP, 0.9);

    const gap = expanded ? 72 : STACK_TRANSLATE_STEP;
    const targetTranslateY = isTop ? index * gap : -index * gap;

    Animated.parallel([
      Animated.spring(scale, { toValue: targetScale, useNativeDriver: true }),
      Animated.spring(stackTranslateY, {
        toValue: targetTranslateY,
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded, index]);

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(entryTranslateY, {
        toValue: isTop ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      store.remove(toast.id);
    });
  }, []);

  return {
    entryTranslateY,
    stackTranslateY,
    translateX,
    opacity,
    scale,
    dismiss,
  };
};
