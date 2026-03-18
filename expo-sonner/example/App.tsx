import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { Toaster, toast } from "expo-sonner";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>expo-sonner</Text>

        <Pressable
          style={[styles.btn, { backgroundColor: "#6366f1" }]}
          onPress={() => {
            const id = toast("Event has been created");
            console.log(
              "[toast] type: default | title: Event has been created | id:",
              id,
            );
          }}
        >
          <Text style={styles.btnText}>Default</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#22c55e" }]}
          onPress={() => {
            const id = toast.success("Profile saved!", {
              description: "Your changes have been applied.",
            });
            console.log(
              "[toast] type: success | title: Profile saved! | id:",
              id,
            );
          }}
        >
          <Text style={styles.btnText}>Success</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#ef4444" }]}
          onPress={() => {
            const id = toast.error("Something went wrong", {
              description: "Please try again later.",
            });
            console.log(
              "[toast] type: error | title: Something went wrong | id:",
              id,
            );
          }}
        >
          <Text style={styles.btnText}>Error</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#f59e0b" }]}
          onPress={() => {
            const id = toast.warning("Low disk space", {
              description: "You have less than 1GB remaining.",
            });
            console.log(
              "[toast] type: warning | title: Low disk space | id:",
              id,
            );
          }}
        >
          <Text style={styles.btnText}>Warning</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#6366f1" }]}
          onPress={() => {
            const id = toast.loading("Uploading file...");
            console.log(
              "[toast] type: loading | title: Uploading file... | id:",
              id,
            );
          }}
        >
          <Text style={styles.btnText}>Loading</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#0ea5e9" }]}
          onPress={() => {
            console.log("[toast] type: promise | title: Saving changes…");
            toast.promise(new Promise((res) => setTimeout(res, 2000)), {
              loading: "Saving changes…",
              success: "Changes saved!",
              error: "Failed to save.",
            });
          }}
        >
          <Text style={styles.btnText}>Promise</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#111827" }]}
          onPress={() => {
            const id = toast.success("File ready", {
              action: {
                label: "Download",
                onClick: () =>
                  console.log("[toast] action pressed | label: Download"),
              },
            });
            console.log("[toast] type: success | title: File ready | id:", id);
          }}
        >
          <Text style={styles.btnText}>With Action</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#9ca3af" }]}
          onPress={() => {
            console.log("[toast] dismiss all");
            toast.dismiss();
          }}
        >
          <Text style={styles.btnText}>Dismiss All</Text>
        </Pressable>
      </View>

      <Toaster position="top-center" richColors />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  btn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
