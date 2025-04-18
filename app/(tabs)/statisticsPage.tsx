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

const screenWidth = Dimensions.get("window").width;

const Statisticspage = () => {
  // For segmented control
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Dummy data for calories consumed per time period
  let labels: string[] = [];
  let caloriesData: number[] = [];
  if (timePeriod === 'weekly') {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    caloriesData = [1800, 2000, 1900, 2100, 1950, 2050, 2000];
  } else if (timePeriod === 'monthly') {
    labels = ["W1", "W2", "W3", "W4"];
    caloriesData = [1900, 2000, 1850, 2050];
  } else {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    caloriesData = [1950, 2000, 1900, 2050, 2000, 2100, 1950, 2000, 2050, 2100, 2000, 2050];
  }
  const avgCalories = Math.round(caloriesData.reduce((a, b) => a + b, 0) / caloriesData.length);

  // Dummy data for goal progress: weight over time
  let weightLabels: string[] = [];
  let weightData: number[] = [];
  if (timePeriod === 'weekly') {
    weightLabels = labels;
    weightData = [70, 69.8, 69.7, 69.6, 69.5, 69.5, 69.4];
  } else if (timePeriod === 'monthly') {
    weightLabels = ["W1", "W2", "W3", "W4"];
    weightData = [70, 69.7, 69.5, 69.3];
  } else {
    weightLabels = labels;
    weightData = [70, 69.8, 69.6, 69.5, 69.4, 69.3, 69.3, 69.2, 69.2, 69.1, 69.0, 69.0];
  }

  // Dummy data for macros (stacked bars)
  const macroLabels = labels;
  const macroData: number[][] = labels.map((_, i) => {
    // simple increasing dummy
    return [120 + i*2, 250 + i*3, 70 + i];
  });
  const macroLegend = ["Protein (g)", "Carbs (g)", "Fats (g)"];
  const macroColors = ['#34C759', '#FF9500', '#FF3B30'];

  // Chart configuration for all graphs
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Your Statistics</Text>
      
      {/* Streak Box */}
      <View style={styles.streakContainer}>
        <View style={styles.streakBox}>
          <Text style={styles.streakLabel}>Current Streak</Text>
          <Text style={styles.streakValue}>5 days</Text>
        </View>
        <View style={styles.streakBox}>
          <Text style={styles.streakLabel}>Longest Streak</Text>
          <Text style={styles.streakValue}>12 days</Text>
        </View>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControlContainer}>
        {(["weekly", "monthly", "yearly"] as const).map(period => (
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

      {/* Calories Consumed Bar Chart */}
      <Text style={styles.chartTitle}>Calories Consumed</Text>
      <BarChart
        data={{ labels, datasets: [{ data: caloriesData }] }}
        width={screenWidth * 0.9}
        height={220}
        yAxisLabel=""              // required by TS
        yAxisSuffix=" kcal"
        chartConfig={chartConfig}
        fromZero
        style={styles.chartStyle}
      />
      <Text style={styles.averageText}>Average: {avgCalories} kcal</Text>

      {/* Goal Progress Line Chart */}
      <Text style={styles.chartTitle}>Goal Progress (Weight)</Text>
      <LineChart
        data={{ labels: weightLabels, datasets: [{ data: weightData }] }}
        width={screenWidth * 0.9}
        height={220}
        yAxisLabel=""              // required by TS
        yAxisSuffix=" kg"
        chartConfig={chartConfig}
        bezier
        style={styles.chartStyle}
      />

      {/* Macros Stacked Bar Chart */}
      <Text style={styles.chartTitle}>Macros Breakdown</Text>
      <StackedBarChart
        data={{
          labels: macroLabels,
          legend: macroLegend,
          data: macroData,
          barColors: macroColors,
        }}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={chartConfig}
        style={styles.chartStyle}
        hideLegend={false}         // required by TS
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  streakBox: {
    width: '45%',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 16,
    color: '#333',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
  },
  segmentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
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
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 10,
  },
  averageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default Statisticspage;
