const express = require('express');
const router = express.Router();

//Import Controllers
const {createPost,editPost,deletePost,fetchAllPost} = require('../controllers/postController');
const {createComment,editComment,deleteComment} = require('../controllers/commentController');
const {createLike,deleteLike} = require('../controllers/likeController');
const {registration} = require('../controllers/registration');
const {logIn} = require('../controllers/logIn');
const {auth} = require('../middlewares/Auth');

//Define Routes
router.post('/create/post',auth,createPost);
router.post('/create/comment',auth,createComment);
router.post('/create/like',auth,createLike);

router.delete('/remove/like',auth,deleteLike);
router.delete('/remove/post/:id',auth,deletePost);
router.delete('/remove/comment',auth,deleteComment);

router.put('/edit/post/:id',auth,editPost);
router.put('/edit/comment',auth,editComment);

router.get('/get/posts',fetchAllPost);

router.post('/login',logIn);
router.post('/registration',registration);

//Export Router
module.exports = router;