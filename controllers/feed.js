const { validationResult } = require('express-validator');

const Post = require('../models/Post');

exports.getPosts = (req, res, next) => {
  Post.find({})
    .then((posts) => {
      res.status(200).json({ message: 'posts fetched', posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    creator: {
      name: 'John Doe',
    },
    imageUrl: 'images/image.jpg',
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: createdPost,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ message: 'post fetched', post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
