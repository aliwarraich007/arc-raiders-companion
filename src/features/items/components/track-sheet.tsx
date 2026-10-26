import { Colors, Fonts, Spacing } from "@/@core/constants/theme";
import { Button } from "@/@ui/components/button";
import type { ArcRaidersItems } from "@/features/home/types";
import { useTrackedStore } from "@/integrations/zustand/tracked-store";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getRarityColor } from "../utils";

type Props = { item: ArcRaidersItems | null; onClose: () => void };

export function TrackQuantitySheet({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const existing = useTrackedStore((s) =>
    item ? s.tracked[item.id] : undefined,
  );
  const setQuantity = useTrackedStore((s) => s.setQuantity);
  const remove = useTrackedStore((s) => s.remove);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item) setQty(existing?.quantity ?? 1);
  }, [item?.id]);

  if (!item) return null;
  const color = getRarityColor(item.rarity);
  const clamp = (n: number) => Math.max(0, Math.min(9999, Math.floor(n) || 0));

  const save = () => {
    setQuantity(item, qty);
    onClose();
  };

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      style={{ paddingBottom: insets.bottom }}
    >
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={[styles.eyebrow, { color }]}>
            {existing ? "UPDATE TRACKING" : "TRACK ITEM"}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setQty((q) => clamp(q - 1))}
              hitSlop={8}
            >
              <Text style={styles.stepText}>−</Text>
            </Pressable>
            <TextInput
              value={String(qty)}
              onChangeText={(t) =>
                setQty(clamp(Number(t.replace(/[^0-9]/g, ""))))
              }
              keyboardType="number-pad"
              selectTextOnFocus
              style={styles.input}
              maxLength={4}
            />
            <Pressable
              style={styles.stepBtn}
              onPress={() => setQty((q) => clamp(q + 1))}
              hitSlop={8}
            >
              <Text style={styles.stepText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.quick}>
            {[1, 5, 10].map((n) => (
              <Pressable
                key={n}
                style={styles.quickChip}
                onPress={() => setQty((q) => clamp(q + n))}
              >
                <Text style={styles.quickText}>+{n}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actions}>
            {existing && (
              <Button
                label="Remove"
                onPress={() => {
                  remove(item.id);
                  onClose();
                }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Button
                label={
                  qty === 0
                    ? "Stop tracking"
                    : existing
                      ? "Save"
                      : "Start tracking"
                }
                variant="primary"
                onPress={save}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: Colors.backgroundElement,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
    padding: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  eyebrow: { fontFamily: Fonts.bold, fontSize: 11, letterSpacing: 2 },
  name: { color: Colors.text, fontFamily: Fonts.bold, fontSize: 22 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.four,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: Colors.text,
    fontSize: 26,
    fontFamily: Fonts.semibold,
    marginTop: -2,
  },
  input: {
    minWidth: 90,
    textAlign: "center",
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 40,
  },
  quick: { flexDirection: "row", justifyContent: "center", gap: Spacing.two },
  quickChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.semibold,
    fontSize: 13,
  },
  actions: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.two },
});
