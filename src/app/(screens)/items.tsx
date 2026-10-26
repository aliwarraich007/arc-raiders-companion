import { BottomTabInset, Colors, Spacing } from "@/@core/constants/theme";
import { useDebouncedValue } from "@/@core/hooks/useDebounce";
import { useFetchItems } from "@/features/home/api";
import { ArcRaidersItems } from "@/features/home/types";
import {
  ItemCard,
  ItemDetailSheet,
  ItemsHeader,
  Pager,
  RarityFilterValue,
  SkeletonGrid,
  StateView,
} from "@/features/items";
import { TrackQuantitySheet } from "@/features/items/components/track-sheet";
import type { ItemFilters } from "@/features/items/types";
import { errorCopy, toApiRarity } from "@/features/items/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LIMIT = 24;
const COLUMNS = 2;
const GAP = 12;

export default function ItemScreen() {
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState<RarityFilterValue>("all");
  const [selected, setSelected] = useState<ArcRaidersItems | null>(null);
  const listRef = useRef<FlatList<ArcRaidersItems>>(null);
  const [trackTarget, setTrackTarget] = useState<ArcRaidersItems | null>(null);

  const debouncedQuery = useDebouncedValue(query, 350);
  const { width } = useWindowDimensions();
  const cardWidth = (width - Spacing.three * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
  const filters = useMemo<ItemFilters>(() => {
    const search = debouncedQuery.trim().slice(0, 100);
    return {
      search: search || undefined,
      rarity: rarity === "all" ? undefined : toApiRarity(rarity),
    };
  }, [debouncedQuery, rarity]);

  const filterKey = `${filters.search ?? ""}|${filters.rarity ?? ""}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;

  const { status, data, error, refetch, isRefetching, isPlaceholderData } =
    useFetchItems(page, LIMIT, filters);

  const goToPage = useCallback(
    (next: number) => {
      setPageState({ key: filterKey, page: next });
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    },
    [filterKey],
  );

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [filterKey]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setRarity("all");
  }, []);

  const filtering = !!filters.search || !!filters.rarity;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ItemsHeader
        total={data?.pagination.total}
        query={query}
        onQueryChange={setQuery}
        rarity={rarity}
        onRarityChange={setRarity}
      />

      {status === "pending" ? (
        <SkeletonGrid cardWidth={cardWidth} gap={GAP} />
      ) : status === "error" ? (
        <StateView
          glyph="!"
          title="Couldn't load items"
          message={errorCopy(error)}
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      ) : (
        <FlatList
          ref={listRef}
          data={data.data}
          numColumns={COLUMNS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              width={cardWidth}
              onPress={setSelected}
              onLongPress={setTrackTarget}
            />
          )}
          columnWrapperStyle={{ gap: GAP }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BottomTabInset + Spacing.four },
          ]}
          style={isPlaceholderData ? styles.dimmed : undefined}
          refreshing={isRefetching && !isPlaceholderData}
          onRefresh={() => refetch()}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          initialNumToRender={8}
          windowSize={7}
          removeClippedSubviews
          ListEmptyComponent={
            <StateView
              glyph="⌕"
              title="No items found"
              message={
                filtering
                  ? "No items match your search. Try different keywords or clear the filters."
                  : "Pull down to refresh the list."
              }
              actionLabel={filtering ? "Clear filters" : undefined}
              onAction={filtering ? clearFilters : undefined}
            />
          }
          ListFooterComponent={
            data.data.length > 0 ? (
              <Pager
                page={page}
                pagination={data.pagination}
                onChange={goToPage}
              />
            ) : undefined
          }
        />
      )}

      <ItemDetailSheet item={selected} onClose={() => setSelected(null)} />
      <TrackQuantitySheet
        item={trackTarget}
        onClose={() => setTrackTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    flexGrow: 1,
  },
  dimmed: { opacity: 0.45 },
});
