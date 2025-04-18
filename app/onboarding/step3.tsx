// app/onboarding/step3.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Link } from "expo-router";

const ITEM_HEIGHT = 60; // Height for each height item

// Helper function to format a number as either plain cm or as ft/inches.
const formatHeight = (value: number, unit: "cm" | "ft") => {
  if (unit === "ft") {
    const feet = Math.floor(value / 12);
    const inches = value % 12;
    return inches === 0 ? `${feet}'` : `${feet}'${inches}''`;
  }
  return `${value}`;
};

// Custom segmented control for height unit toggle (cm vs. ft)
const HeightUnitToggle: React.FC<{
  unit: "cm" | "ft";
  setUnit: (u: "cm" | "ft") => void;
}> = ({ unit, setUnit }) => {
  return (
    <View style={styles.unitToggleContainer}>
      <TouchableOpacity
        onPress={() => setUnit("cm")}
        style={[styles.unitOption, unit === "cm" && styles.unitOptionSelected]}
      >
        <Text
          style={[
            styles.unitOptionText,
            unit === "cm" && styles.unitOptionTextSelected,
          ]}
        >
          cm
        </Text>
      </TouchableOpacity>
      <View style={styles.unitDivider} />
      <TouchableOpacity
        onPress={() => setUnit("ft")}
        style={[styles.unitOption, unit === "ft" && styles.unitOptionSelected]}
      >
        <Text
          style={[
            styles.unitOptionText,
            unit === "ft" && styles.unitOptionTextSelected,
          ]}
        >
          ft
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Vertical Height Picker (ruler-style)
// Displays a list of height values and updates the selected height when scrolling stops.
type VerticalHeightPickerProps = {
  unit: "cm" | "ft";
  selectedHeight: number;
  onSelect: (height: number) => void;
};

const VerticalHeightPicker: React.FC<VerticalHeightPickerProps> = ({
  unit,
  selectedHeight,
  onSelect,
}) => {
  // When in cm, use the range [100, 220].
  // When in ft, use the range in inches: [3 ft, 7 ft] → [36, 84]
  const minValue = unit === "cm" ? 100 : 36;
  const maxValue = unit === "cm" ? 220 : 84;
  const values = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => i + minValue
  );

  const scrollViewRef = useRef<ScrollView>(null);

  // When scrolling ends, determine which height is centered.
  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    onSelect(minValue + index);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      const index = selectedHeight - minValue;
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    }
  }, [selectedHeight, unit, minValue]);

  return (
    <View style={styles.verticalPickerContainer}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        // Padding to center one item vertically in a container of height 300:
        contentContainerStyle={[
          styles.verticalScrollContent,
          { paddingVertical: 120 },
        ]}
      >
        {values.map((v) => (
          <View key={v} style={styles.heightItem}>
            <Text
              style={[
                styles.heightText,
                selectedHeight === v && styles.selectedHeightText,
              ]}
            >
              {formatHeight(v, unit)}
            </Text>
          </View>
        ))}
      </ScrollView>
      {/* Left arrow pointer (positioned on the left side, centered vertically) */}
      <View style={styles.leftArrowContainer}>
        <Text style={styles.arrowText}>▶</Text>
      </View>
      {/* Right arrow pointer (positioned on the right side, centered vertically) */}
      <View style={styles.rightArrowContainer}>
        <Text style={styles.arrowText}>◀</Text>
      </View>
    </View>
  );
};

const Step3Onboarding = () => {
  const [unit, setUnit] = useState<"cm" | "ft">("cm");
  const [height, setHeight] = useState(170); // default height (if cm) or in inches (if ft)

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What's your height?</Text>
      <HeightUnitToggle unit={unit} setUnit={setUnit} />
      <View style={styles.heightDisplayContainer}>
        <Text style={styles.heightDisplay}>
          {formatHeight(height, unit)} {unit}
        </Text>
      </View>
      <VerticalHeightPicker
        unit={unit}
        selectedHeight={height}
        onSelect={setHeight}
      />
      {/* Button row for Back and Next */}
      <View style={styles.buttonRow}>
        <Link href="./step2" style={[styles.actionButton, styles.backButton]}>
          <Text style={styles.buttonText}>Back</Text>
        </Link>
        <Link href="./step4" style={[styles.actionButton, styles.nextButton]}>
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
  // Unit Toggle Styles:
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
  // Height display styles:
  heightDisplayContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heightDisplay: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  // Vertical Picker (Ruler) Container:
  verticalPickerContainer: {
    width: 200,
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
  },
  verticalScrollContent: {
    alignItems: "center",
  },
  heightItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  heightText: {
    fontSize: 18,
    color: "#333",
  },
  selectedHeightText: {
    fontSize: 22,
    color: "#007AFF",
    fontWeight: "bold",
  },
  // Left arrow pointer container (positioned on the left side of the container)
  leftArrowContainer: {
    position: "absolute",
    left: 5,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  // Right arrow pointer container (positioned on the right side of the container)
  rightArrowContainer: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  arrowText: {
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
    backgroundColor: "#777",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Step3Onboarding;
