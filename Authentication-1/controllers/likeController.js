const Post = require('../model/postModel');
const Like = require('../model/likeModel');
const User = require('../model/userModel');

exports.createLike = async (req, res) => {
    try {
        // Fetch Data
        const { postId } = req.body; // Extract 'body' from req.body
        const { username } = req.user;

        console.log(postId);

        const findPost = await Post.findById(postId);
        if (!findPost) {
            return res.status(400).json({
                success: false,
                message: 'Post is Not Created',
            });
        }

        // DB Call: Create Method
        const newLike = await Like.create({ postId, user: username});
        const updateUser = await User.findOneAndUpdate(
            { username: username },
            { $push: { likes: newLike._id } },
            { new: true }
        )

        // Add Comment ID in the Post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { likes: newLike._id } },
            { new: true }
        )
            .populate('likes')
            .exec();

        // Send Success Response
        res.status(200).json({
            success: true,
            message: 'Like Successfully Added in the Post',
            data: updatedPost,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Something Went wrong while Creating Like',
        });
    }
};


function isLikeExist(likes,likeId){
    return likes.includes(likeId);
}

exports.deleteLike = async(req,res) => {
    try{
        //Fetch Information
        const {likeId,postId} = req.body;
        const {username} = req.user;

        const searchUser = await User.findOne({username : username});
        const likes = searchUser.likes;

        if(!isLikeExist(likes,likeId)){
            return res.status(400).json({
                success : false,
                message : 'You do not have Permission for Delete This Like'
            })
        }

        //Find By it's Id and delete from Like DB
        await Like.findByIdAndDelete(likeId);

        //Also Remove From the Post's Likes Array
        const updatedPost = await Post.findByIdAndUpdate(postId,{$pull : {likes : likeId}},{new : true});
        const updateUser = await User.findOneAndUpdate({username : username},{$pull : {likes : likeId}} , {new : true});

         //Send Success Response
         res.status(200).json({
            success : true,
            message : 'Like Deleted from The Post',
            data : updatedPost
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Creating Like',
        })
    }
};