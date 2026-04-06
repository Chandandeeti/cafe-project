import React, { useState, useEffect } from 'react';
import { menuAPI, categoryAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/menu.css';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchItems();
    } else if (selectedCategory) {
      fetchByCategory();
    } else {
      fetchMenuItems();
    }
  }, [searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAvailableItems();
      setItems(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async () => {
    if (!selectedCategory) return;
    try {
      setLoading(true);
      const response = await menuAPI.getByCategory(selectedCategory);
      setItems(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load category items');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async () => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      const response = await menuAPI.searchItems(searchTerm);
      setItems(response.data.data);
      setError('');
    } catch (err) {
      setError('No items found');
      setItems([]);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (itemId) => {
    const quantity = parseInt(quantities[itemId] || 1);
    if (quantity < 1) {
      setMessage('Please select a valid quantity');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await addToCart(itemId, quantity);
      setMessage('Item added to cart!');
      setQuantities({ ...quantities, [itemId]: 1 });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to add item to cart');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities({ ...quantities, [itemId]: value });
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>🍽️ Our Menu</h1>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="menu-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          <button
            className={`category-btn ${!selectedCategory && 'active'}`}
            onClick={() => {
              setSelectedCategory(null);
              setSearchTerm('');
            }}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id && 'active'}`}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchTerm('');
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading menu items...</div>
      ) : items.length === 0 ? (
        <div className="no-items">No items found</div>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="menu-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="image-placeholder">🍽️</div>
                )}
              </div>

              <div className="menu-content">
                <h3>{item.name}</h3>
                <p className="menu-description">{item.description}</p>
                <p className="menu-price">₹{parseFloat(item.price).toFixed(2)}</p>
                <p className={`status ${item.available ? 'available' : 'unavailable'}`}>
                  {item.available ? '✓ In Stock' : '✗ Out of Stock'}
                </p>

                {item.available && (
                  <div className="menu-actions">
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="quantity-input"
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
