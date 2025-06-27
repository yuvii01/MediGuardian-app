import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Context } from '../context/MainContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../reducers/cartSlice';
import axios from 'axios';

export default function MedicineBuyingPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { category, fetchCategory, products, fetchProduct, API_BASE_URL, CART_BASE_URL } = useContext(Context);
  const dispatcher = useDispatch();
  const user = useSelector(store => store.user);

  useEffect(() => {
    const fetchCategories = async () => {
      await fetchCategory();
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const categoryOptions = category.map((cat) => ({
    value: cat._id,
    label: cat.name,
    image: cat.image,
  }));

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id._id === selectedCategory)
    : products;

  const addToDbCart = (pId) => {
    if (user.data != null) {
      axios.post(API_BASE_URL + CART_BASE_URL + "/add-to-cart", { user_id: user.data._id })
        .then(() => {
          Alert.alert("Added to cart!");
        })
        .catch(() => {
          Alert.alert("Error adding to cart.");
        });
    } else {
      Alert.alert("Please login to add to cart.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2DAA9E" />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={styles.heading}>Buy Medicines from Trusted Sources</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a category" value={null} />
          {categoryOptions.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>

      {filteredProducts.length > 0 ? (
        <View>
          <Text style={styles.subheading}>
            {selectedCategory
              ? categoryOptions.find((cat) => cat.value === selectedCategory)?.label
              : "Popular Medicines"}
          </Text>
          {filteredProducts.map((product) => (
            <View key={product._id} style={styles.productCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Image
                  source={{ uri: `http://localhost:5000/image/product/${product.image}` }}
                  style={styles.productImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>Price: <Text style={{ fontWeight: 'bold' }}>{product.price}</Text></Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToDbCart(product._id)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
                </TouchableOpacity>
              </View>
              {/* Trusted Sources */}
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {/* <Image source={require('../assets/1mg.png')} style={styles.sourceLogo} />
                <Image source={require('../assets/appolo.png')} style={styles.sourceLogo} /> */}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noProductsText}>
          {selectedCategory
            ? "No products available for the selected category."
            : "Please select a category to see the products."}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  pickerContainer: { marginBottom: 16, backgroundColor: '#f3f4f6', borderRadius: 8 },
  picker: { height: 50, width: '100%' },
  subheading: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: '#333' },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 16 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  productPrice: { fontSize: 14, color: '#555', marginTop: 4 },
  addButton: {
    backgroundColor: '#2DAA9E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  sourceLogo: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#fff' },
  noProductsText: { color: '#888', textAlign: 'center', marginTop: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
});