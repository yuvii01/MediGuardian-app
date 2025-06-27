import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login } from '../reducers/UserSlice';
import { dbToCart } from '../reducers/cartSlice';
import { Context } from '../context/MainContext';

export default function Login() {
  const { API_BASE_URL, USER_BASE_URL, openToast, CART_BASE_URL } = useContext(Context);
  const cart = useSelector(store => store.cart);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const loginHandler = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);

    try {
      const res = await axios.post(API_BASE_URL + USER_BASE_URL + "/login", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.status === 1) {
        openToast && openToast(res.data.msg, "success");
        dispatch(login({ user: res.data.user }));
        await stateToCart(res.data.user._id);
        router.replace('/');
      } else {
        openToast && openToast(res.data.msg, "error");
      }
    } catch (error) {
      console.log(error);
      openToast && openToast("Client side error", "error");
    }
  };

  const stateToCart = async (userId) => {
    try {
      const res = await axios.post(API_BASE_URL + CART_BASE_URL + "/state-to-cart/" + userId, { state_cart: cart.data });
      if (res.data.status === 1) {
        let total = 0;
        const cartData = res.data.userCart.map((c) => {
          total += (c.pId.discount_price * c.qty);
          return { pId: c.pId._id, qty: c.qty };
        });
        dispatch(dbToCart({ data: cartData, total }));
      }
    } catch (error) {
      console.log(error);
      openToast && openToast("Client side error", "error");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        {/* <Image
          source={require('../assets/logo.jpeg')}
          style={{ width: 100, height: 100, marginBottom: 16 }}
          resizeMode="contain"
        /> */}
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', textAlign: 'center' }}>
          Sign in to your account
        </Text>
      </View>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, color: '#222', marginBottom: 4 }}>Email address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8,
            backgroundColor: '#f9f9f9'
          }}
        />
      </View>
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 14, color: '#222', marginBottom: 4 }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={{
            borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8,
            backgroundColor: '#f9f9f9'
          }}
        />
      </View>
      <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
        <Text style={{ color: '#6366f1', fontWeight: 'bold' }}>Forgot password?</Text>
      </TouchableOpacity>
      <Button title="Sign in" color="#6366f1" onPress={loginHandler} />
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Text style={{ fontSize: 14, color: '#222' }}>
          Don’t have an account yet?{' '}
          <Text
            style={{ color: '#6366f1', fontWeight: 'bold' }}
            onPress={() => router.push('/sign-up')}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}