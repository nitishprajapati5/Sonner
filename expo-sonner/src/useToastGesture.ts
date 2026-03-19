import { useRef } from "react";
import { PanResponder, Animated } from "react-native";
import { SWIPE_DISMISS_THRESHOLD } from "./constants";
import { store } from "./store";

export const useToastGesture = ({ translateX, opacity, toast }: any) => {
  return useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10,

      onPanResponderMove: (_, g) => {
        translateX.setValue(g.dx);
        opacity.setValue(Math.max(0, 1 - Math.abs(g.dx) / 200));
      },

      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > SWIPE_DISMISS_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: g.dx > 0 ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => store.remove(toast.id));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;
};
