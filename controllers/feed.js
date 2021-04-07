const { validationResult } = require('express-validator');

const Post = require('../models/Post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/image.jpg',
        creator: {
          name: 'John Doe',
        },
        createdAt: new Date(),
      },
    ],
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
