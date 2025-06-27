import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';

const ITEM_WIDTH = Math.round(Dimensions.get('window').width / 1.1 / 3);

export default function Carousel({ productCro = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevProduct = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? Math.max(productCro.length - 3, 0) : prevIndex - 1
    );
  };

  const nextProduct = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === Math.max(productCro.length - 3, 0) ? 0 : prevIndex + 1
    );
  };

  // Show only 3 products at a time
  const visibleProducts = productCro.slice(currentIndex, currentIndex + 3);

  // If less than 3, fill with empty slots
  while (visibleProducts.length < 3) {
    visibleProducts.push(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselRow}>
        {visibleProducts.map((product, idx) =>
          product ? (
            <View key={idx} style={styles.card}>
              <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </View>
          ) : (
            <View key={idx} style={[styles.card, { backgroundColor: 'transparent' }]} />
          )
        )}
      </View>
      {/* Navigation buttons */}
      <TouchableOpacity style={styles.prevBtn} onPress={prevProduct}>
        <Text style={styles.btnText}>Prev</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextBtn} onPress={nextProduct}>
        <Text style={styles.btnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 6,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#205781',
    marginBottom: 4,
    textAlign: 'center',
  },
  desc: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  prevBtn: {
    position: 'absolute',
    left: 0,
    top: '40%',
    backgroundColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    zIndex: 2,
  },
  nextBtn: {
    position: 'absolute',
    right: 0,
    top: '40%',
    backgroundColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 2,
  },
  btnText: {
    fontWeight: 'bold',
    color: '#205781',
  },
});