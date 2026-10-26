import { Colors, Fonts } from "@/@core/constants/theme";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search items...",
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.glyph}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        selectionColor={Colors.primary}
        accessibilityLabel="Search items"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={styles.clear}
        >
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  glyph: { color: Colors.textSecondary, fontSize: 20, marginTop: -2 },
  input: {
    flex: 1,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 15,
    paddingVertical: 0,
  },
  clear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.backgroundSelected,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: { color: Colors.textSecondary, fontSize: 11 },
});
