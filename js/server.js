const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Add this line
const app = express();

// Enable CORS for all routes
app.use(cors()); // <- This fixes the issue

app.get('/api/steam-search', async (req, res) => {
  try {
    const { term } = req.query;
    const response = await axios.get(
      `https://store.steampowered.com/api/storesearch/?term=${term}&cc=MA&l=english`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy running on http://localhost:3000'));