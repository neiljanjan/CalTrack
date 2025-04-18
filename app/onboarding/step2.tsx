// app/onboarding/step2.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Link } from "expo-router";

// Each item is 60px wide.
const ITEM_WIDTH = 53;

// Set visible items to 7.
const visibleItems = 7;
// Total container width equals 7 * ITEM_WIDTH.
const containerWidth = visibleItems * ITEM_WIDTH;
// Horizontal padding such that the center item is perfectly centered.
const scrollPadding = (containerWidth - ITEM_WIDTH) / 2;

// Custom segmented control for unit toggle (kg vs. lbs)
const UnitToggle: React.FC<{
  unit: "kg" | "lbs";
  setUnit: (u: "kg" | "lbs") => void;
}> = ({ unit, setUnit }) => {
  return (
    <View style={styles.unitToggleContainer}>
      <TouchableOpacity
        onPress={() => setUnit("kg")}
        style={[styles.unitOption, unit === "kg" && styles.unitOptionSelected]}
      >
        <Text
          style={[
            styles.unitOptionText,
            unit === "kg" && styles.unitOptionTextSelected,
          ]}
        >
          kg
        </Text>
      </TouchableOpacity>
      <View style={styles.unitDivider} />
      <TouchableOpacity
        onPress={() => setUnit("lbs")}
        style={[styles.unitOption, unit === "lbs" && styles.unitOptionSelected]}
      >
        <Text
          style={[
            styles.unitOptionText,
            unit === "lbs" && styles.unitOptionTextSelected,
          ]}
        >
          lbs
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Horizontal weight picker (ruler-style) that auto-updates the selected weight
type HorizontalWeightPickerProps = {
  unit: "kg" | "lbs";
  selectedWeight: number;
  onSelect: (w: number) => void;
};

const HorizontalWeightPicker: React.FC<HorizontalWeightPickerProps> = ({
  unit,
  selectedWeight,
  onSelect,
}) => {
  const minValue = unit === "kg" ? 30 : 66;
  const maxValue = unit === "kg" ? 200 : 440;

  const weights = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => i + minValue
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    onSelect(minValue + index);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      const index = selectedWeight - minValue;
      scrollViewRef.current.scrollTo({ x: index * ITEM_WIDTH, animated: true });
    }
  }, [selectedWeight, unit, minValue]);

  return (
    <View style={[styles.rulerContainer, { width: containerWidth }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingHorizontal: scrollPadding },
        ]}
      >
        {weights.map((w) => (
          <View key={w} style={styles.weightItem}>
            <Text
              style={[
                styles.weightText,
                selectedWeight === w && styles.selectedWeightText,
              ]}
            >
              {w}
            </Text>
          </View>
        ))}
      </ScrollView>
      {/* Top pointer: Downward arrow */}
      <View style={styles.topPointerContainer}>
        <Text style={styles.topPointer}>▼</Text>
      </View>
      {/* Bottom pointer: Upward arrow */}
      <View style={styles.bottomPointerContainer}>
        <Text style={styles.bottomPointer}>▲</Text>
      </View>
    </View>
  );
};

const Step2Onboarding = () => {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [weight, setWeight] = useState(70);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What's your current weight?</Text>
      <UnitToggle unit={unit} setUnit={setUnit} />
      <View style={styles.weightDisplayContainer}>
        <Text style={styles.weightDisplay}>
          {weight} {unit}
        </Text>
      </View>
      <HorizontalWeightPicker
        unit={unit}
        selectedWeight={weight}
        onSelect={setWeight}
      />
      <View style={styles.buttonRow}>
        <Link href="./step1" style={[styles.actionButton, styles.backButton]}>
          <Text style={styles.buttonText}>Back</Text>
        </Link>
        <Link href="./step3" style={[styles.actionButton, styles.nextButton]}>
          <Text style={styles.buttonText}>Next</Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  // Unit toggle styles:
  unitToggleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
  },
  unitOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  unitOptionSelected: {
    backgroundColor: "#007AFF",
  },
  unitOptionText: {
    fontSize: 16,
    color: "#007AFF",
  },
  unitOptionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  unitDivider: {
    width: 1,
    backgroundColor: "#ccc",
  },
  // Weight display styles:
  weightDisplayContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  weightDisplay: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  // Horizontal ruler picker container:
  rulerContainer: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    right: 10,
  },
  scrollContentContainer: {
    alignItems: "center",
  },
  weightItem: {
    width: ITEM_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  weightText: {
    fontSize: 18,
    color: "#333",
  },
  selectedWeightText: {
    fontSize: 22,
    color: "#007AFF",
    fontWeight: "bold",
  },
  // Top pointer container and style:
  topPointerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  topPointer: {
    fontSize: 24,
    color: "red",
  },
  // Bottom pointer container and style:
  bottomPointerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPointer: {
    fontSize: 24,
    color: "red",
  },
  // Button row for Back and Next:
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  actionButton: {
    flex: 0.45,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#007AFF",
  },
  backButton: {
    backgroundColor: "#777", // different color for back button if desired
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Step2Onboarding;
