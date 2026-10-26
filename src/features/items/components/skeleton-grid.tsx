import { Colors } from "@/@core/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function SkeletonGrid({
  cardWidth,
  gap,
}: {
  cardWidth: number;
  gap: number;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={[styles.grid, { gap }]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Animated.View
          key={i}
          style={[styles.card, { width: cardWidth, opacity }]}
        >
          <View style={styles.stage} />
          <View style={styles.line} />
          <View style={[styles.line, { width: "50%" }]} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", padding: 16 },
  card: {
    backgroundColor: Colors.backgroundElement,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    paddingBottom: 12,
    gap: 8,
  },
  stage: { height: 118, backgroundColor: Colors.backgroundSelected },
  line: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    backgroundColor: Colors.backgroundSelected,
    width: "80%",
  },
});
