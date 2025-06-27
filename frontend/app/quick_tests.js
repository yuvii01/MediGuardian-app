import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function QuickTests() {
  const tests = [
    {
      name: 'Diabetes Prediction',
      model: 'Logistic Regression, Random Forest, Neural Networks',
      input: 'Age, BMI, glucose levels, insulin, blood pressure, family history',
      output: 'Probability of having diabetes',
    },
    {
      name: 'Heart Disease Prediction',
      model: 'Decision Trees, SVM, Deep Learning',
      input: 'Cholesterol, blood pressure, ECG results, age, gender, smoking history',
      output: 'Risk level (low, medium, high)',
    },
    {
      name: 'Lung Cancer Risk Prediction',
      model: 'CNN (for X-ray scans), Random Forest',
      input: 'Smoking habits, air pollution exposure, X-ray images',
      output: 'Probability of lung cancer',
    },
    {
      name: 'Breast Cancer Detection',
      model: 'CNN (for mammograms), SVM',
      input: 'Mammogram images, genetic history',
      output: 'Malignant/benign tumor classification',
    },
    {
      name: 'Pneumonia Detection',
      model: 'CNN',
      input: 'Chest X-ray images',
      output: 'Normal/Pneumonia presence',
    },
    {
      name: 'Alzheimer’s Disease Detection',
      model: 'Deep Learning, CNN (MRI scans)',
      input: 'MRI brain scans, cognitive test results',
      output: 'Stage of Alzheimer’s',
    },
    {
      name: 'Liver Disease Prediction',
      model: 'Random Forest, SVM',
      input: 'Bilirubin levels, enzyme levels, alcohol consumption',
      output: 'Presence/absence of liver disease',
    },
    {
      name: 'Chronic Kidney Disease Prediction',
      model: 'Decision Trees, KNN',
      input: 'Blood urea, creatinine, hemoglobin, age',
      output: 'CKD stage classification',
    },
    {
      name: 'COVID-19 Detection',
      model: 'CNN (Chest X-rays), Decision Trees',
      input: 'Chest X-rays, temperature, cough severity',
      output: 'COVID positive/negative',
    },
    {
      name: 'Malaria Detection',
      model: 'CNN',
      input: 'Blood smear images',
      output: 'Infected/normal',
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <Text style={styles.heading}>Online Medical Tests</Text>
      <View style={styles.grid}>
        {tests.map((test, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{test.name}</Text>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Model Type:</Text> {test.model}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Input Data:</Text> {test.input}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Output:</Text> {test.output}
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Test</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#1e293b',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});