import { Fonts, Spacing } from "@/@core/constants/theme";
import { HubCardItem } from "@/@core/types";
import { ThemedText } from "@/@ui/components/themed-text";
import { Card } from "@/@ui/ui/card";
import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet } from "react-native";

export const HUB_CARD_HEIGHT = 112;

type Props = {
  item: HubCardItem;
  onPress: (item: HubCardItem) => void;
};

function HubCardBase({ item, onPress }: Props) {
  return (
    <Card
      onPress={() => onPress(item)}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <ThemedText style={styles.label}>{item.label}</ThemedText>
      <Image
        source={item.image}
        style={styles.image}
        contentFit="cover"
        contentPosition="left center"
        transition={200}
      />
    </Card>
  );
}

export const HubCard = memo(HubCardBase);

const styles = StyleSheet.create({
  card: {
    height: HUB_CARD_HEIGHT,
    padding: 0,
    overflow: "hidden", // clips the image to the rounded corners
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    paddingLeft: Spacing.four,
    maxWidth: "55%",
  },
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "45%",
  },
});
