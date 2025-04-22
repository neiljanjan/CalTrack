import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';

type AgePickerProps = {
  selectedAge: number | null;
  setSelectedAge: (age: number) => void;
};

const AgePicker: React.FC<AgePickerProps> = ({ selectedAge, setSelectedAge }) => {
  const ages = Array.from({ length: 91 }, (_, i) => i + 10).reverse();
  const scrollViewRef = useRef<ScrollView>(null);

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

export default function Step1Onboarding() {
  const [age, setAge] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.infoText}>
        We will ask you a few questions to personalize your experience.
      </Text>
      <Text style={styles.questionText}>How old are you?</Text>
      <AgePicker selectedAge={age} setSelectedAge={setAge} />
      <Link
        href={{
          pathname: "./step2",
          params: { age: age?.toString() },
        }}
        style={styles.nextButton}
      >
        Next
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  welcomeText: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  infoText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  questionText: { fontSize: 20, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  agePickerContainer: { height: 200, marginBottom: 20 },
  scrollView: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingVertical: 10 },
  ageText: { fontSize: 20, padding: 10, color: '#333' },
  selectedAgeText: { color: '#007AFF', fontWeight: 'bold' },
  selectedAgeDisplay: { marginTop: 10, textAlign: 'center', fontSize: 16 },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: 'center',
  },
});
