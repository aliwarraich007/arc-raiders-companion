import { ApiError } from "@/@core/helpers/api-error";
import { BottomTabInset } from "@/constants/theme";
import { useFetchItems } from "@/features/home/api";
import type {
  ArcRaidersItems,
  ArcRaidersItemsResponse,
} from "@/features/home/types"; // adjust to where your types live
import { Image } from "expo-image";
import { memo, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LIMIT = 25;

/* Worn field-manual palette: oily brown-black, parchment, safety orange. */
const COLORS = {
  bg: "#1A1814",
  panel: "#25221C",
  panelEdge: "#0F0E0B",
  line: "#3A352B",
  text: "#EADFC4",
  muted: "#9A917B",
  accent: "#F2762E",
  mustard: "#E0A93B",
};

const RARITY: Record<string, string> = {
  common: "#9A917B",
  uncommon: "#6FA05A",
  rare: "#4A8FBF",
  epic: "#A864B8",
  legendary: "#E0A93B",
};

const MONO = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

/* ---------- Row ---------- */

const ItemRow = memo(function ItemRow({ item }: { item: ArcRaidersItems }) {
  const rarityColor = RARITY[item.rarity?.toLowerCase() ?? ""] ?? COLORS.muted;
  const category = [item.item_type, item.subcategory]
    .filter(Boolean)
    .join(" / ");

  return (
    <View style={styles.card}>
      <View style={[styles.spine, { backgroundColor: rarityColor }]} />

      <View style={[styles.iconTile, { borderColor: rarityColor }]}>
        {item.icon ? (
          <Image
            source={item.icon}
            style={styles.icon}
            contentFit="contain"
            cachePolicy="disk"
            transition={150}
          />
        ) : (
          <Text style={[styles.iconFallback, { color: rarityColor }]}>
            {item.name.charAt(0)}
          </Text>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {!!category && (
          <Text style={styles.meta} numberOfLines={1}>
            {category}
          </Text>
        )}
        {!!item.description && (
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>

      <View style={styles.side}>
        {!!item.rarity && (
          <Text style={[styles.rarity, { color: rarityColor }]}>
            {item.rarity}
          </Text>
        )}
        {item.value != null && (
          <Text style={styles.value}>{item.value.toLocaleString()}</Text>
        )}
      </View>
    </View>
  );
});

/* ---------- States ---------- */

const errorCopy = (error: unknown) => {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case "network":
        return "You're offline. Check your connection and try again.";
      case "timeout":
        return "The server took too long to answer. Try again.";
      case "http":
        return error.status === 429
          ? "Too many requests. Wait a moment, then try again."
          : `The server returned an error (${error.status}).`;
      case "invalid-content":
      case "parse":
        return "The server sent data the app couldn't read.";
    }
  }
  return "Something went wrong while loading items.";
};

function Centered({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

function Button({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ItemScreen() {
  const [page, setPage] = useState(1);
  const listRef = useRef<FlatList<ArcRaidersItems>>(null);

  const { status, data, error, refetch, isRefetching, isPlaceholderData } =
    useFetchItems(page, LIMIT);

  const goToPage = useCallback((next: number) => {
    setPage(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const pagination = data?.pagination;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Item index</Text>
        <Text style={styles.subtitle}>
          {pagination
            ? `${pagination.total.toLocaleString()} items on file`
            : "Loading records..."}
        </Text>
        <View style={styles.ruleThick} />
        <View style={styles.ruleThin} />
      </View>

      {status === "pending" ? (
        <Centered>
          <ActivityIndicator color={COLORS.accent} size="large" />
          <Text style={styles.stateText}>Loading items...</Text>
        </Centered>
      ) : status === "error" ? (
        <Centered>
          <Text style={styles.stateTitle}>Couldn't load items</Text>
          <Text style={styles.stateText}>{errorCopy(error)}</Text>
          <Button label="Try again" onPress={() => refetch()} />
        </Centered>
      ) : (
        <FlatList
          ref={listRef}
          data={data.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BottomTabInset + 24 },
          ]}
          style={isPlaceholderData ? styles.dimmed : undefined}
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          initialNumToRender={10}
          windowSize={7}
          removeClippedSubviews
          ListEmptyComponent={
            <Centered>
              <Text style={styles.stateTitle}>No items found</Text>
              <Text style={styles.stateText}>
                Pull down to refresh the list.
              </Text>
            </Centered>
          }
          ListFooterComponent={
            <Pager
              page={page}
              pagination={data.pagination}
              onChange={goToPage}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function Pager({
  page,
  pagination,
  onChange,
}: {
  page: number;
  pagination: ArcRaidersItemsResponse["pagination"];
  onChange: (page: number) => void;
}) {
  return (
    <View style={styles.pager}>
      <Button
        label="Previous"
        disabled={!pagination.hasPrevPage}
        onPress={() => onChange(page - 1)}
      />
      <Text style={styles.pagerText}>
        {pagination.page} / {pagination.totalPages}
      </Text>
      <Button
        label="Next"
        disabled={!pagination.hasNextPage}
        onPress={() => onChange(page + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* header */
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontFamily: MONO,
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: MONO,
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
    marginBottom: 12,
  },
  ruleThick: {
    height: 4,
    backgroundColor: COLORS.accent,
  },
  ruleThin: {
    height: 1,
    backgroundColor: COLORS.line,
    marginTop: 3,
  },

  /* list */
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },
  dimmed: {
    opacity: 0.45,
  },

  /* card: square corners and a hard bottom/right edge for a stamped, tactile feel */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomColor: COLORS.panelEdge,
    borderRightColor: COLORS.panelEdge,
    borderRadius: 2,
    paddingVertical: 10,
    paddingRight: 12,
    gap: 12,
    overflow: "hidden",
  },
  spine: {
    width: 6,
    alignSelf: "stretch",
    marginVertical: -10,
  },
  iconTile: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 48,
    height: 48,
  },
  iconFallback: {
    fontFamily: MONO,
    fontSize: 24,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: MONO,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  meta: {
    fontFamily: MONO,
    fontSize: 11,
    color: COLORS.mustard,
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.muted,
    marginTop: 2,
  },
  side: {
    alignItems: "flex-end",
    gap: 4,
    minWidth: 56,
  },
  rarity: {
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: "700",
  },
  value: {
    fontFamily: MONO,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  /* pager */
  pager: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  pagerText: {
    fontFamily: MONO,
    fontSize: 14,
    color: COLORS.text,
  },

  /* buttons */
  button: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#A84A13",
  },
  buttonPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  buttonDisabled: {
    backgroundColor: COLORS.panel,
    borderColor: COLORS.line,
  },
  buttonText: {
    fontFamily: MONO,
    fontWeight: "800",
    fontSize: 13,
    color: COLORS.bg,
  },
  buttonTextDisabled: {
    color: COLORS.muted,
  },

  /* loading / error / empty */
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  stateTitle: {
    fontFamily: MONO,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  stateText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 280,
  },
});
