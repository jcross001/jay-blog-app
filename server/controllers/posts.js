import Post from "../model/post.js";
import User from "../model/user.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const catQuery = req.query.cat;
  try {
    if (!catQuery) {
      const posts = await Post.findAll();
      return res.status(200).json(posts);
    }
    const posts = await Post.findAll({ where: { category: catQuery } });
    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: [{ model: User, required: true }],
    });
    if (!post) {
      return res.status(500).json("Post Not Available");
    }
    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(500).json("Not Authenticated!");
  }
  try {
    jwt.verify(token, "s3cdY7Fv3G", async (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      await Post.create({
        title: req.body.title,
        desc: req.body.desc,
        img: req.body.img,
        category: req.body.cat,
        date: req.body.date,
        userId: userInfo.id,
      });
      return res.status(200).json("Post has being created!");
    });
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(500).json("Not Authenticated!");
  }
  try {
    jwt.verify(token, "s3cdY7Fv3G", async (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      const postId = req.params.id;

      await Post.destroy({ where: { id: postId, userId: userInfo.id } });
      return res.json("Post has being deleted!");
    });
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(500).json("Not Authenticated!");
  }
  try {
    jwt.verify(token, "s3cdY7Fv3G", async (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      await Post.update(
        {
          title: req.body.title,
          desc: req.body.desc,
          img: req.body.img,
          category: req.body.cat,
        },
        { where: { id: req.params.id, userId: userInfo.id } }
      );
      return res.status(200).json("Post has being updated!");
    });
  } catch (err) {
    console.log(err);
  }
};
