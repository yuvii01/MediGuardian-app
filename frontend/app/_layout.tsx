import React from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store';
import MainContext from '../context/MainContext'; // <-- Import your context provider

export default function RootLayout() {
  return (
    <Provider store={store}>
      <MainContext>
        <Slot />
      </MainContext>
    </Provider>
  );
}