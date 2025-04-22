import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

const ITEM_WIDTH = 53;
const visibleItems = 7;
const containerWidth = visibleItems * ITEM_WIDTH;
const scrollPadding = (containerWidth - ITEM_WIDTH) / 2;

const UnitToggle: React.FC<{ unit: 'kg' | 'lbs'; setUnit: (u: 'kg' | 'lbs') => void; }> = ({
  unit, setUnit,
}) => (
  <View style={styles.unitToggleContainer}>
    <TouchableOpacity
      onPress={() => setUnit('kg')}
      style={[styles.unitOption, unit === 'kg' && styles.unitOptionSelected]}
    >
      <Text style={[styles.unitOptionText, unit === 'kg' && styles.unitOptionTextSelected]}>kg</Text>
    </TouchableOpacity>
    <View style={styles.unitDivider} />
    <TouchableOpacity
      onPress={() => setUnit('lbs')}
      style={[styles.unitOption, unit === 'lbs' && styles.unitOptionSelected]}
    >
      <Text style={[styles.unitOptionText, unit === 'lbs' && styles.unitOptionTextSelected]}>lbs</Text>
    </TouchableOpacity>
  </View>
);

const HorizontalWeightPicker: React.FC<{
  unit: 'kg' | 'lbs';
  selectedWeight: number;
  onSelect: (w: number) => void;
}> = ({ unit, selectedWeight, onSelect }) => {
  const minValue = unit === 'kg' ? 30 : 66;
  const maxValue = unit === 'kg' ? 200 : 440;
  const weights = Array.from({ length: maxValue - minValue + 1 }, (_, i) => i + minValue);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    onSelect(minValue + index);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: (selectedWeight - minValue) * ITEM_WIDTH, animated: true });
    }
  }, [selectedWeight, unit]);

  return (
    <View style={[styles.rulerContainer, { width: containerWidth }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={[styles.scrollContentContainer, { paddingHorizontal: scrollPadding }]}
      >
        {weights.map((w) => (
          <View key={w} style={styles.weightItem}>
            <Text style={[styles.weightText, selectedWeight === w && styles.selectedWeightText]}>{w}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.topPointerContainer}><Text style={styles.topPointer}>▼</Text></View>
      <View style={styles.bottomPointerContainer}><Text style={styles.bottomPointer}>▲</Text></View>
    </View>
  );
};

export default function Step2Onboarding() {
  const params = useLocalSearchParams<{ age?: string }>();
  const age = Number(params.age);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [weight, setWeight] = useState<number>(70);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What's your current weight?</Text>
      <UnitToggle unit={unit} setUnit={setUnit} />
      <View style={styles.weightDisplayContainer}>
        <Text style={styles.weightDisplay}>{weight} {unit}</Text>
      </View>
      <HorizontalWeightPicker unit={unit} selectedWeight={weight} onSelect={setWeight} />
      <View style={styles.buttonRow}>
        <Link href="./step1" style={[styles.actionButton, styles.backButton]}>
          <Text style={styles.buttonText}>Back</Text>
        </Link>
        <Link
          href={{
            pathname: "./step3",
            params: { age: age.toString(), weight: weight.toString() },
          }}
          style={[styles.actionButton, styles.nextButton]}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  unitToggleContainer: { flexDirection: 'row', alignSelf: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 25, overflow: 'hidden', marginBottom: 20 },
  unitOption: { paddingVertical: 8, paddingHorizontal: 20 },
  unitOptionSelected: { backgroundColor: '#007AFF' },
  unitOptionText: { fontSize: 16, color: '#007AFF' },
  unitOptionTextSelected: { color: '#fff', fontWeight: 'bold' },
  unitDivider: { width: 1, backgroundColor: '#ccc' },
  weightDisplayContainer: { alignItems: 'center', marginBottom: 20 },
  weightDisplay: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  rulerContainer: { height: 80, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, overflow: 'hidden', marginBottom: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  scrollContentContainer: { alignItems: 'center' },
  weightItem: { width: ITEM_WIDTH, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  weightText: { fontSize: 18, color: '#333' },
  selectedWeightText: { fontSize: 22, color: '#007AFF', fontWeight: 'bold' },
  topPointerContainer: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  topPointer: { fontSize: 24, color: 'red' },
  bottomPointerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' },
  bottomPointer: { fontSize: 24, color: 'red' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  actionButton: { flex: 0.45, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  backButton: { backgroundColor: '#777' },
  nextButton: { backgroundColor: '#007AFF' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
