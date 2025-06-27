import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Context } from '../../context/MainContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../reducers/CartSlice';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

export default function ProductBox({ _id, name, image, price, discount_percent, discount_price, rating = 4 }) {
  const { productImageUrl, API_BASE_URL, CART_BASE_URL } = useContext(Context);
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);

  const addToDbCart = (pId) => {
    if (user.data != null) {
      axios.post(API_BASE_URL + CART_BASE_URL + "/add-to-cart", { user_id: user.data._id })
        .then(() => {})
        .catch(() => {});
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Image
          source={{ uri: API_BASE_URL + productImageUrl + image }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.name}>{name}</Text>
        <Stars yellow={rating} />
        {discount_percent == 0 ? (
          <Text style={styles.discountPrice}>₹ {discount_price}</Text>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.percentOff}>{discount_percent} % off</Text>
            <View style={styles.priceRow}>
              <Text style={styles.discountPrice}>₹{discount_price}</Text>
              <Text style={styles.strikePrice}>₹ {price}</Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            dispatch(addToCart({ price: discount_price, pId: _id, qty: 1 }));
            addToDbCart(_id);
          }}
        >
          <Text style={styles.addBtnText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Stars({ yellow }) {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name="star"
        size={18}
        color={i <= yellow ? "#FFC600" : "#C1C8CE"}
        style={{ marginRight: 2 }}
      />
    );
  }
  return <View style={styles.starsRow}>{stars}</View>;
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: 8 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    width: 236,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  name: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 8,
  },
  discountPrice: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  percentOff: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  strikePrice: {
    color: '#C1C8CE',
    textDecorationLine: 'line-through',
    marginLeft: 12,
    fontSize: 14,
  },
  addBtn: {
    width: '70%',
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: '#facc15',
    paddingVertical: 10,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});