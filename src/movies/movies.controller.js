const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function movieExists(req, res, next) {
    const movie = await moviesService.read(req.params.movieId);
    
    if (movie) {
        res.locals.movie = movie;
        return next();
    };
    next({status: 404, message: "Movie cannot be found."});
};

async function list(req, res, next) {
  const showing = req.query.is_showing;
  
  if (showing) {
    const data = await moviesService.listShowing();
    return res.json({data: data })
  }
 
    res.json({data: await moviesService.list()});
};

async function listShowing(req, res, next) {
    res.json({data: await moviesService.listShowing});
};

function read(req, res, next) {
    res.json({data: res.locals.movie});
};

async function theaters(req, res, next) {
    res.json({data: await moviesService.theaters(req.params.movieId) })
};

async function reviewsByMovie(req, res, next) {
  
  res.json({data: await moviesService.reviewsByMovie(req.params.movieId) })
};



module.exports = {
    list: asyncErrorBoundary(list),
    listShowing: asyncErrorBoundary(listShowing),
    read: [asyncErrorBoundary(movieExists), read],
    theaters: asyncErrorBoundary(theaters),
    reviewsByMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(reviewsByMovie)]
}