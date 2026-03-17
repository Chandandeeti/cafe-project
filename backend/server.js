// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- STEP 1: PASTE YOUR CONNECTION STRING BELOW ---
// Replace <password> with your actual database password!
const dbURI = "mongodb://deetichandan8_db_user:WZWp8bOaaWI5cizk@ac-l8lbtd9-shard-00-00.zmt0d0s.mongodb.net:27017,ac-l8lbtd9-shard-00-01.zmt0d0s.mongodb.net:27017,ac-l8lbtd9-shard-00-02.zmt0d0s.mongodb.net:27017/?ssl=true&replicaSet=atlas-t3ldo6-shard-0&authSource=admin&appName=ChandanCluster0";

mongoose.connect(dbURI, { dbName: 'cafedb' })
  .then(() => console.log('Connected to MongoDB database!'))
  .catch((err) => console.log(err));

// --- STEP 2: CREATE THE MENU BLUEPRINT ---
const menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imageUrl: String // <--- ADD THIS NEW LINE!
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// --- STEP 3: SEND MENU TO FRONTEND ---
// When React asks for the menu, we fetch it from MongoDB
app.get('/api/menu', async (req, res) => {
    try {
        const items = await MenuItem.find(); // Grabs all items from the database
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu" });
    }
});
// --- STEP 4: RECEIVE NEW ITEMS FROM FRONTEND ---
app.post('/api/menu', async (req, res) => {
    try {
        const newItem = new MenuItem(req.body); 
        const savedItem = await newItem.save(); 
        res.status(201).json(savedItem); 
    } catch (error) {
        res.status(500).json({ message: "Error saving new menu item" });
    }
});
// --- STEP 5: DELETE ITEMS ---
// When React sends a DELETE request with an ID, we remove it from MongoDB
app.delete('/api/menu/:id', async (req, res) => {
    try {
        const itemId = req.params.id; // Grab the ID from the URL
        await MenuItem.findByIdAndDelete(itemId); // Tell MongoDB to delete it
        res.status(200).json({ message: "Item successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item" });
    }
});

app.listen(5000, () => {
    console.log('Backend Server is running on port 5000');
});