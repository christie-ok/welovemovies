const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");
const moviesConfig = require("../utils/movies-config")

const reduceMovies = reduceProperties("movie_id", moviesConfig);


const criticsConfig = {
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name"
};

const mapCritics = mapProperties(criticsConfig);


function list() {
    return knex("movies").select("*");
};

function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("*")
        .where({"mt.is_showing": true})
        .then(reduceMovies)
};

function read(movieId) {
    return knex("movies").select("*").where({movie_id: movieId}).first();
};

function theaters(movieId) {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("t.*", "mt.is_showing", "mt.movie_id")
        .where({"m.movie_id": movieId})
};

function reviewsByMovie(movieId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({"r.movie_id": movieId})
        .then((reviews) => reviews.map((review) => mapCritics(review)))
}


module.exports = {
    list,
    listShowing,
    read,
    theaters,
    reviewsByMovie
}