import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Context } from '../context/MainContext';
import axios from 'axios';
import { dbToCart, emptyCart } from '../reducers/cartSlice';
import { useRouter } from 'expo-router';

export default function Checkout() {
  const { products, productImageUrl, API_BASE_URL, fetchProduct, CART_ORDER_URL } = useContext(Context);
  const user = useSelector(store => store.user);
  const cart = useSelector(store => store.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  const [cartProduct, setCartProduct] = useState([]);
  const [form, setForm] = useState({
    first_name: user.data?.name || '',
    last_name: '',
    Street: user.data?.street || '',
    Locality: user.data?.locality || '',
    City: user.data?.city || '',
    State: '',
    pin: user.data?.pin || '',
    phone: user.data?.phone || '',
    email: user.data?.email || '',
    payment_mode: 2, // 1: COD, 2: Online
  });

  useEffect(() => {
    fetchProduct && fetchProduct();
  }, []);

  useEffect(() => {
    const data = [];
    for (let p of products) {
      for (let c of cart.data) {
        if (c.pId === p._id) {
          data.push({ ...c, ...p });
        }
      }
    }
    setCartProduct(data);
  }, [cart, products]);

  const handleInput = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.Street || !form.Locality || !form.City || !form.State || !form.pin || !form.phone || !form.email) {
      Alert.alert('Please fill all required fields');
      return;
    }
    const shipping_details = {
      first_name: form.first_name,
      last_name: form.last_name,
      Street: form.Street,
      Locality: form.Locality,
      City: form.City,
      State: form.State,
      pin: form.pin,
      phone: form.phone,
      email: form.email,
    };
    const payment_mode = form.payment_mode;
    const order_total = cart.total + (payment_mode === 1 ? 50 : 0);

    try {
      const res = await axios.post(API_BASE_URL + CART_ORDER_URL + "/place-order", {
        user_id: user.data,
        shipping_details,
        order_total,
        payment_mode,
        product_details: cartProduct,
      });
      if (res.data.status === 1) {
        dispatch(emptyCart());
        router.replace(`/thank-you/${res.data.order_id}`);
      }
    } catch (error) {
      Alert.alert('Order failed', 'Please try again.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Your Details:</Text>
        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="First Name"
              value={form.first_name}
              onChangeText={text => handleInput('first_name', text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Last Name"
              value={form.last_name}
              onChangeText={text => handleInput('last_name', text)}
            />
          </View>
          <Text style={styles.label}>Address</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Floor no / Street Address"
              value={form.Street}
              onChangeText={text => handleInput('Street', text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Locality / Area"
              value={form.Locality}
              onChangeText={text => handleInput('Locality', text)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="City"
              value={form.City}
              onChangeText={text => handleInput('City', text)}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="State"
              value={form.State}
              onChangeText={text => handleInput('State', text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="PIN Code"
              value={form.pin}
              onChangeText={text => handleInput('pin', text)}
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Phone Number"
              value={form.phone}
              onChangeText={text => handleInput('phone', text)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="E-mail"
              value={form.email}
              onChangeText={text => handleInput('email', text)}
              keyboardType="email-address"
            />
          </View>
          <Text style={styles.label}>Mode of Payment</Text>
          <View style={[styles.row, { marginBottom: 16 }]}>
            <TouchableOpacity
              style={[styles.radio, form.payment_mode === 1 && styles.radioSelected]}
              onPress={() => handleInput('payment_mode', 1)}
            >
              <Text style={{ color: form.payment_mode === 1 ? '#fff' : '#222' }}>COD (+₹50)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, form.payment_mode === 2 && styles.radioSelected]}
              onPress={() => handleInput('payment_mode', 2)}
            >
              <Text style={{ color: form.payment_mode === 2 ? '#fff' : '#222' }}>Online</Text>
            </TouchableOpacity>
          </View>
          <Button title="Submit" color="#6366f1" onPress={handleSubmit} />
        </View>
        {/* Cart Section */}
        <View style={styles.cartSection}>
          <Text style={styles.cartHeading}>YOUR CART</Text>
          {cartProduct.map((pro, i) => (
            <View key={i} style={styles.cartItem}>
              <Image
                source={{ uri: API_BASE_URL + productImageUrl + pro.image }}
                style={styles.cartImage}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cartName}>{pro.name}</Text>
                <Text style={styles.cartPrice}>₹ {pro.discount_price} x {pro.qty}</Text>
              </View>
            </View>
          ))}
          <View style={styles.cartSummary}>
            <View style={styles.cartSummaryRow}>
              <Text>Item Subtotal</Text>
              <Text>₹ {cart.total}</Text>
            </View>
            <View style={styles.cartSummaryRow}>
              <Text>Shipping</Text>
              <Text>₹ 0.00</Text>
            </View>
            <View style={styles.cartSummaryRow}>
              <Text style={{ fontWeight: 'bold' }}>Total</Text>
              <Text style={{ fontWeight: 'bold' }}>₹ {cart.total}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  formSection: { marginBottom: 32 },
  label: { fontSize: 14, color: '#222', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8,
    backgroundColor: '#f9f9f9'
  },
  row: { flexDirection: 'row', marginBottom: 8 },
  radio: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  cartSection: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16 },
  cartHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cartImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
  cartName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  cartPrice: { fontSize: 14, color: '#555' },
  cartSummary: { marginTop: 16 },
  cartSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
});