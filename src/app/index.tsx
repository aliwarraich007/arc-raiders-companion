import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignIn = () => {
    // TODO: real Google auth, then:
    //router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image
          style={StyleSheet.absoluteFill}
          source={require("@/assets/arc/arc-header.jpg")}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={styles.fade}
        />
      </View>

      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.four },
        ]}
      >
        <View style={styles.textBlock}>
          <ThemedText style={styles.title}>Raiders Companion</ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your loadouts, plan your runs, and stay ahead of the topside.
          </ThemedText>
        </View>

        <Pressable
          onPress={handleSignIn}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Ionicons name="logo-google" size={20} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>
            Continue with Google
          </ThemedText>
        </Pressable>

        <ThemedText style={styles.legal}>
          By continuing you agree to our Terms and Privacy Policy.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    // ...StyleSheet.absoluteFillObject,
    height: "62%",
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  textBlock: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    lineHeight: 42,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: Colors.textSecondary,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  legal: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    textAlign: "center",
    color: Colors.textSecondary,
  },
});
