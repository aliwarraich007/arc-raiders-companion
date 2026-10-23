import { Colors, Spacing } from "@/@core/constants/theme";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";

type CardProps = ViewProps & {
  onPress?: () => void;
};

export function Card({ onPress, style, children, ...rest }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundElement,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.85,
  },
});
