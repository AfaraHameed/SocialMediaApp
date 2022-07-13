const router = require("express").Router();
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(403).json(err);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("post deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like a post

router.put("/:id/like" , async (req,res) => {
    const post = await Post.findById(req.params.id)
    try{
        if(!post.likes.includes(req.body.userId))
        {
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("like added")
        }
        else{
            res.status(403).json("you already liked this post")
        }
    }
    catch(err){
        res.status(403).json(err)
    }
  
})


//get a post

router.get("/:id" , async(req,res) => {
     try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)

     }catch(err){
        res.status(400).json("post not fund")
     }
})
//get all post
router.get("/" , async(req,res) => {
    try{
       const post = await Post.find()
       res.status(200).json(post)

    }catch(err){
       res.status(400).json("post not fund")
    }
})

//get all  post of a user

router.get("/:id" , async(req,res) => {
    try{
       const post = await Post.find({userId:id})
       res.status(200).json(post)

    }catch(err){
       res.status(400).json("post not fund")
    }
})

//get  timline posts

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
