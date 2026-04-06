import React, { useState, useEffect } from 'react';
import { menuAPI, categoryAPI, adminAPI } from '../services/api';
import '../styles/admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (activeTab === 'menu') {
      fetchMenuItems();
      fetchCategories();
    } else if (activeTab === 'category') {
      fetchCategories();
    }
  }, [activeTab]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAllItems();
      setItems(response.data.data);
    } catch (err) {
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleAddOrUpdateMenuItem = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await adminAPI.updateMenuItem(editingId, menuForm);
        setMessage('Menu item updated successfully');
      } else {
        await adminAPI.createMenuItem(menuForm);
        setMessage('Menu item created successfully');
      }
      setMenuForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '' });
      setEditingId(null);
      fetchMenuItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await adminAPI.deleteMenuItem(id);
        setMessage('Menu item deleted');
        fetchMenuItems();
      } catch (err) {
        setError('Failed to delete item');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingId(item.id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.category?.id || '',
      imageUrl: item.imageUrl || '',
    });
  };

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await adminAPI.updateCategory(editingId, categoryForm);
        setMessage('Category updated successfully');
      } else {
        await adminAPI.createCategory(categoryForm);
        setMessage('Category created successfully');
      }
      setCategoryForm({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await adminAPI.deleteCategory(id);
        setMessage('Category deleted');
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingId(cat.id);
    setCategoryForm({ name: cat.name, description: cat.description || '' });
  };

  return (
    <div className="admin-container">
      <h1>🛠️ Admin Panel</h1>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('menu');
            setEditingId(null);
            setMenuForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '' });
          }}
        >
          Menu Items
        </button>
        <button
          className={`tab-btn ${activeTab === 'category' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('category');
            setEditingId(null);
            setCategoryForm({ name: '', description: '' });
          }}
        >
          Categories
        </button>
      </div>

      {activeTab === 'menu' && (
        <div className="admin-content">
          <div className="admin-form">
            <h3>{editingId ? 'Edit' : 'Add'} Menu Item</h3>
            <form onSubmit={handleAddOrUpdateMenuItem}>
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={menuForm.categoryId}
                  onChange={(e) => setMenuForm({ ...menuForm, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={menuForm.imageUrl}
                  onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setMenuForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="admin-list">
            <h3>Menu Items</h3>
            {loading && !items.length ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="items-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category?.name}</td>
                        <td>₹{parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.available ? '✓' : '✗'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditMenuItem(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteMenuItem(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'category' && (
        <div className="admin-content">
          <div className="admin-form">
            <h3>{editingId ? 'Edit' : 'Add'} Category</h3>
            <form onSubmit={handleAddOrUpdateCategory}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows="3"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setCategoryForm({ name: '', description: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="admin-list">
            <h3>Categories</h3>
            {loading && !categories.length ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="items-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>{cat.name}</td>
                        <td>{cat.description}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditCategory(cat)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
