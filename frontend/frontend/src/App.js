import { useState, useEffect } from 'react';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // 1. Fetch existing items
  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => response.json())
      .then(data => setMenuItems(data));
  }, []);

  // 2. Add a new item
  const handleAddItem = async (e) => {
    e.preventDefault(); 
    const newItem = { name: name, description: description, price: parseFloat(price) };

    try {
      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const savedItem = await response.json();
        setMenuItems([...menuItems, savedItem]);
        setName('');
        setDescription('');
        setPrice('');
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // 3. NEW: Delete an item
  const handleDeleteItem = async (id) => {
    try {
      // Send the delete request to our backend with the specific item ID
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Filter out the deleted item so it instantly disappears from the screen!
        setMenuItems(menuItems.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div style={{ backgroundColor: '#fefae0', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#283618', fontSize: '3rem', margin: '0' }}>The Roasted Bean Cafe</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '10px' }}>Admin Dashboard & Menu</p>
      </div>

      {/* Admin Form */}
      <div style={{ maxWidth: '500px', margin: '0 auto 50px auto', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#bc6c25', marginBottom: '20px', textAlign: 'center' }}>Add New Menu Item</h2>
        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Item Name (e.g., Blueberry Muffin)" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }} />
          <input type="number" step="0.01" placeholder="Price (e.g., 4.50)" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }} />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#283618', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>+ Add to Menu</button>
        </form>
      </div>

      {/* Menu Display */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        {menuItems.map((item) => (
          <div key={item._id} style={{ background: 'white', padding: '25px', borderRadius: '10px', width: '280px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderBottom: '5px solid #d4a373', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#bc6c25', marginBottom: '10px', fontSize: '1.4rem' }}>{item.name}</h3>
              <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.4' }}>{item.description}</p>
              <p style={{ fontSize: '1.4rem', color: '#283618', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
            </div>
            {/* NEW: Delete Button */}
            <button onClick={() => handleDeleteItem(item._id)} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
              Delete Item
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;