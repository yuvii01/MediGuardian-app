import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function CreateMedi() {
  const user = useSelector(store => store.user);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '1',
    timing: '',
    description: '',
    date: '',
  });
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const removeFile = () => setFile(null);

  const handleSubmit = async () => {
    if (!formData.name || !formData.quantity || !formData.timing || !formData.description || !formData.date) {
      Alert.alert('Please fill all fields');
      return;
    }
    const mediData = new FormData();
    mediData.append('name', formData.name);
    mediData.append('quantity', formData.quantity);
    mediData.append('timing', formData.timing);
    mediData.append('date', formData.date);
    mediData.append('user_id', user?.data._id);
    mediData.append('description', formData.description);
    if (file) {
      mediData.append('image', {
        uri: file.uri,
        name: file.fileName || 'medi.jpg',
        type: file.type || 'image/jpeg',
      });
    }

    try {
      await axios.post('http://localhost:5000/api/medi', mediData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.replace('/');
    } catch (error) {
      console.error('Error creating Medi:', error);
      Alert.alert('Failed to create Medi.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Medi</Text>
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={text => handleChange('name', text)}
          placeholder="Enter Medi name"
        />
        {/* Quantity */}
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={formData.quantity}
          onChangeText={text => handleChange('quantity', text)}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={formData.date}
          onChangeText={text => handleChange('date', text)}
          placeholder="YYYY-MM-DD"
        />
        {/* Timing */}
        <Text style={styles.label}>Timing</Text>
        <TextInput
          style={styles.input}
          value={formData.timing}
          onChangeText={text => handleChange('timing', text)}
          placeholder="e.g., Morning, Evening"
        />
        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={formData.description}
          onChangeText={text => handleChange('description', text)}
          placeholder="Enter Medi description"
          multiline
        />
        {/* Image Upload */}
        <Text style={styles.label}>Upload Image</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Button title={file ? "Change Image" : "Pick Image"} onPress={pickImage} />
          {file && (
            <>
              <Image source={{ uri: file.uri }} style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 12 }} />
              <TouchableOpacity onPress={removeFile}>
                <Text style={{ color: '#ef4444', marginLeft: 8 }}>Remove</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* Submit Button */}
        <Button title="Create Medi" color="#6366f1" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 14, color: '#222', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8,
    backgroundColor: '#f9f9f9'
  },
});