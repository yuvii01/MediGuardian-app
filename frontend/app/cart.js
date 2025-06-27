import React, { useContext, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Context } from '../context/MainContext';
import { changeCartQty, removeFromCart } from '../reducers/cartSlice';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function Cart() {
  const user = useSelector(store => store.user);
  const cart = useSelector(store => store.cart);
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, productImageUrl, API_BASE_URL, fetchProduct, CART_BASE_URL } = useContext(Context);

  useEffect(() => {
    fetchProduct && fetchProduct();
  }, []);

  // Build cartProduct array
  const cartProduct = [];
  for (let p of products) {
    for (let c of cart.data) {
      if (c.pId === p._id) {
        cartProduct.push({ ...c, ...p });
      }
    }
  }

  const updateDbCart = (pId, newQty) => {
    if (user.data != null) {
      axios.put(API_BASE_URL + CART_BASE_URL + "/change-quantity", { user_id: user.data._id, pId, newQty });
    }
  };

  const removeFromDbCart = (pId) => {
    if (user.data != null) {
      axios.post(API_BASE_URL + CART_BASE_URL + "/remove-from-cart", { user_id: user.data._id, pId });
    }
  };

  const checkout = () => {
    if (user.data == null) {
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };

  if (!cart.data || cart.data.length === 0) {
    return (
      <View style={styles.centered}>
        {/* <Image source={require('../assets/pngwing.com.png')} style={{ width: 180, height: 180, marginBottom: 24 }} /> */}
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyDesc}>Looks like you haven't added any items to your cart yet.</Text>
        <Button title="Explore Products" color="#facc15" onPress={() => router.push('/')} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Shopping Bag</Text>
        <Text style={styles.subheading}>{cart.data?.length} items in your bag.</Text>
        <View style={styles.cartTable}>
          {cartProduct.map((pro, i) => (
            <View key={i} style={styles.cartRow}>
              <Text style={styles.srNo}>{i + 1}</Text>
              <Image
                source={{ uri: API_BASE_URL + productImageUrl + pro.image }}
                style={styles.productImage}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.category}>{pro?.category_id?.name}</Text>
                <Text style={styles.productName}>{pro?.name}</Text>
                <Text style={styles.productColor}>Color · {pro?.color?.name}</Text>
              </View>
              <Text style={styles.price}>₹ {pro?.discount_price}</Text>
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    dispatch(changeCartQty({ pId: pro?._id, flag: false, price: pro.discount_price }));
                    updateDbCart(pro._id, pro.qty - 1);
                  }}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{pro.qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    dispatch(changeCartQty({ pId: pro._id, flag: true, price: pro.discount_price }));
                    updateDbCart(pro._id, pro.qty + 1);
                  }}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.price}>₹ {pro.discount_price * pro.qty}</Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(removeFromCart({ pId: pro._id, total_price: pro.discount_price * pro.qty }));
                  removeFromDbCart(pro._id);
                }}
              >
                <Text style={styles.removeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Cart Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Cart Total</Text>
          <View style={styles.summaryRow}>
            <Text>Cart Subtotal</Text>
            <Text>₹ {cart.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ color: '#888' }}>Shipping</Text>
            <Text style={{ color: '#888' }}>Free</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Discount</Text>
            <Text>0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ fontWeight: 'bold' }}>Cart Total</Text>
            <Text style={{ fontWeight: 'bold' }}>₹ {cart.total}</Text>
          </View>
          <Button title="Check Out" color="#2563eb" onPress={checkout} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subheading: { fontSize: 14, color: '#555', marginBottom: 16 },
  cartTable: { marginBottom: 24 },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  srNo: { width: 24, textAlign: 'center', fontWeight: 'bold' },
  productImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
  category: { fontSize: 10, color: '#888', textTransform: 'uppercase' },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  productColor: { fontSize: 10, color: '#888' },
  price: { width: 70, textAlign: 'center', fontSize: 13, color: '#222' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  qtyBtn: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
  },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold' },
  qtyText: { fontSize: 14, marginHorizontal: 4 },
  removeBtn: { color: '#ef4444', fontSize: 22, marginLeft: 8 },
  summary: { backgroundColor: '#fef9c3', borderRadius: 12, padding: 16, marginTop: 16 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#555', marginBottom: 16, textAlign: 'center' },
});