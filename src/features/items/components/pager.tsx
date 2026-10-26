import { Colors, Fonts } from "@/@core/constants/theme";
import { Button } from "@/@ui/components/button";
import type { ArcRaidersItemsResponse } from "@/features/items/api/types";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  page: number;
  pagination: ArcRaidersItemsResponse["pagination"];
  onChange: (page: number) => void;
};

export function Pager({ page, pagination, onChange }: Props) {
  return (
    <View style={styles.pager}>
      <Button
        label="‹ Prev"
        disabled={!pagination.hasPrevPage}
        onPress={() => onChange(page - 1)}
      />
      <Text style={styles.text}>
        <Text style={styles.current}>{pagination.page}</Text> /{" "}
        {pagination.totalPages}
      </Text>
      <Button
        label="Next ›"
        disabled={!pagination.hasNextPage}
        onPress={() => onChange(page + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pager: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  text: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  current: { color: Colors.text, fontFamily: Fonts.bold },
});
