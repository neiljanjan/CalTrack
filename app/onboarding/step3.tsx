import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

const ITEM_HEIGHT = 60;

const formatHeight = (value: number, unit: 'cm' | 'ft') => {
  if (unit === 'ft') {
    const feet = Math.floor(value / 12);
    const inches = value % 12;
    return inches === 0 ? `${feet}'` : `${feet}'${inches}''`;
  }
  return `${value}`;
};

const HeightUnitToggle: React.FC<{ unit: 'cm' | 'ft'; setUnit: (u: 'cm' | 'ft') => void }> = ({
  unit, setUnit,
}) => (
  <View style={styles.unitToggleContainer}>
    <TouchableOpacity
      onPress={() => setUnit('cm')}
      style={[styles.unitOption, unit === 'cm' && styles.unitOptionSelected]}
    >
      <Text style={[styles.unitOptionText, unit === 'cm' && styles.unitOptionTextSelected]}>cm</Text>
    </TouchableOpacity>
    <View style={styles.unitDivider} />
    <TouchableOpacity
      onPress={() => setUnit('ft')}
      style={[styles.unitOption, unit === 'ft' && styles.unitOptionSelected]}
    >
      <Text style={[styles.unitOptionText, unit === 'ft' && styles.unitOptionTextSelected]}>ft</Text>
    </TouchableOpacity>
  </View>
);

const VerticalHeightPicker: React.FC<{
  unit: 'cm' | 'ft';
  selectedHeight: number;
  onSelect: (h: number) => void;
}> = ({ unit, selectedHeight, onSelect }) => {
  const minValue = unit === 'cm' ? 100 : 36;
  const maxValue = unit === 'cm' ? 220 : 84;
  const values = Array.from({ length: maxValue - minValue + 1 }, (_, i) => i + minValue);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    onSelect(minValue + index);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: (selectedHeight - minValue) * ITEM_HEIGHT, animated: true });
    }
  }, [selectedHeight, unit]);

  return (
    <View style={styles.verticalPickerContainer}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={[styles.verticalScrollContent, { paddingVertical: 120 }]}
      >
        {values.map((v) => (
          <View key={v} style={styles.heightItem}>
            <Text style={[styles.heightText, selectedHeight === v && styles.selectedHeightText]}>
              {formatHeight(v, unit)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.leftArrowContainer}><Text style={styles.arrowText}>▶</Text></View>
      <View style={styles.rightArrowContainer}><Text style={styles.arrowText}>◀</Text></View>
    </View>
  );
};

export default function Step3Onboarding() {
  const params = useLocalSearchParams<{ age?: string; weight?: string }>();
  const age = Number(params.age);
  const weight = Number(params.weight);

  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [height, setHeight] = useState<number>(170);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What's your height?</Text>
      <HeightUnitToggle unit={unit} setUnit={setUnit} />
      <View style={styles.heightDisplayContainer}>
        <Text style={styles.heightDisplay}>{formatHeight(height, unit)} {unit}</Text>
      </View>
      <VerticalHeightPicker unit={unit} selectedHeight={height} onSelect={setHeight} />
      <View style={styles.buttonRow}>
        <Link
          href={{
            pathname: "./step2",
            params: { age: params.age, weight: params.weight },
          }}
          style={[styles.actionButton, styles.backButton]}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Link>
        <Link
          href={{
            pathname: "./step4",
            params: { age: params.age, weight: params.weight, height: height.toString() },
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
  heightDisplayContainer: { alignItems: 'center', marginBottom: 20 },
  heightDisplay: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  verticalPickerContainer: { width: 200, height: 300, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, overflow: 'hidden', marginBottom: 20, backgroundColor: '#f0f0f0', alignSelf: 'center' },
  verticalScrollContent: { alignItems: 'center' },
  heightItem: { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center', width: '100%' },
  heightText: { fontSize: 18, color: '#333' },
  selectedHeightText: { fontSize: 22, color: '#007AFF', fontWeight: 'bold' },
  leftArrowContainer: { position: 'absolute', left: 5, top: '50%', transform: [{ translateY: -12 }] },
  rightArrowContainer: { position: 'absolute', right: 5, top: '50%', transform: [{ translateY: -12 }] },
  arrowText: { fontSize: 24, color: 'red' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  actionButton: { flex: 0.45, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  backButton: { backgroundColor: '#777' },
  nextButton: { backgroundColor: '#007AFF' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
