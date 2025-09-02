import express from "express";
import fetch from "node-fetch";

const app = express();

// Allow CORS for all
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Proxy route
app.get("/api/*", async (req, res) => {
  try {
    // Get everything after "/api/"
    const path = req.params[0];
    const targetUrl = `https://eren-world.onrender.com/api/v1/${path}`;

    const response = await fetch(targetUrl);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data", details: err.message });
  }
});

// Render sets PORT automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
