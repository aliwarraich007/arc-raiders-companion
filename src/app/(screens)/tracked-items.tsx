import { Colors, Spacing } from "@/@core/constants";
import { ThemedText } from "@/@ui/components/themed-text";
import { TrackCard } from "@/features/tracking/components/track-card";
import { useTrackedStore } from "@/integrations/zustand/tracked-store";
import { useMemo } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackedItems() {
  const tracked = useTrackedStore((s) => s.tracked);
  const list = useMemo(
    () => Object.values(tracked).sort((a, b) => b.trackedAt - a.trackedAt),
    [tracked],
  );
  const { width } = useWindowDimensions();
  const cardWidth = width - Spacing.two;
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {!list.length ? (
        <View style={styles.empty}>
          <ThemedText type="smallBold">Track items to see here</ThemedText>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <TrackCard item={item.item} width={cardWidth} />
          )}
          ItemSeparatorComponent={<View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, padding: Spacing.two },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
