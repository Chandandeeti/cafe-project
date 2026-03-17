import { useState, useEffect } from 'react';

function App() {
  // --- CORE STATES ---
  // We changed the default view to 'home' so they see the landing page first!
  const [viewMode, setViewMode] = useState('home'); 
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  
  // --- ADMIN STATES ---
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => response.json())
      .then(data => setMenuItems(data));
  }, []);

  // --- ADMIN FUNCTIONS ---
  const handleAddItem = async (e) => {
    e.preventDefault(); 
    const newItem = { 
      name, description, price: parseFloat(price),
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=60" 
    };
    try {
      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const savedItem = await response.json();
        setMenuItems([...menuItems, savedItem]);
        setName(''); setDescription(''); setPrice(''); setImageUrl('');
      }
    } catch (error) { console.error("Error adding item:", error); }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, { method: 'DELETE' });
      if (response.ok) { setMenuItems(menuItems.filter(item => item._id !== id)); }
    } catch (error) { console.error("Error deleting item:", error); }
  };

  // --- CUSTOMER FUNCTIONS ---
  const addToCart = (item) => setCart([...cart, item]);
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);
  const handleCheckout = () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    alert(`Thank you for your order! Your total is $${cartTotal.toFixed(2)}.`);
    setCart([]); 
  };

  return (
    <div style={{ backgroundColor: '#fefae0', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* --- PROFESSIONAL NAVIGATION BAR --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#283618', padding: '15px 40px', color: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h1 
          onClick={() => setViewMode('home')} 
          style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '1px', cursor: 'pointer' }}
        >
          ☕ The Roasted Bean
        </h1>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => setViewMode('home')} style={{ background: 'none', border: 'none', color: viewMode === 'home' ? '#d4a373' : 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Home</button>
          <button onClick={() => setViewMode('menu')} style={{ background: 'none', border: 'none', color: viewMode === 'menu' ? '#d4a373' : 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Order Menu</button>
          <button onClick={() => setViewMode('admin')} style={{ background: 'none', border: 'none', color: viewMode === 'admin' ? '#d4a373' : 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Admin</button>
        </div>
      </nav>

      {/* ========================================= */}
      {/* 1. HOME PAGE VIEW                         */}
      {/* ========================================= */}
      {viewMode === 'home' && (
        <div style={{ textAlign: 'center' }}>
          {/* Hero Image Section */}
          <div style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80")', 
            backgroundSize: 'cover', backgroundPosition: 'center', height: '70vh', 
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '20px'
          }}>
            <h1 style={{ fontSize: '4.5rem', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Crafted For You.</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.5' }}>Experience the finest artisanal coffee and freshly baked pastries, sourced globally and roasted locally.</p>
            <button 
              onClick={() => setViewMode('menu')} 
              style={{ padding: '15px 40px', backgroundColor: '#d4a373', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.3rem', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(212, 163, 115, 0.4)' }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start Your Order ➔
            </button>
          </div>

          {/* Mini Features Section */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', padding: '60px 20px', backgroundColor: 'white', flexWrap: 'wrap' }}>
            <div style={{ width: '300px' }}>
              <h3 style={{ color: '#283618', fontSize: '1.5rem' }}>🌱 Organic Beans</h3>
              <p style={{ color: '#666' }}>We source only 100% organic, fair-trade coffee beans from the best farms around the world.</p>
            </div>
            <div style={{ width: '300px' }}>
              <h3 style={{ color: '#283618', fontSize: '1.5rem' }}>🥐 Baked Daily</h3>
              <p style={{ color: '#666' }}>Our pastries are made from scratch every single morning by our expert in-house bakers.</p>
            </div>
            <div style={{ width: '300px' }}>
              <h3 style={{ color: '#283618', fontSize: '1.5rem' }}>🚀 Fast Pickup</h3>
              <p style={{ color: '#666' }}>Order online through our menu and skip the line. Your coffee will be waiting for you.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 2. CUSTOMER MENU VIEW                     */}
      {/* ========================================= */}
      {viewMode === 'menu' && (
        <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '40px auto', padding: '0 20px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '2', minWidth: '300px' }}>
            <h2 style={{ color: '#bc6c25', fontSize: '2.5rem', marginTop: 0, marginBottom: '20px' }}>Order Menu</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {menuItems.map((item) => (
                <div key={item._id} style={{ background: 'white', borderRadius: '15px', width: '250px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderBottom: '6px solid #d4a373' }}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#bc6c25', margin: '0 0 10px 0', fontSize: '1.3rem' }}>{item.name}</h3>
                    <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.4', fontSize: '0.9rem' }}>{item.description}</p>
                    <p style={{ fontSize: '1.3rem', color: '#283618', fontWeight: 'bold', margin: '0' }}>${item.price.toFixed(2)}</p>
                  </div>
                  <div style={{ padding: '0 15px 15px 15px' }}>
                    <button onClick={() => addToCart(item)} style={{ padding: '10px', backgroundColor: '#283618', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Add to Order</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '1', minWidth: '300px', background: 'white', padding: '25px', borderRadius: '15px', alignSelf: 'flex-start', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', borderTop: '6px solid #283618', position: 'sticky', top: '100px' }}>
            <h2 style={{ color: '#283618', marginTop: 0, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Your Cart 🛒</h2>
            {cart.length === 0 ? <p style={{ color: '#999', fontStyle: 'italic' }}>Your cart is empty.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                {cart.map((cartItem, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>{cartItem.name}</span>
                      <span style={{ color: '#666', marginLeft: '10px' }}>${cartItem.price.toFixed(2)}</span>
                    </div>
                    <button onClick={() => removeFromCart(index)} style={{ color: '#e63946', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333' }}>Total:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#283618' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} style={{ marginTop: '20px', width: '100%', padding: '15px', backgroundColor: '#d4a373', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>Checkout Now</button>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 3. ADMIN VIEW                             */}
      {/* ========================================= */}
      {viewMode === 'admin' && (
        <div style={{ padding: '40px 20px' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto 50px auto', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#bc6c25', marginBottom: '20px', textAlign: 'center' }}>Add New Menu Item</h2>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="url" placeholder="Image URL (Optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#283618', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add to Menu</button>
            </form>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
            {menuItems.map((item) => (
              <div key={item._id} style={{ background: 'white', borderRadius: '15px', width: '250px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderBottom: '6px solid #d4a373' }}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
                <div style={{ padding: '15px' }}>
                  <h3 style={{ color: '#bc6c25', margin: '0 0 10px 0', textAlign: 'center' }}>{item.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>{item.description}</p>
                  <p style={{ fontSize: '1.2rem', color: '#283618', fontWeight: 'bold', textAlign: 'center' }}>${item.price.toFixed(2)}</p>
                </div>
                <div style={{ padding: '0 15px 15px 15px' }}>
                  <button onClick={() => handleDeleteItem(item._id)} style={{ padding: '10px', backgroundColor: '#ffe5e5', color: '#e63946', border: '1px solid #ffcccc', borderRadius: '5px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>Remove Item</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;