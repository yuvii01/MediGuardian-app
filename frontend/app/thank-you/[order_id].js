import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { dbToCart } from '../../reducers/cartSlice';
import { Context } from '../../context/MainContext';
import axios from 'axios';

export default function ThankYou() {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);
  const { order_id } = useLocalSearchParams();
  const { API_BASE_URL, CART_ORDER_URL } = useContext(Context);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(dbToCart());
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(API_BASE_URL + CART_ORDER_URL + `/${order_id}`);
        if (res.data.status === 1) {
          setOrder(res.data.order);
        }
      } catch (e) {
        // handle error
      }
      setLoading(false);
    };
    fetchOrder();
  }, [order_id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Loading order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.checkCircle}>
              {/* Checkmark SVG */}
              <Text style={{ color: '#22c55e', fontSize: 28 }}>✓</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.orderId}>Order #{order._id}</Text>
              <Text style={styles.thankYou}>Thank You {user.data?.name}</Text>
            </View>
          </View>
          {/* <Image source={require('../../assets/logo.jpeg')} style={{ width: 48, height: 48 }} /> */}
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={styles.confirmed}>Your Order is Confirmed</Text>
          <Text style={styles.confirmedDesc}>
            We have accepted your order, and we're getting it ready. A confirmation mail has been sent to {order.shipping_details?.email}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailsCol}>
            <Text style={styles.detailsTitle}>Customer Details</Text>
            <View style={{ marginTop: 12 }}>
              <View style={styles.flexBetween}>
                <View>
                  <Text style={styles.label}>Email</Text>
                  <Text>{order.shipping_details?.email}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Phone</Text>
                  <Text>{order.shipping_details?.phone}</Text>
                </View>
              </View>
              <View style={[styles.flexBetween, { marginTop: 16 }]}>
                <View>
                  <Text style={styles.label}>Billing address</Text>
                  <Text>
                    {order.shipping_details?.first_name} {order.shipping_details?.last_name}
                  </Text>
                  <Text>
                    {order.shipping_details?.Street} {order.shipping_details?.Locality}
                  </Text>
                  <Text>
                    {order.shipping_details?.City}, {order.shipping_details?.State} {order.shipping_details?.pin}
                  </Text>
                </View>
                <View>
                  <Text style={styles.label}>Shipping address</Text>
                  <Text>
                    {order.shipping_details?.first_name} {order.shipping_details?.last_name}
                  </Text>
                  <Text>
                    {order.shipping_details?.Street} {order.shipping_details?.Locality}
                  </Text>
                  <Text>
                    {order.shipping_details?.City}, {order.shipping_details?.State} {order.shipping_details?.pin}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.orderCol}>
            <Text style={styles.detailsTitle}>Order Details</Text>
            {/* You can add product details here if needed */}
            <View style={{ marginTop: 24 }}>
              <View style={styles.flexBetween}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.label}>₹ {order.order_total}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, backgroundColor: '#fff', flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0fce4',
    alignItems: 'center', justifyContent: 'center'
  },
  orderId: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  thankYou: { fontSize: 22, fontWeight: 'bold', color: '#2563eb' },
  confirmed: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  confirmedDesc: { marginTop: 6, color: '#555', fontSize: 14 },
  detailsRow: { flexDirection: 'row', marginTop: 32, gap: 16 },
  detailsCol: { flex: 1, marginRight: 8 },
  orderCol: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, padding: 16 },
  detailsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  flexBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  label: { fontWeight: 'bold', fontSize: 13, color: '#222' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});