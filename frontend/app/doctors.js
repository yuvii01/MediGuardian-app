import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function Doctor() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Aisha Sharma",
      specialty: "Cardiologist",
      rating: 4.9,
      price: 1200,
      image: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    {
      id: 2,
      name: "Dr. Rahul Verma",
      specialty: "Dermatologist",
      rating: 4.7,
      price: 1000,
      image: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
      id: 3,
      name: "Dr. Priya Mehta",
      specialty: "Neurologist",
      rating: 4.8,
      price: 1500,
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: 4,
      name: "Dr. Arjun Kapoor",
      specialty: "Orthopedic",
      rating: 4.6,
      price: 900,
      image: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      id: 5,
      name: "Dr. Neha Bansal",
      specialty: "Pediatrician",
      rating: 4.9,
      price: 1100,
      image: "https://randomuser.me/api/portraits/women/40.jpg",
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <Text style={styles.heading}>Our Doctors</Text>
      <View style={styles.grid}>
        {doctors.map((doctor) => (
          <View key={doctor.id} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Image
                source={{ uri: doctor.image }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Rating:</Text> {doctor.rating} ⭐
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Price:</Text> ₹{doctor.price}
              </Text>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Book Appointment</Text>
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  specialty: {
    fontSize: 14,
    color: '#64748b',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
  },
  bold: {
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  button: {
    marginTop: 8,
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