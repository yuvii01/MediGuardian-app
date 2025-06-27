import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function Header() {
  const cart = useSelector((store) => store.cart);
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const convertTimestampToDate = () => {
    const now = new Date();
    const weekday = now.toLocaleString('en-US', { weekday: 'short' });
    const month = now.toLocaleString('en-US', { month: 'short' });
    const day = now.getDate();
    const year = now.getFullYear();
    return `${weekday} ${month} ${day} ${year}`;
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {user && user.data ? (
          <TouchableOpacity onPress={() => router.push('/')}>
            {/* <Image
              source={
                user.data.Image
                  ? { uri: `http://localhost:5000/image/profile/${user.data.Image}` }
                  : require('../../assets/avatar.png')
              } */}
              {/* style={styles.avatar}
            /> */}
          </TouchableOpacity>
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View>
          <Text style={styles.greeting}>
            Welcome back,{' '}
            <Text style={{ color: '#205781' }}>
              {user && user.data ? user.data.name : 'Guest'}
            </Text>
          </Text>
          <Text style={styles.date}>
            {user && user.data ? `Today, ${convertTimestampToDate()}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          style={styles.iconBtn}
        >
          <Feather name="search" size={22} color="#333" />
        </TouchableOpacity>

        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  router.push('/buy_medicine');
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>Buy Medicines</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  // For Quick Tests, open in browser
                  setShowDropdown(false);
                  // You can use Linking.openURL if you want to open external links
                }}
              >
                <Text style={styles.dropdownText}>Quick Tests</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  router.push('/doctors');
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>Looking for Doctors</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <TouchableOpacity
          onPress={() => {/* Notifications logic here */}}
          style={styles.iconBtn}
        >
          <Ionicons name="notifications-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 36,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    zIndex: 10,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb', marginRight: 12,
  },
  greeting: { fontSize: 14, fontWeight: '500', color: '#222' },
  date: { fontSize: 12, color: '#888' },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdown: {
    marginTop: 80,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    width: 180,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 15,
    color: '#205781',
  },
});