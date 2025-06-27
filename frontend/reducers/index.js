import cartReducer from './cartSlice';
import userReducer from './UserSlice';

const rootReducer = {
  cart: cartReducer,
  user: userReducer,
};

export default rootReducer;