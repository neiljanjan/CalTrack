// app/barcodeScanner.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getNutritionDetails } from '@/lib/nutritionix';
import { useMeals } from '@/context/MealsContext';
import { usePlan } from '@/context/PlanContext';
import { Section } from '@/context/MealsContext';

export default function BarcodeScanner() {
  const { section, dateKey, source } = useLocalSearchParams<{
    section: Section;
    dateKey?: string;
    source: 'log' | 'plan';
  }>();
  const router = useRouter();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addFood } = useMeals();
  const { addPlanFood } = usePlan();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      const res = await fetch(`https://trackapi.nutritionix.com/v2/search/item?upc=${data}`, {
        headers: {
          'x-app-id': 'a0ccf007',
          'x-app-key': '0e37dd0376f863770fb1019fe11a7ca3',
        },
      });
      const result = await res.json();

      if (!result.foods || result.foods.length === 0) {
        throw new Error('No food found for this barcode.');
      }

      const food = result.foods[0];

      const meal = {
        name: food.food_name,
        servings: 1,
        calories: food.nf_calories || 0,
        macros: {
          protein: food.nf_protein || 0,
          carbs: food.nf_total_carbohydrate || 0,
          fats: food.nf_total_fat || 0,
        },
      };

      if (source === 'plan' && dateKey) {
        addPlanFood(dateKey, section, {
          ...meal,
          date: new Date().toDateString(),
          section,
        });
      } else {
        addFood(section, meal);
      }

      router.back();
    } catch (err) {
      Alert.alert('Error', 'Could not find a matching food item.');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera. Please enable it in settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>Fetching food data...</Text>
        </View>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {scanned && !loading && (
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
