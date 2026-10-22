import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export default function Home() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.heroContainer}>
        <Image
          style={styles.hero}
          contentFit="cover"
          transition={200}
          source={require("@/assets/arc/arc-header.jpg")}
        />
      </View>

      <View style={styles.content}>
        <ThemedText type="title">Arc Raiders Companion</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    // height: 280, // or use aspectRatio: 16 / 9
    aspectRatio: 4 / 3,
  },
  hero: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: Spacing.three,
  },
});
