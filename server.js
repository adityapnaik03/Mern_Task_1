const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Serve static frontend files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store seeded with the wireframe items (starting at 1)
let items = [
  { id: 1, name: 'Book', price: 250 },
  { id: 2, name: 'Pen', price: 25 }
];

// Helper: Generate the lowest available ID starting from 1
function getNextId() {
  if (items.length === 0) return 1;
  const existingIds = new Set(items.map(item => item.id));
  let id = 1;
  while (existingIds.has(id)) {
    id++;
  }
  return id;
}

// 1. GET /items - Retrieve all items
app.get('/items', (req, res) => {
  res.status(200).json(items);
});

// 2. POST /items - Create a new item
app.post('/items', (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined || price === null || isNaN(price)) {
    return res.status(400).json({ error: 'Valid name and price are required.' });
  }

  const newItem = {
    id: getNextId(),
    name: name.trim(),
    price: Number(price)
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// 3. PUT /items/:id - Update an existing item
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, price } = req.body;

  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  if (!name || price === undefined || price === null || isNaN(price)) {
    return res.status(400).json({ error: 'Valid name and price are required.' });
  }

  items[itemIndex] = {
    id: id,
    name: name.trim(),
    price: Number(price)
  };

  res.status(200).json(items[itemIndex]);
});

// 4. DELETE /items/:id - Remove an item by ID
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const deletedItem = items.splice(itemIndex, 1)[0];
  res.status(200).json({
    message: 'Item deleted successfully.',
    item: deletedItem
  });
});

// Optional reset endpoint to restore initial items starting from 1
app.post('/reset', (req, res) => {
  items = [
    { id: 1, name: 'Book', price: 250 },
    { id: 2, name: 'Pen', price: 25 }
  ];
  res.status(200).json({ message: 'Reset successful', items });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
