const express = require("express");
const {
  getHomeAnime,
  getSubbedAnime,
  getDubbedAnime,
  getSeriesAnime,
  getMoviesAnime,
  getPopularAnime,
} = require("./animeController");

const anime = express.Router();

anime.get("/home", getHomeAnime);
anime.get("/subbed", getSubbedAnime);
anime.get("/dubbed", getDubbedAnime);
anime.get("/series", getSeriesAnime);
anime.get("/movies", getMoviesAnime);
anime.get("/popular", getPopularAnime);

module.exports = {anime};
