import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Pressable, Text, ScrollView } from "react-native";
import { Toaster, toast } from "expo-sonner";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>expo-sonner</Text>

        <Pressable
          style={[styles.btn, { backgroundColor: "#6366f1" }]}
          onPress={() => toast("Event has been created")}
        >
          <Text style={styles.btnText}>Default</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#22c55e" }]}
          onPress={() =>
            toast.success("Profile saved!", {
              description: "Your changes have been applied.",
            })
          }
        >
          <Text style={styles.btnText}>Success</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#ef4444" }]}
          onPress={() =>
            toast.error("Something went wrong", {
              description: "Please try again later.",
            })
          }
        >
          <Text style={styles.btnText}>Error</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#f59e0b" }]}
          onPress={() =>
            toast.warning("Low disk space", {
              description: "You have less than 1GB remaining.",
            })
          }
        >
          <Text style={styles.btnText}>Warning</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#6366f1" }]}
          onPress={() => toast.loading("Uploading file...")}
        >
          <Text style={styles.btnText}>Loading</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#0ea5e9" }]}
          onPress={() =>
            toast.promise(new Promise((res) => setTimeout(res, 2000)), {
              loading: "Saving changes…",
              success: "Changes saved!",
              error: "Failed to save.",
            })
          }
        >
          <Text style={styles.btnText}>Promise</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#111827" }]}
          onPress={() =>
            toast.success("File ready", {
              action: {
                label: "Download",
                onClick: () => console.log("Download pressed"),
              },
            })
          }
        >
          <Text style={styles.btnText}>With Action</Text>
        </Pressable>

        {/* Custom icon demo */}
        <Pressable
          style={[styles.btn, { backgroundColor: "#ec4899" }]}
          onPress={() =>
            toast("You've got mail!", {
              icon: <Ionicons name="mail" size={18} color="#111827" />,
              description: "Open your inbox to read.",
            })
          }
        >
          <Text style={styles.btnText}>Custom Icon</Text>
        </Pressable>

        {/* Stack test: fires 3 toasts in quick succession */}
        <Pressable
          style={[styles.btn, { backgroundColor: "#7c3aed" }]}
          onPress={() => {
            toast.success("First toast");
            setTimeout(() => toast.error("Second toast"), 300);
            setTimeout(() => toast.warning("Third toast"), 600);
          }}
        >
          <Text style={styles.btnText}>Stack Test (3 toasts)</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: "#9ca3af" }]}
          onPress={() => toast.dismiss()}
        >
          <Text style={styles.btnText}>Dismiss All</Text>
        </Pressable>
      </ScrollView>

      <Toaster position="top-right" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 60,
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
