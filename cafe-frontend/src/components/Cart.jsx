import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import '../styles/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, removeFromCart, updateCartItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setMessage('Item removed');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to remove item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) {
      await handleRemoveItem(itemId);
      return;
    }
    try {
      await updateCartItem(itemId, quantity);
    } catch (err) {
      setError('Failed to update quantity');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const response = await orderAPI.createOrder({ items: cartItems });
      await clearCart();
      setMessage('Order placed successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      const errMessage = err.response?.data?.message || 'Failed to place order';
      setError(errMessage);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>🛒 Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/menu')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>🛒 Shopping Cart</h1>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="cart-content">
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="item-name">{item.menuItem?.name || 'Unknown Item'}</td>
                  <td>₹{parseFloat(item.menuItem?.price || 0).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="quantity-input"
                    />
                  </td>
                  <td>
                    ₹{(item.quantity * parseFloat(item.menuItem?.price || 0)).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{parseFloat(totalPrice || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>₹{(parseFloat(totalPrice || 0) * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{(parseFloat(totalPrice || 0) * 1.1).toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button
                className="btn btn-primary btn-block"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              <button
                className="btn btn-secondary btn-block"
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
