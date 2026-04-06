import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItemId, quantity) => {
    try {
      setError(null);
      const response = await cartAPI.addItem({ menuItemId, quantity });
      setCart(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add item to cart';
      setError(message);
      throw new Error(message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setError(null);
      const response = await cartAPI.removeItem(itemId);
      setCart(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove item';
      setError(message);
      throw new Error(message);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setError(null);
      const response = await cartAPI.updateItem(itemId, { quantity });
      setCart(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update cart';
      setError(message);
      throw new Error(message);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartAPI.clearCart();
      setCart(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    fetchCart,
    cartItems: cart?.items || [],
    totalItems: cart?.items?.length || 0,
    totalPrice: cart?.totalPrice || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
