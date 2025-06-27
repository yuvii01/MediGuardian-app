import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import run from "../config/gemini";
import { Alert } from 'react-native';

export const Context = React.createContext();

const MainContext = (props) => {
  // You can use a .env file or hardcode your API URLs for React Native
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const CATEGORY_BASE_URL = process.env.EXPO_PUBLIC_CATEGORY_BASE_URL || '/api/category';
  const COLOR_BASE_URL = process.env.EXPO_PUBLIC_COLOR_BASE_URL || '/api/color';
  const PRODUCT_BASE_URL = process.env.EXPO_PUBLIC_PRODUCT_BASE_URL || '/api/product';
  const USER_BASE_URL = process.env.EXPO_PUBLIC_USER_BASE_URL || '/api/user';
  const CART_BASE_URL = process.env.EXPO_PUBLIC_CART_BASE_URL || '/api/cart';
  const CART_ORDER_URL = process.env.EXPO_PUBLIC_ORDER_BASE_URL || '/api/order';

  const [category, setCategory] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [colors, setColor] = useState([]);
  const [products, setProduct] = useState([]);
  const [productImageUrl, setProductImageUrl] = useState("");

  const fetchProduct = (limit = 0, color_id = null, category_slug = null) => {
    const urlQuery = new URLSearchParams({ limit, color_id, category_slug });
    axios.get(API_BASE_URL + PRODUCT_BASE_URL + `?${urlQuery.toString()}`)
      .then((success) => {
        if (success.data.status == 1) {
          setProduct(success.data.product);
          setProductImageUrl(success.data.imageBaseUrl);
        }
      }).catch(() => {});
  };

  useEffect(() => {
    fetchCategory();
    fetchColor();
    fetchProduct();
  }, []);

  const fetchCategory = () => {
    axios.get(API_BASE_URL + CATEGORY_BASE_URL)
      .then((success) => {
        if (success.data.status == 1) {
          setCategory(success.data.category);
          setCategoryImageUrl(success.data.imageBaseUrl);
        }
      }).catch(() => {});
  };

  const fetchMedi = () => {
    axios.get(API_BASE_URL + "/api")
      .then((success) => {
        if (success.data.status == 1) {
          setMedicine(success.data.medicine);
        }
      }).catch(() => {});
  };

  const fetchColor = () => {
    axios.get(API_BASE_URL + COLOR_BASE_URL)
      .then((success) => {
        if (success.data.status == 1) {
          setColor(success.data.colors);
        }
      }).catch(() => {});
  };

  // Toast replacement for React Native
  const openToast = (msg, flag) => {
    Alert.alert(flag === "success" ? "Success" : "Error", msg);
  };

  // Gemini/AI chat logic (unchanged)
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData(prev => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }
    let responseArray = response.split('**');
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split('*').join('\n');
    let newResponseArray = newResponse2.split(' ');
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={{
      contextValue,
      medicine, setMedicine, fetchMedi, CART_ORDER_URL,
      category, USER_BASE_URL, setProduct, productImageUrl, products,
      fetchColor, fetchProduct, fetchCategory, colors, categoryImageUrl,
      openToast, API_BASE_URL, PRODUCT_BASE_URL, CATEGORY_BASE_URL, COLOR_BASE_URL, CART_BASE_URL
    }}>
      {props.children}
    </Context.Provider>
  );
};

export default MainContext;