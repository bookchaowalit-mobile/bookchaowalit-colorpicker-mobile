import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  adjustLightness,
  contrastRatio,
  formatHsl,
  formatRgb,
  hexToRgb,
  parseColor,
  readableTextColor,
  rgbToHsl,
  wcagRating,
} from "../../lib/color";

const PRESETS = ["#E53935", "#FB8C00", "#FDD835", "#43A047", "#1E88E5", "#8E24AA", "#212121"];

export default function PickerScreen() {
  const [input, setInput] = useState("#1E88E5");
  const [color, setColor] = useState("#1E88E5");
  const invalid = parseColor(input) === null;

  const onChange = (text: string) => {
    setInput(text);
    const parsed = parseColor(text);
    if (parsed) setColor(parsed);
  };
  const pick = (hex: string) => {
    setInput(hex);
    setColor(hex);
  };

  const rgb = hexToRgb(color);
  const textColor = readableTextColor(color);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View
        accessibilityLabel={`Selected color ${color}`}
        style={[styles.preview, { backgroundColor: color }]}
      >
        <Text style={[styles.previewText, { color: textColor }]}>{color}</Text>
      </View>

      <Text nativeID="colorInputLabel" style={styles.label}>
        Hex, rgb() or hsl()
      </Text>
      <TextInput
        accessibilityLabelledBy="colorInputLabel"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChange}
        style={[styles.input, invalid && styles.inputError]}
        value={input}
      />
      {invalid && <Text style={styles.error}>Try #1E88E5, rgb(30, 136, 229) or hsl(208, 79%, 51%).</Text>}

      <View style={styles.presets}>
        {PRESETS.map((hex) => (
          <Pressable
            accessibilityLabel={`Pick ${hex}`}
            accessibilityRole="button"
            key={hex}
            onPress={() => pick(hex)}
            style={[styles.dot, { backgroundColor: hex }, hex === color && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.row}>
        <Pressable accessibilityRole="button" onPress={() => pick(adjustLightness(color, -10))} style={styles.button}>
          <Text style={styles.buttonText}>Darker</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => pick(adjustLightness(color, 10))} style={styles.button}>
          <Text style={styles.buttonText}>Lighter</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Value label="HEX" value={color} />
        <Value label="RGB" value={formatRgb(rgb)} />
        <Value label="HSL" value={formatHsl(rgbToHsl(rgb))} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Text contrast (WCAG)</Text>
        {(["#FFFFFF", "#000000"] as const).map((fg) => {
          const ratio = contrastRatio(color, fg);
          return (
            <Value
              key={fg}
              label={fg === "#FFFFFF" ? "White text" : "Black text"}
              value={`${ratio.toFixed(2)}:1 · ${wcagRating(ratio)}`}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

function Value({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.valueRow}>
      <Text style={styles.valueLabel}>{label}</Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  content: { padding: 16, gap: 12 },
  preview: { height: 140, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  previewText: { fontSize: 24, fontWeight: "700", letterSpacing: 1 },
  label: { fontSize: 14, fontWeight: "600", color: "#333" },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: { borderColor: "#C62828" },
  error: { color: "#C62828", fontSize: 13 },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  dot: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: "transparent" },
  dotActive: { borderColor: "#333" },
  row: { flexDirection: "row", gap: 8 },
  button: {
    flex: 1,
    backgroundColor: "#2F6DB5",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  valueRow: { flexDirection: "row", justifyContent: "space-between" },
  valueLabel: { color: "#666", fontSize: 14 },
  value: { color: "#222", fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
