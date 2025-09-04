import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = "https://eren-world.onrender.com/api/v1";

// ⚡ Enable CORS for all origins
app.use(cors());

// Endpoint definitions
const endpoints = [
  { name: "Home", endpoint: "/home" },
  { name: "A-Z List", endpoint: "/animes/az-list/:letter" },
  { name: "Top Airing", endpoint: "/animes/top-airing" },
  { name: "Most Popular", endpoint: "/animes/most-popular" },
  { name: "Most Favorite", endpoint: "/animes/most-favorite" },
  { name: "Completed", endpoint: "/animes/completed" },
  { name: "Recently Added", endpoint: "/animes/recently-added" },
  { name: "Recently Updated", endpoint: "/animes/recently-updated" },
  { name: "Top Upcoming", endpoint: "/animes/top-upcoming" },
  { name: "Genre", endpoint: "/animes/genre/:genre" },
  { name: "Subbed Anime", endpoint: "/animes/subbed-anime" },
  { name: "Dubbed Anime", endpoint: "/animes/dubbed-anime" },
  { name: "Movie", endpoint: "/animes/movie" },
  { name: "TV", endpoint: "/animes/tv" },
  { name: "OVA", endpoint: "/animes/ova" },
  { name: "ONA", endpoint: "/animes/ona" },
  { name: "Special", endpoint: "/animes/special" },
  { name: "Events", endpoint: "/animes/events" },
  { name: "Details", endpoint: "/anime/:id" },
  { name: "Search", endpoint: "/search" },
  { name: "Search Suggestions", endpoint: "/suggestion" },
  { name: "Characters", endpoint: "/characters/:id" },
  { name: "Character Detail", endpoint: "/character/:id" },
  { name: "Actor Detail", endpoint: "/character/:id" },
  { name: "Episodes", endpoint: "/episodes/:id" },
  { name: "Servers", endpoint: "/servers" },
  { name: "Stream", endpoint: "/stream" },
];

// Default queries
const defaultQueries = {
  "/animes/az-list/:letter": { page: 1 },
  "/animes/top-airing": { page: 1 },
  "/animes/most-popular": { page: 1 },
  "/animes/most-favorite": { page: 1 },
  "/animes/completed": { page: 1 },
  "/animes/recently-added": { page: 1 },
  "/animes/recently-updated": { page: 1 },
  "/animes/top-upcoming": { page: 1 },
  "/animes/genre/:genre": { page: 1 },
  "/animes/subbed-anime": { page: 1 },
  "/animes/dubbed-anime": { page: 1 },
  "/animes/movie": { page: 1 },
  "/animes/tv": { page: 1 },
  "/animes/ova": { page: 1 },
  "/animes/ona": { page: 1 },
  "/animes/special": { page: 1 },
  "/animes/events": { page: 1 },
  "/search": { page: 1 },
  "/suggestion": { page: 1 },
  "/characters/:id": { page: 1 },
  "/stream": { type: "sub", server: "hd-2" },
};

// Fetch helper
const fetchData = async (endpoint, params = {}, queries = {}) => {
  let url = `${BASE_URL}${endpoint}`;

  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });

  const defaults = defaultQueries[endpoint] || {};
  const finalQueries = { ...defaults, ...queries };
  const queryString = new URLSearchParams(finalQueries).toString();
  if (queryString) url += `?${queryString}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed fetch: ${res.status}`);
  return res.json();
};

// Auto-generate all routes
endpoints.forEach(ep => {
  app.get(`/api/v1${ep.endpoint}`, async (req, res) => {
    try {
      const params = req.params;
      const queries = req.query;
      const data = await fetchData(ep.endpoint, params, queries);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ Proxy API with CORS is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy running at http://localhost:${PORT}`);
});
