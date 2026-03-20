import React from "react";
import { View, Button } from "react-native";
import ToastManager, { Toast } from "expo-sonner";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Show Success Toast"
        onPress={() => {
          Toast.success("Success message!");
        }}
      />

      <Button
        title="Show Error Toast"
        onPress={() => {
          Toast.error("Error message!");
        }}
      />

      <Button
        title="Show Info Toast"
        onPress={() => {
          Toast.info("Info message!");
        }}
      />

      <Button
        title="Show Warning Toast"
        onPress={() => {
          Toast.warn("Warning message!");
        }}
      />

      {/* Toast provider should be at the root level */}
      <ToastManager />
    </View>
  );
}
