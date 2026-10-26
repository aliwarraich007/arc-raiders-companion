import { Colors, Fonts, Spacing } from "@/@core/constants/theme";
import type { ArcRaidersItems } from "@/features/home/types";
import { Image } from "expo-image";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  formatDate,
  formatValue,
  getRarityColor,
  titleize,
  withAlpha,
} from "../utils";
import { Button } from "@/@ui/components/button";

type Props = { item: ArcRaidersItems | null; onClose: () => void };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function Row({
  label,
  value,
  last,
}: {
  label: string;
  value: unknown;
  last?: boolean;
}) {
  if (value == null || value === "") return null;
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{formatValue(value)}</Text>
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Chip({ label, color }: { label: string; color?: string }) {
  const c = color ?? Colors.textSecondary;
  return (
    <View
      style={[
        styles.chip,
        { borderColor: withAlpha(c, 0.4), backgroundColor: withAlpha(c, 0.12) },
      ]}
    >
      <Text style={[styles.chipText, { color: color ?? Colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

export function ItemDetailSheet({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const color = getRarityColor(item?.rarity);

  const stats = Object.entries(item?.stat_block ?? {}).filter(
    ([, v]) => v != null && v !== "",
  );
  const locations = item?.locations ?? [];
  const guideLinks = item?.guide_links ?? [];
  const facts: [string, unknown][] = item
    ? [
        ["Type", item.item_type],
        ["Subcategory", item.subcategory],
        ["Shield type", item.shield_type],
        ["Ammo type", item.ammo_type],
        ["Loot area", item.loot_area],
      ]
    : [];
  const visibleFacts = facts.filter(([, v]) => v != null && v !== "");

  return (
    <Modal
      visible={!!item}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close details"
      />
      {item && (
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.two }]}
        >
          <View style={styles.grabber} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero */}
            <View style={styles.heroRow}>
              <View
                style={[
                  styles.hero,
                  {
                    backgroundColor: withAlpha(color, 0.12),
                    borderColor: withAlpha(color, 0.45),
                  },
                ]}
              >
                {item.icon ? (
                  <Image
                    source={item.icon}
                    style={styles.heroIcon}
                    contentFit="contain"
                    cachePolicy="disk"
                  />
                ) : (
                  <Text style={[styles.heroFallback, { color }]}>
                    {item.name.charAt(0)}
                  </Text>
                )}
              </View>
              <View style={styles.heroInfo}>
                {!!item.rarity && (
                  <Text style={[styles.rarity, { color }]}>
                    {item.rarity.toUpperCase()}
                  </Text>
                )}
                <Text style={styles.name}>{item.name}</Text>
                {item.value != null && (
                  <Text style={styles.value}>
                    <Text style={{ color: Colors.primary }}>◆ </Text>
                    {item.value.toLocaleString()}
                  </Text>
                )}
              </View>
            </View>

            {/* Loadout slots */}
            {item.loadout_slots?.length > 0 && (
              <View style={styles.chips}>
                {item.loadout_slots.map((s) => (
                  <Chip key={s} label={titleize(s)} color={Colors.primary} />
                ))}
              </View>
            )}

            {/* Description */}
            {!!item.description && (
              <Text style={styles.desc}>{item.description}</Text>
            )}
            {!!item.flavor_text && (
              <View style={[styles.quote, { borderLeftColor: color }]}>
                <Text style={styles.quoteText}>{item.flavor_text}</Text>
              </View>
            )}

            {/* Overview */}
            {visibleFacts.length > 0 && (
              <Section title="Overview">
                <Card>
                  {visibleFacts.map(([label, value], i) => (
                    <Row
                      key={label}
                      label={label}
                      value={value}
                      last={i === visibleFacts.length - 1}
                    />
                  ))}
                </Card>
              </Section>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <Section title="Stats">
                <Card>
                  {stats.map(([k, v], i) => (
                    <Row
                      key={k}
                      label={titleize(k)}
                      value={v}
                      last={i === stats.length - 1}
                    />
                  ))}
                </Card>
              </Section>
            )}

            {/* Where to find */}
            {(locations.length > 0 || item.sources != null) && (
              <Section title="Where to find">
                <Card>
                  {locations.map((loc, i) => (
                    <Row
                      key={i}
                      label={`Location ${i + 1}`}
                      value={loc}
                      last={i === locations.length - 1 && item.sources == null}
                    />
                  ))}
                  <Row label="Sources" value={item.sources} last />
                </Card>
              </Section>
            )}

            {/* Workbench */}
            {item.workbench != null && (
              <Section title="Workbench">
                <Card>
                  <Row label="Requirement" value={item.workbench} last />
                </Card>
              </Section>
            )}

            {/* Cosmetic */}
            {item.cosmetic && (
              <Section title="Cosmetic">
                <Card>
                  <Row label="Kind" value={item.cosmetic.kind} />
                  <Row
                    label="Slot"
                    value={item.cosmetic.slot}
                    last={!item.cosmetic.settings?.length}
                  />
                </Card>
                {item.cosmetic.settings?.map((s) => (
                  <View key={s.name} style={styles.setting}>
                    <Text style={styles.settingName}>{s.name}</Text>
                    <View style={styles.chips}>
                      {s.options.map((o) => (
                        <Chip key={o.name} label={o.name} />
                      ))}
                    </View>
                  </View>
                ))}
              </Section>
            )}

            {/* Guides */}
            {(item.guide_url || guideLinks.length > 0) && (
              <Section title="Guides">
                <Card>
                  {guideLinks.map((g, i) => (
                    <Row
                      key={i}
                      label={`Guide ${i + 1}`}
                      value={g}
                      last={i === guideLinks.length - 1 && !item.guide_url}
                    />
                  ))}
                </Card>
                {!!item.guide_url && (
                  <Button
                    label="Open guide ↗"
                    onPress={() => Linking.openURL(item.guide_url!)}
                  />
                )}
              </Section>
            )}

            {/* Meta */}
            <Text style={styles.meta}>
              ID {item.id}
              {formatDate(item.updated_at)
                ? `  ·  Updated ${formatDate(item.updated_at)}`
                : ""}
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Close" onPress={onClose} variant="primary" />
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    height: "88%",
    backgroundColor: Colors.backgroundElement,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginTop: 10,
  },
  content: {
    padding: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },

  heroRow: { flexDirection: "row", gap: Spacing.three, alignItems: "center" },
  hero: {
    width: 104,
    height: 104,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: { width: 84, height: 84 },
  heroFallback: { fontFamily: Fonts.bold, fontSize: 44 },
  heroInfo: { flex: 1, gap: 4 },
  rarity: { fontFamily: Fonts.bold, fontSize: 11, letterSpacing: 2 },
  name: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 28,
  },
  value: { color: Colors.text, fontFamily: Fonts.semibold, fontSize: 15 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: { fontFamily: Fonts.semibold, fontSize: 12 },

  desc: {
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  quote: { borderLeftWidth: 3, paddingLeft: 12 },
  quoteText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },

  section: { gap: Spacing.two },
  sectionTitle: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 11,
    letterSpacing: 2,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.three,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  rowValue: {
    flex: 1,
    textAlign: "right",
    color: Colors.text,
    fontFamily: Fonts.semibold,
    fontSize: 14,
  },

  setting: { gap: 6, marginTop: 4 },
  settingName: { color: Colors.text, fontFamily: Fonts.semibold, fontSize: 13 },

  meta: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 11,
    textAlign: "center",
  },
  footer: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two },
});
