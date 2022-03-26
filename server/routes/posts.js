import express from 'express';

import auth from "../middleware/auth.js";

import { getPosts,commentPost, getPost,getPostsBySearch, createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';

const router = express.Router();

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.post('/',auth, createPost);
router.get('/:id', getPost);
router.patch('/:id',auth, updatePost);
router.delete('/:id',auth, deletePost);
router.patch('/:id/likePost',auth, likePost);
router.post('/:id/commentPost', commentPost);
export default router;