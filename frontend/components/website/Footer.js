import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.brand}>MedApp</Text>
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@medapp.com')}>
          <Text style={styles.link}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>
          <Text style={styles.link}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://your-terms-url.com')}>
          <Text style={styles.link}>Terms</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>
        © {new Date().getFullYear()} MedApp. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205781',
    marginBottom: 6,
  },
  linksRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  link: {
    color: '#2563eb',
    marginHorizontal: 10,
    fontSize: 14,
  },
  copyright: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});