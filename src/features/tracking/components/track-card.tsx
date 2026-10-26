import { Colors, Fonts } from "@/@core/constants";
import { getRarityColor, withAlpha } from "@/features/items";
import { useTrackedStore } from "@/integrations/zustand/tracked-store";
import type { TrackedItem } from "@/integrations/zustand/types";
import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: TrackedItem;
  width: number;
  onPress?: (item: TrackedItem) => void;
};

export const TrackCard = memo(function TrackCard({
  item,
  width,
  onPress,
}: Props) {
  const remove = useTrackedStore((s) => s.remove);
  const color = getRarityColor(item.rarity);
  const category = [item.item_type, item.subcategory]
    .filter(Boolean)
    .join(" / ");

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, tracked`}
      style={({ pressed }) => [
        styles.card,
        { width, borderColor: withAlpha(color, 0.35) },
        pressed && styles.pressed,
      ]}
    >
      {/* Stage */}
      <View style={[styles.stage, { backgroundColor: withAlpha(color, 0.1) }]}>
        <View
          style={[styles.glow, { backgroundColor: withAlpha(color, 0.18) }]}
        />
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

        {/* Untrack */}
        <Pressable
          onPress={() => remove(item.id)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Stop tracking ${item.name}`}
          style={({ pressed }) => [styles.untrack, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.untrackText}>✕</Text>
        </Pressable>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {!!category && (
          <Text style={styles.category} numberOfLines={1}>
            {category}
          </Text>
        )}
      </View>

      {/* Loot area: the key info */}
      <View style={styles.lootWrap}>
        <View style={[styles.loot, { borderColor: withAlpha(color, 0.3) }]}>
          <Text style={styles.lootLabel}>LOOT AREA</Text>
          <Text
            style={[styles.lootValue, !item.loot_area && styles.lootEmpty]}
            numberOfLines={2}
          >
            {item.loot_area || "Unknown"}
          </Text>
        </View>
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

  stage: { height: 118, alignItems: "center", justifyContent: "center" },
  glow: { position: "absolute", width: 96, height: 96, borderRadius: 48 },
  icon: { width: 80, height: 80 },
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

  untrack: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  untrackText: { color: Colors.text, fontSize: 11, fontFamily: Fonts.bold },

  body: { paddingHorizontal: 12, paddingTop: 12, gap: 2 },
  name: { color: Colors.text, fontFamily: Fonts.bold, fontSize: 15 },
  category: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },

  lootWrap: { padding: 12 },
  loot: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  lootLabel: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  lootValue: { color: Colors.text, fontFamily: Fonts.semibold, fontSize: 13 },
  lootEmpty: { color: Colors.textSecondary, fontFamily: Fonts.regular },

  bar: { height: 3 },
});
