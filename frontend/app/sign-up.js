import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Context } from '../context/MainContext';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/UserSlice';
import { dbToCart } from '../reducers/cartSlice';
import * as ImagePicker from 'expo-image-picker';

export default function Signup() {
  const { API_BASE_URL, USER_BASE_URL, openToast, CART_BASE_URL } = useContext(Context);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordColor, setPasswordColor] = useState('#888');
  const cart = useSelector(store => store.cart);
  const [file, setFile] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [disease, setDisease] = useState('');
  const [address, setAddress] = useState('');

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordStrength('Password is too weak');
      setPasswordColor('#ef4444');
    } else if (text.length < 10) {
      setPasswordStrength('Password is moderate');
      setPasswordColor('#f59e42');
    } else {
      setPasswordStrength('Password is strong');
      setPasswordColor('#22c55e');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const removeHandler = () => setFile(null);

  const signupHandler = async () => {
    if (!name || !email || !password || !contactNumber || !age || !guardianContact) {
      Alert.alert('Please fill all required fields');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('contactNumber', contactNumber);
    formData.append('gender', gender);
    formData.append('age', age);
    formData.append('guardian_contactNo', guardianContact);
    formData.append('Disease', disease);
    formData.append('address', address);
    if (file) {
      formData.append('image', {
        uri: file.uri,
        name: file.fileName || 'profile.jpg',
        type: file.type || 'image/jpeg',
      });
    }

    try {
      const res = await axios.post(API_BASE_URL + USER_BASE_URL + '/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.status === 1) {
        openToast && openToast(res.data.msg, "success");
        dispatch(login({ user: res.data.user }));
        await stateToCart(res.data.user._id);
        router.replace('/');
      } else {
        openToast && openToast(res.data.msg, 'error');
      }
    } catch (error) {
      console.error(error);
      openToast && openToast('Client-side error', 'error');
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
      openToast && openToast("Client side error", "error");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          {/* <Image
            source={require('../assets/logo.jpeg')}
            style={{ width: 100, height: 100, marginBottom: 16 }}
            resizeMode="contain"
          /> */}
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', textAlign: 'center' }}>
            Create your account
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={handlePasswordChange} placeholder="Enter your password" secureTextEntry />
          <Text style={{ fontSize: 12, color: passwordColor, marginBottom: 8 }}>{passwordStrength}</Text>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput style={styles.input} value={contactNumber} onChangeText={setContactNumber} placeholder="Enter your contact number" keyboardType="phone-pad" />
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {['Male', 'Female', 'Other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderButton, gender === g && styles.genderButtonSelected]}
                onPress={() => setGender(g)}
              >
                <Text style={{ color: gender === g ? '#fff' : '#222' }}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Enter your Age" keyboardType="numeric" />
          <Text style={styles.label}>Guardian's Contact Number</Text>
          <TextInput style={styles.input} value={guardianContact} onChangeText={setGuardianContact} placeholder="Enter guardian's contact number" keyboardType="phone-pad" />
          <Text style={styles.label}>Disease (Any Major)</Text>
          <TextInput style={styles.input} value={disease} onChangeText={setDisease} placeholder="Enter disease (if any)" />
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Enter your Address" />
          <Text style={styles.label}>Profile Image</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Button title={file ? "Change Image" : "Pick Image"} onPress={pickImage} />
            {file && (
              <>
                <Image source={{ uri: file.uri }} style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 12 }} />
                <TouchableOpacity onPress={removeHandler}>
                  <Text style={{ color: '#ef4444', marginLeft: 8 }}>Remove</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Button title="Sign Up" color="#6366f1" onPress={signupHandler} />
          <Text style={{ textAlign: 'center', marginTop: 16 }}>
            Already have an account?{' '}
            <Text style={{ color: '#6366f1', fontWeight: 'bold' }} onPress={() => router.push('/login')}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  label: { fontSize: 14, color: '#222', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8,
    backgroundColor: '#f9f9f9'
  },
  genderRow: { flexDirection: 'row', marginBottom: 8 },
  genderButton: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8, backgroundColor: '#fff'
  },
  genderButtonSelected: {
    backgroundColor: '#6366f1', borderColor: '#6366f1'
  },
});