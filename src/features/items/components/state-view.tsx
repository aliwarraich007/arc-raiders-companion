import { Colors, Fonts } from "@/@core/constants/theme";
import { Button } from "@/@ui/components/button";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  glyph: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StateView({
  glyph,
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.centered}>
      <View style={styles.icon}>
        <Text style={styles.glyph}>{glyph}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} variant="primary" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: { fontSize: 26, color: Colors.textSecondary },
  title: { color: Colors.text, fontFamily: Fonts.bold, fontSize: 18 },
  message: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 280,
  },
});
