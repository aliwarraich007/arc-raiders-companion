import { HubCardData } from "@/@core/constants";
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
} from "@/@core/constants/theme";
import { HubCardItem } from "@/@core/types";
import { ThemedText } from "@/@ui/components/themed-text";
import { ThemedView } from "@/@ui/components/themed-view";
import { HUB_CARD_HEIGHT, HubCard } from "@/features/hub/components/card-hub";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ITEM_GAP = Spacing.three;

export default function Hub() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const handlePress = useCallback(
    (item: HubCardItem) => router.push(item.href),
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: HubCardItem }) => (
      <HubCard item={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  return (
    <FlatList
      data={HubCardData}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      getItemLayout={(_, index) => ({
        length: HUB_CARD_HEIGHT + ITEM_GAP,
        offset: (HUB_CARD_HEIGHT + ITEM_GAP) * index,
        index,
      })}
      ListHeaderComponent={<ThemedText style={styles.title}>Hub</ThemedText>}
      ItemSeparatorComponent={Separator}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.three,
        },
      ]}
    />
  );
}

const Separator = () => <ThemedView style={{ height: ITEM_GAP }} />;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    marginBottom: Spacing.three,
  },
});
