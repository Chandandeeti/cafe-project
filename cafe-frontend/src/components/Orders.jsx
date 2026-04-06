import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancelOrder(orderId);
        fetchOrders();
        alert('Order cancelled successfully');
      } catch (err) {
        const errMessage = err.response?.data?.message || 'Failed to cancel order';
        setError(errMessage);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'PREPARING':
        return 'status-preparing';
      case 'READY':
        return 'status-ready';
      case 'PICKED_UP':
        return 'status-picked-up';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const canCancelOrder = (status) => {
    return ['PENDING', 'CONFIRMED'].includes(status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="orders-container">
        <h1>📋 My Orders</h1>
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h1>📋 My Orders</h1>
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>📋 My Orders</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div className="order-status-container">
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="order-total">
                  ₹{parseFloat(order.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="expand-btn"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              {expandedOrder === order.id ? '▼' : '▶'} Details
            </button>

            {expandedOrder === order.id && (
              <div className="order-details">
                <div className="items-section">
                  <h4>Items:</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.menuItem?.name || 'Unknown Item'}</td>
                          <td>₹{parseFloat(item.menuItem?.price || 0).toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>
                            ₹{(item.quantity * parseFloat(item.menuItem?.price || 0)).toFixed(
                              2
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="summary-section">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{parseFloat(order.totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (10%):</span>
                    <span>₹{(parseFloat(order.totalPrice) * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Grand Total:</span>
                    <span>₹{(parseFloat(order.totalPrice) * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                {canCancelOrder(order.status) && (
                  <div className="action-buttons">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
