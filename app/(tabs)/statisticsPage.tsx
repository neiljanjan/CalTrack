// app/(tabs)/statisticspage.tsx

import React, { useState } from 'react';
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

const screenWidth = Dimensions.get('window').width;

const Statisticspage = () => {
  const insets = useSafeAreaInsets();
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Dummy data
  let labels: string[] = [];
  let caloriesData: number[] = [];
  if (timePeriod === 'weekly') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    caloriesData = [1800, 2000, 1900, 2100, 1950, 2050, 2000];
  } else if (timePeriod === 'monthly') {
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    caloriesData = [1900, 2000, 1850, 2100];
  } else {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    caloriesData = [1950, 2000, 1900, 2050, 2000, 2100, 1950, 2000, 2050, 2100, 2000, 2050];
  }

  const avgCalories = Math.round(caloriesData.reduce((a, b) => a + b, 0) / caloriesData.length);

  let weightData: number[] = [];
  if (timePeriod === 'weekly') {
    weightData = [70, 69.8, 69.7, 69.6, 69.5, 69.5, 69.4];
  } else if (timePeriod === 'monthly') {
    weightData = [70, 69.7, 69.5, 69.3];
  } else {
    weightData = [70, 69.8, 69.6, 69.5, 69.4, 69.3, 69.3, 69.2, 69.2, 69.1, 69.0, 69.0];
  }

  const macroLabels = labels;
  const macroProtein = macroLabels.map((_, i) => 120 + i * 5);
  const macroCarbs = macroLabels.map((_, i) => 250 + i * 10);
  const macroFats = macroLabels.map((_, i) => 70 + i * 3);

  const macroLegend = ['Protein (g)', 'Carbs (g)', 'Fats (g)'];
  const macroColors = ['#34C759', '#FF9500', '#FF3B30'];

  const chartConfig = {
    backgroundGradientFrom: '#F9F9F9',
    backgroundGradientTo: '#F9F9F9',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    formatYLabel: (yValue: string) => {
      if (yValue.includes('.')) {
        return yValue.split('.')[0];
      }
      return yValue;
    }
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

        {/* Streaks */}
        <View style={styles.streakContainer}>
          <View style={styles.streakBox}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakValue}>5 days</Text>
          </View>
          <View style={styles.streakBox}>
            <Text style={styles.streakLabel}>Longest Streak</Text>
            <Text style={styles.streakValue}>12 days</Text>
          </View>
        </View>

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

        {/* Calories Consumed */}
        <View style={styles.sectionCard}>
          <Text style={styles.chartTitle}>Calories Consumed</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ marginLeft: 40 }}>
              <BarChart
                data={{
                  labels: macroLabels.slice(0, caloriesData.length),
                  datasets: [{ data: caloriesData }],
                }}
                width={Math.max(screenWidth * 0.85, caloriesData.length * 50)}
                height={220}
                yAxisLabel=""
                yAxisSuffix=" kcal"
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
              />
            </View>
          </ScrollView>
          <Text style={styles.averageText}>Average: {avgCalories} kcal</Text>
        </View>

        {/* Goal Progress */}
        <View style={styles.sectionCard}>
          <Text style={styles.chartTitle}>Goal Progress (Weight)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ marginLeft: 40 }}>
              <LineChart
                data={{
                  labels: macroLabels.slice(0, weightData.length),
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
        </View>

        {/* Macros Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.chartTitle}>Macros Breakdown</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ marginLeft: 40 }}>
              <StackedBarChart
                data={{
                  labels: macroLabels,
                  legend: [],
                  data: macroLabels.map((_, i) => [
                    macroProtein[i],
                    macroCarbs[i],
                    macroFats[i],
                  ]),
                  barColors: macroColors,
                }}
                width={Math.max(screenWidth * 0.85, macroLabels.length * 70)}
                height={220}
                chartConfig={chartConfig}
                style={styles.chartStyle}
                hideLegend={true}
              />
            </View>
          </ScrollView>

          {/* Manual Custom Legend */}
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
  sectionCard: { width: '90%', backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, marginBottom: 20, alignItems: 'center', elevation: 2 },
  streakContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginBottom: 20 },
  streakBox: { width: '45%', padding: 15, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', elevation: 2 },
  streakLabel: { fontSize: 16, color: '#333' },
  streakValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginTop: 5 },
  segmentedControlContainer: { flexDirection: 'row', width: '90%', justifyContent: 'center', marginBottom: 20 },
  segmentButton: { flex: 1, paddingVertical: 10, marginHorizontal: 5, borderRadius: 20, borderWidth: 1, borderColor: '#007AFF', alignItems: 'center' },
  segmentButtonActive: { backgroundColor: '#007AFF' },
  segmentButtonText: { fontSize: 16, color: '#007AFF' },
  segmentButtonTextActive: { color: '#fff', fontWeight: 'bold' },
  chartTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  chartStyle: { marginVertical: 8, borderRadius: 10 },
  averageText: { fontSize: 14, color: '#666', marginTop: 10 },
  customLegend: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendLabel: { fontSize: 14, color: '#333' },
});

export default Statisticspage;
