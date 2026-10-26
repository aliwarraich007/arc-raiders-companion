import { Colors, Fonts, ItemPalette, Spacing } from "@/@core/constants/theme";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { withAlpha } from "../utils";

export const RARITIES = ["all", ...Object.keys(ItemPalette)] as const;
export type RarityFilterValue = (typeof RARITIES)[number];

type Props = {
  value: RarityFilterValue;
  onChange: (value: RarityFilterValue) => void;
};

export function RarityFilter({ value, onChange }: Props) {
  return (
    <FlatList
      horizontal
      data={RARITIES}
      keyExtractor={(r) => r}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      ItemSeparatorComponent={() => <View style={{ width: Spacing.two }} />}
      renderItem={({ item }) => {
        const active = item === value;
        const color = item === "all" ? Colors.primary : ItemPalette[item];
        return (
          <Pressable
            onPress={() => onChange(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.chip,
              {
                borderColor: active ? color : Colors.border,
                backgroundColor: active
                  ? withAlpha(color, 0.18)
                  : Colors.backgroundElement,
              },
            ]}
          >
            {item !== "all" && (
              <View style={[styles.dot, { backgroundColor: color }]} />
            )}
            <Text
              style={[
                styles.label,
                { color: active ? color : Colors.textSecondary },
              ]}
            >
              {item === "all" ? "All" : item[0].toUpperCase() + item.slice(1)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: Spacing.three },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontFamily: Fonts.semibold, fontSize: 13 },
});
