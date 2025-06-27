import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

export default function MyProfile() {
  const user = useSelector(store => store.user);

  // You can add state for editable fields if you want to make the form functional
  const [name, setName] = useState(user.data?.name || '');
  const [email, setEmail] = useState(user.data?.email || '');
  const [mobile, setMobile] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [postcode, setPostcode] = useState('');
  const [state, setState] = useState('');
  const [area, setArea] = useState('');
  const [education, setEducation] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            }}
          />
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Profile Settings</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Full name"
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                value={mobile}
                onChangeText={setMobile}
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Address Line 1</Text>
              <TextInput
                value={address1}
                onChangeText={setAddress1}
                style={styles.input}
                placeholder="Enter address line 1"
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Address Line 2</Text>
              <TextInput
                value={address2}
                onChangeText={setAddress2}
                style={styles.input}
                placeholder="Enter address line 2"
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Postcode</Text>
              <TextInput
                value={postcode}
                onChangeText={setPostcode}
                style={styles.input}
                placeholder="Enter postcode"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>State</Text>
              <TextInput
                value={state}
                onChangeText={setState}
                style={styles.input}
                placeholder="Enter state"
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Area</Text>
              <TextInput
                value={area}
                onChangeText={setArea}
                style={styles.input}
                placeholder="Enter area"
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Email ID</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Enter email id"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Education</Text>
              <TextInput
                value={education}
                onChangeText={setEducation}
                style={styles.input}
                placeholder="Education"
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                value={country}
                onChangeText={setCountry}
                style={styles.input}
                placeholder="Country"
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.label}>State/Region</Text>
              <TextInput
                value={region}
                onChangeText={setRegion}
                style={styles.input}
                placeholder="State/Region"
              />
            </View>
          </View>
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  profileSection: { alignItems: 'center', marginBottom: 24 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 12, marginTop: 16 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  profileEmail: { color: '#666', marginBottom: 8 },
  formSection: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333', textAlign: 'center' },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  inputCol: { flex: 1, marginHorizontal: 4 },
  label: { fontSize: 14, color: '#333', marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, backgroundColor: '#fff', marginBottom: 4
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
});