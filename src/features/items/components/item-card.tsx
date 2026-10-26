import { Colors, Fonts } from "@/@core/constants/theme";
import type { ArcRaidersItems } from "@/features/items/api/types";
import { useTrackedStore } from "@/integrations/zustand/tracked-store";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getCategory, getRarityColor, withAlpha } from "../utils";

type Props = {
  item: ArcRaidersItems;
  width: number;
  onPress: (item: ArcRaidersItems) => void;
};

export const ItemCard = memo(function ItemCard({
  item,
  width,
  onPress,
}: Props) {
  const color = getRarityColor(item.rarity);
  const category = getCategory(item);
  const isTracked = useTrackedStore((s) => !!s.tracked[item.id]);
  const toggle = useTrackedStore((s) => s.toggle);
  const handleLongPress = async () => {
    toggle(item);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn("Haptic feedback unavailable:", error);
    }
  };

  return (
    <Pressable
      onPress={() => onPress(item)}
      onLongPress={handleLongPress}
      delayLongPress={350}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.rarity ?? "unknown rarity"}`}
      accessibilityHint="Long press to track or untrack"
      style={({ pressed }) => [
        styles.card,
        {
          width,
          borderColor: withAlpha(color, 0.35),
          justifyContent: "space-between",
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.stage, { backgroundColor: withAlpha(color, 0.1) }]}>
        <View style={[{ backgroundColor: withAlpha(color, 0.18) }]} />
        {item.icon ? (
          <Image
            source={item.icon}
            style={styles.icon}
            contentFit="contain"
            cachePolicy="disk"
            transition={150}
          />
        ) : (
          <Text style={[styles.fallback, { color }]}>
            {item.name.charAt(0)}
          </Text>
        )}
        {!!item.rarity && (
          <View
            style={[styles.pill, { backgroundColor: withAlpha(color, 0.22) }]}
          >
            <Text style={[styles.pillText, { color }]}>{item.rarity}</Text>
          </View>
        )}
      </View>

      {isTracked && (
        <View style={styles.qty}>
          <Text style={styles.qtyText}>★ Tracked</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {category || "Uncategorized"}
        </Text>
        {item.value != null && (
          <Text style={styles.value}>
            <Text style={{ color: Colors.primary }}>◆ </Text>
            {item.value.toLocaleString()}
          </Text>
        )}
      </View>

      <View style={[styles.bar, { backgroundColor: color }]} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundElement,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  stage: {
    height: 118,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { width: 100, height: 100 },
  fallback: { fontFamily: Fonts.bold, fontSize: 36 },
  pill: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  body: { padding: 12, gap: 2 },
  name: { color: Colors.text, fontFamily: Fonts.bold, fontSize: 15 },
  category: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  value: {
    marginTop: 6,
    color: Colors.text,
    fontFamily: Fonts.semibold,
    fontSize: 13,
  },
  bar: { height: 3 },
  qty: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  qtyText: { color: Colors.onPrimary, fontFamily: Fonts.bold, fontSize: 11 },
});
