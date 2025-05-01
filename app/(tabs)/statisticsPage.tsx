// app/(tabs)/statisticspage.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  BarChart,
  LineChart,
  StackedBarChart,
} from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useAuth } from '@/context/AuthContext';
import { getMealStatsByDateRange, getWeightEntries } from '@/services/firestore';
import { Meal } from '@/context/MealsContext';

const screenWidth = Dimensions.get('window').width;

const Statisticspage = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const [caloriesData, setCaloriesData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [weightData, setWeightData] = useState<number[]>([]);
  const [macroData, setMacroData] = useState<number[][]>([]);

  useEffect(() => {
    if (!user) return;
    const now = new Date();
    let start: Date;
    let labelSet: string[] = [];

    if (timePeriod === 'weekly') {
      start = new Date(now);
      start.setDate(start.getDate() - 6);
      labelSet = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    } else if (timePeriod === 'monthly') {
      start = new Date(now);
      start.setDate(start.getDate() - 27);
      labelSet = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      labelSet = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    fetchData(start, now, labelSet);
  }, [timePeriod, user]);

  const fetchData = async (start: Date, end: Date, labelSet: string[]) => {
    const grouped = await getMealStatsByDateRange(user!.uid, start, end);

    const calBuckets = new Array(labelSet.length).fill(0);
    const proteinBuckets = new Array(labelSet.length).fill(0);
    const carbBuckets = new Array(labelSet.length).fill(0);
    const fatBuckets = new Array(labelSet.length).fill(0);

    const bucketIndex = (date: string): number => {
      const dt = new Date(date);
      if (timePeriod === 'weekly') return dt.getDay();
      if (timePeriod === 'monthly') return Math.floor((dt.getDate() - 1) / 7);
      return dt.getMonth();
    };

    Object.entries(grouped).forEach(([dateStr, meals]) => {
      const idx = bucketIndex(dateStr);
      meals.forEach((meal: Meal) => {
        calBuckets[idx] += meal.calories;
        if (meal.macros) {
          proteinBuckets[idx] += meal.macros.protein;
          carbBuckets[idx] += meal.macros.carbs;
          fatBuckets[idx] += meal.macros.fats;
        }
      });
    });

    setLabels(labelSet);
    setCaloriesData(calBuckets);
    setMacroData(labelSet.map((_, i) => [proteinBuckets[i], carbBuckets[i], fatBuckets[i]]));

    const weightEntries = await getWeightEntries(user!.uid, start, end);

    const validWeights = weightEntries
      .map((w) => w.weight)
      .filter((w) => typeof w === 'number' && isFinite(w) && !isNaN(w));

    console.log("📊 Weight entries:", weightEntries);
    console.log("✅ Valid weights:", validWeights);

    setWeightData(validWeights);
  };

  const avgCalories = caloriesData.length
    ? Math.round(caloriesData.reduce((a, b) => a + b, 0) / caloriesData.length)
    : 0;

  const macroLegend = ['Protein (g)', 'Carbs (g)', 'Fats (g)'];
  const macroColors = ['#34C759', '#FF9500', '#FF3B30'];

  const chartConfig = {
    backgroundGradientFrom: '#F9F9F9',
    backgroundGradientTo: '#F9F9F9',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    formatYLabel: (val: string) => val.split('.')[0],
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 50 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header onSettingsPress={() => {}} onNotificationsPress={() => {}} />

        <Text style={styles.pageTitle}>Your Statistics</Text>

        {/* Segmented Control */}
        <View style={styles.segmentedControlContainer}>
          {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.segmentButton,
                timePeriod === period && styles.segmentButtonActive,
              ]}
              onPress={() => setTimePeriod(period)}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  timePeriod === period && styles.segmentButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calories */}
        <View style={styles.sectionCard}>
          <Text style={styles.chartTitle}>Calories Consumed</Text>
          {caloriesData.every(c => c === 0) ? (
            <Text style={styles.noDataText}>No data available</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ marginLeft: 40 }}>
                <BarChart
                  data={{
                    labels,
                    datasets: [{ data: caloriesData }],
                  }}
                  width={Math.max(screenWidth * 0.85, labels.length * 50)}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=" kcal"
                  chartConfig={chartConfig}
                  fromZero
                  style={styles.chartStyle}
                />
              </View>
            </ScrollView>
          )}
          <Text style={styles.averageText}>Average: {avgCalories} kcal</Text>
        </View>

        {/* Weight */}
        <View style={styles.sectionCard}>
          <Text style={styles.chartTitle}>Weight Over Time</Text>
          {weightData.length === 0 ? (
            <Text style={styles.noDataText}>No weight data</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ marginLeft: 40 }}>
                <LineChart
                  data={{
                    labels: labels.slice(0, weightData.length),
                    datasets: [{ data: weightData }],
                  }}
                  width={Math.max(screenWidth * 0.85, weightData.length * 50)}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=" kg"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              </View>
            </ScrollView>
          )}
        </View>

        {/* Macros */}
        <View style={styles.sectionCard}>
          <Text style={styles.chartTitle}>Macros Breakdown</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ marginLeft: 40 }}>
              <StackedBarChart
                data={{
                  labels,
                  legend: [],
                  data: macroData,
                  barColors: macroColors,
                }}
                width={Math.max(screenWidth * 0.85, labels.length * 70)}
                height={220}
                chartConfig={chartConfig}
                style={styles.chartStyle}
                hideLegend={true}
              />
            </View>
          </ScrollView>

          {/* Custom Legend */}
          <View style={styles.customLegend}>
            {macroLegend.map((label, idx) => (
              <View key={idx} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: macroColors[idx] }]} />
                <Text style={styles.legendLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  pageTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  sectionCard: {
    width: '90%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#007AFF',
  },
  segmentButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  segmentButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  chartStyle: { marginVertical: 8, borderRadius: 10 },
  averageText: { fontSize: 14, color: '#666', marginTop: 10 },
  customLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: '#333',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    marginVertical: 10,
  },
});

export default Statisticspage;
