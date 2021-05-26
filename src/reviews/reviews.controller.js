const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function reviewExists(req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);

    if (review) {
        res.locals.review = review;
        return next();
    }

    next({
        status: 404,
        message: "Review cannot be found."
    });
};

async function update(req, res, next) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id
    };

    await reviewsService.update(updatedReview);

    res.json({data: await reviewsService.read(req.params.reviewId)})
};

async function read(req, res, next) {
    res.json({data: await reviewsService.read(req.params.reviewId)})
};

async function destroy(req, res, next) {
    await reviewsService.destroy(req.params.reviewId);
    res.sendStatus(204);
};

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}