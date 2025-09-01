const axios = require("axios");
const JIKAN_BASE = "https://api.jikan.moe/v4";

// Home → Most Popular Episodes
const getHomeAnime = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(
      `${JIKAN_BASE}/watch/episodes/popular?page=${page}`
    );
    res.json({
      success: true,
      data: response.data,
      currentPage: parseInt(page),
      hasNextPage: response.data.pagination?.has_next_page || false
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home anime" });
  }
};

// Popular → Top Anime List
const getPopularAnime = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(
      `${JIKAN_BASE}/top/anime?page=${page}`
    );
    res.json({
      success: true,
      data: response.data,
      currentPage: parseInt(page),
      hasNextPage: response.data.pagination?.has_next_page || false
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular anime" });
  }
};

// Subbed → Anime with Japanese audio
const getSubbedAnime = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(
      `${JIKAN_BASE}/anime?order_by=score&sort=desc&page=${page}`
    );
    res.json({
      success: true,
      data: response.data,
      currentPage: parseInt(page),
      hasNextPage: response.data.pagination?.has_next_page || false
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subbed anime" });
  }
};

// Dubbed → Anime with English audio
const getDubbedAnime = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(
      `${JIKAN_BASE}/anime?order_by=popularity&sort=asc&page=${page}`
    );
    res.json({
      success: true,
      data: response.data,
      currentPage: parseInt(page),
      hasNextPage: response.data.pagination?.has_next_page || false
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dubbed anime" });
  }
};

// Series (TV)
const getSeriesAnime = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(
      `${JIKAN_BASE}/anime?type=tv&page=${page}&order_by=score&sort=desc`
    );
    res.json({
      success: true,
      data: response.data,
      currentPage: parseInt(page),
      hasNextPage: response.data.pagination?.has_next_page || false
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch series anime" });
  }
};

// Movies
const getMoviesAnime = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(
      `${JIKAN_BASE}/anime?type=movie&page=${page}&order_by=score&sort=desc`
    );
    res.json({
      success: true,
      data: response.data,
      currentPage: parseInt(page),
      hasNextPage: response.data.pagination?.has_next_page || false
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies anime" });
  }
};

module.exports = {
  getHomeAnime,
  getSubbedAnime,
  getDubbedAnime,
  getSeriesAnime,
  getMoviesAnime,
  getPopularAnime,
};
