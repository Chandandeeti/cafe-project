import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

const Navigation = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ☕ Café
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/menu" className="nav-link">Menu</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>

              <div className="user-menu">
                <span className="user-name">👤 {user?.name}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
