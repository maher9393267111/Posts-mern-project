import express from "express";
import mongoose from "mongoose";

import PostMessage from "../models/postMessages.js";

const router = express.Router();

// export const getPosts = async (req, res) => {
//   try {
//     const postMessages = await PostMessage.find();

//     res.status(200).json(postMessages);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 3;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//search

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i"); // seach word and any thing after{i}

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  //   console.log(req.userId);
  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const userId = req.userId;

  const post = await PostMessage.findById(id); //  ✅

  const postcreator = await post.creator; //    ✅

  console.log("postcreator------>", postcreator);

  const postwithecodecreatorid = await PostMessage.findOne({ creator: userId }); //  ✅
  const postcreatortoken = postwithecodecreatorid?.creator;
  console.log("postcreatortoken", postcreatortoken);

  if (postcreator == postcreatortoken) {
    console.log("hhhhhhhhhhh");
    const postdelete = await PostMessage.findByIdAndDelete(id);
  }

  res.status(200).json("post deleted by his owner user"); //   ✅

  //   console.log(post);
  //   const postcreator = post.creator;
  //   const CreatorUser = await PostMessage.findOne({ userId }).exec();

  //   if (postcreator === CreatorUser.creator) {
  //     console.log(postcreator);
  //     await PostMessage.findByIdAndRemove(id);
  //   }

  // res.status(200).json({message:"post is deleted bu his owner user successfully",postcreator,CreatorUser})
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));
  // index === -1 that mean user._id not founded in likes arr and
  // user not make like and when click push user id in likes arr
  if (index === -1) {
    //
    post.likes.push(req.userId);
  } else {
    // if user make like pull his like fom likes arr
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};


// coment 
export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};


export default router;
