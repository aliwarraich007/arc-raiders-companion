import { Colors } from "@/@core/constants/theme";
import {
  AntDesign,
  Foundation,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { Icon, VectorIcon } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { StyleSheet } from "react-native";

export default function AppTabs() {
  const colors = Colors;

  return (
    <NativeTabs
      backgroundColor={colors.backgroundElement}
      indicatorColor={colors.backgroundSelected}
      labelStyle={{ selected: { color: colors.primary } }}
    >
      <NativeTabs.Trigger name="hub">
        <NativeTabs.Trigger.Label>Hub</NativeTabs.Trigger.Label>
        <Icon
          selectedColor={colors.primary}
          src={<VectorIcon family={MaterialIcons} name="space-dashboard" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="items">
        <NativeTabs.Trigger.Label>Items</NativeTabs.Trigger.Label>
        <Icon
          selectedColor={colors.primary}
          src={<VectorIcon family={AntDesign} name="tool" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="quests">
        <NativeTabs.Trigger.Label>Quests</NativeTabs.Trigger.Label>
        <Icon
          selectedColor={colors.primary}
          src={<VectorIcon family={Foundation} name="social-treehouse" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tracked-items">
        <NativeTabs.Trigger.Label>Tracking</NativeTabs.Trigger.Label>
        <Icon
          selectedColor={colors.primary}
          src={<VectorIcon family={Octicons} name="tools" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const styles = StyleSheet.create({});
