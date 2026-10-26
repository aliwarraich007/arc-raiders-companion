import { Colors, Fonts, Spacing } from "@/@core/constants/theme";
import { SearchBar } from "@/@ui/components/search-bar";
import { StyleSheet, Text, View } from "react-native";
import { RarityFilter, RarityFilterValue } from "./rarity-filter";

type Props = {
  total?: number;
  query: string;
  onQueryChange: (q: string) => void;
  rarity: RarityFilterValue;
  onRarityChange: (r: RarityFilterValue) => void;
};

export function ItemsHeader({
  total,
  query,
  onQueryChange,
  rarity,
  onRarityChange,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.eyebrow}>DATABASE</Text>
          <Text style={styles.title}>Items</Text>
        </View>
        {total != null && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{total.toLocaleString()}</Text>
          </View>
        )}
      </View>

      <View style={styles.search}>
        <SearchBar value={query} onChangeText={onQueryChange} />
      </View>
      <RarityFilter value={rarity} onChange={onRarityChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
  },
  eyebrow: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 11,
    letterSpacing: 2,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
    lineHeight: 36,
  },
  badge: {
    backgroundColor: Colors.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.semibold,
    fontSize: 13,
  },
  search: { paddingHorizontal: Spacing.three },
});
