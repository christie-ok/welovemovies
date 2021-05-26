const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");


const criticsConfig = {
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name"
};

const mapCritics = mapProperties(criticsConfig);


function update(updatedReview) {
    return knex("reviews")
        .where({review_id: updatedReview.review_id})
        .update(updatedReview, "*")
};

function read(reviewId) {
    return knex("reviews")
        .join("critics", "reviews.critic_id", "critics.critic_id")
        .select("critics.*", "reviews.*")
        .where({review_id: reviewId})
        .first()
        .then(mapCritics)
};

function destroy(reviewId) {
    return knex("reviews")
        .where({review_id: reviewId})
        .del();
}

module.exports = {
    update,
    read,
    destroy
}