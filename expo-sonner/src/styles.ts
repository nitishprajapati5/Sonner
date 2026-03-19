import { StyleSheet, Platform } from "react-native";

export const makeStyles = (s: (n: number) => number) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      flexDirection: "row",
      alignItems: "flex-start",
      borderRadius: s(12),
      padding: s(12),
      borderWidth: 1,
      minHeight: s(56),
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: s(4) },
          shadowOpacity: 0.08,
          shadowRadius: s(12),
        },
        android: {
          elevation: 3,
        },
      }),
    },
    iconSection: {
      marginRight: s(10),
      paddingTop: s(2),
    },
    iconBadge: {
      width: s(20),
      height: s(20),
      borderRadius: s(10),
      alignItems: "center",
      justifyContent: "center",
    },
    iconText: {
      color: "#fff",
      fontSize: s(10),
      fontWeight: "900",
    },
    content: {
      flex: 1,
      paddingRight: s(4),
    },
    title: {
      fontSize: s(14),
      fontWeight: "600",
    },
    description: {
      fontSize: s(13),
      color: "#6b7280",
      marginTop: s(2),
    },
    actionBtn: {
      marginTop: s(10),
      backgroundColor: "#111827",
      paddingHorizontal: s(12),
      paddingVertical: s(6),
      borderRadius: s(6),
      alignSelf: "flex-start",
    },
    actionText: {
      color: "#fff",
      fontSize: s(12),
      fontWeight: "600",
    },
    closeBtn: {
      padding: s(4),
      marginLeft: s(4),
    },
    closeText: {
      fontSize: s(12),
      color: "#9ca3af",
      fontWeight: "600",
    },
  });
