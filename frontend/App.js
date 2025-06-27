import React from 'react';
import { Provider } from 'react-redux';
import store from './store'; // Adjust the path if your store is elsewhere
import Home from './app/index'; // Your main component

export default function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}