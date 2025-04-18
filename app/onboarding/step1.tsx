// app/onboarding/step1.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link /*, useLocalSearchParams */ } from "expo-router";

const AgePicker = () => {
  // Create an array of ages from 10 to 100 in descending order
  const ages = Array.from({ length: 91 }, (_, i) => i + 10).reverse();
  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  // Create a ref to the ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  // On mount, scroll the ScrollView to the bottom so the view starts at the bottom.
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, []);

  return (
    <View style={styles.agePickerContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ages.map((age) => (
          <TouchableOpacity key={age} onPress={() => setSelectedAge(age)}>
            <Text
              style={[
                styles.ageText,
                selectedAge === age && styles.selectedAgeText,
              ]}
            >
              {age}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedAge !== null && (
        <Text style={styles.selectedAgeDisplay}>
          Selected Age: {selectedAge}
        </Text>
      )}
    </View>
  );
};

const Step1Onboarding = () => {
  // For now, we're using a dummy username.
  const userName = "Neil";
  // When ready to use real data, uncomment the lines below:
  // const params = useLocalSearchParams<{ userName?: string }>();
  // const userName = params.userName || 'User';

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      <Text style={styles.infoText}>
        We will ask you a few questions to personalize your experience.
      </Text>
      <Text style={styles.questionText}>How old are you?</Text>
      <AgePicker />
      <Link href="./step2" style={styles.nextButton}>
        Next
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  agePickerContainer: {
    height: 200,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  ageText: {
    fontSize: 20,
    padding: 10,
    color: "#333",
  },
  selectedAgeText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  selectedAgeDisplay: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: "center",
  },
});

export default Step1Onboarding;
