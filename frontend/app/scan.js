import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function Scan() {
  const [file, setFile] = useState(null);
  const [isFile, setIsFile] = useState(false);

  const medicineData = [
    {
      name: "Crocin",
      qty: 1,
      description: "sknvs",
      date: "2025-03-29",
      timing: "16:31",
    },
    {
      name: "Paracetamol",
      qty: 1,
      description: "aaaaaa",
      date: "2025-03-29",
      timing: "13:24",
    },
    {
      name: "Dolo G",
      qty: 1,
      description: "aaaaaaaa",
      date: "2025-03-29",
      timing: "21:30",
    },
  ];

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') {
      setFile(result);
      setIsFile(true);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={styles.heading}>Upload Prescription</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {file ? 'File Selected' : 'Choose File'}
        </Text>
      </TouchableOpacity>
      <Button
        title="Upload"
        color="#2563eb"
        onPress={() => {
          if (!file) {
            setIsFile(false);
          } else {
            setIsFile(true);
          }
        }}
      />
      {isFile ? (
        medicineData.map((medicine, index) => (
          <View key={index} style={styles.medicineCard}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <Text style={styles.medicineDetail}>Quantity: {medicine.qty}</Text>
            <Text style={styles.medicineDetail}>Description: {medicine.description}</Text>
            <Text style={styles.medicineDetail}>Date: {medicine.date}</Text>
            <Text style={styles.medicineDetail}>Timing: {medicine.timing}</Text>
          </View>
        ))
      ) : (
        <Text style={{ marginTop: 16 }}>Please upload a file</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  uploadButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  medicineName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  medicineDetail: { fontSize: 14, color: '#555' },
});