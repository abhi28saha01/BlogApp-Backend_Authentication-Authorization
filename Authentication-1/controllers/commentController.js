const Comment = require('../model/commentModel');
const Post = require('../model/postModel');
const User = require('../model/userModel');

exports.createComment = async (req,res) => {
    try{
        //Fetch Data
        const {post,body} = req.body;
        const {username} = req.user;

        const findPost = await Post.findById(post);
        if(!findPost){
            return res.status(400).json({
                success : false,
                message : 'Post is Not Created',
            })
        }

        //DB Call : Create Method
        const newComment = await Comment.create({post,user : username,body});
        const updateUser = await User.findOneAndUpdate({username : username},{$push : {comments : newComment._id}},{new : true})
                                    .populate('comments').exec();
        //Add Comment ID in the Post
        const updatedPost = await Post.findByIdAndUpdate(post,{$push : {comments : newComment._id}} , {new : true})
                                                .populate('comments').exec();

        //Send Success Response
        res.status(200).json({
            success : true,
            message : 'Comment Successfully Added in the Post',
            data : updatedPost,
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Creating Comment',
        })
    }
};

function isCommentExist(comments,commentId){
    return comments.includes(commentId);
}

exports.editComment = async (req,res) => {
    try{
        //Fetch Data
        const {commentId,user,body} = req.body;
        const {username} = req.user;

        const searchUser = await User.findOne({username : username});
        const comments = searchUser.comments;

        if(!isCommentExist(comments,commentId)){
            return res.status(400).json({
                success : false,
                message : 'You do not have Permission for Edit This Comment'
            })
        }

        //DB Call : for Updating Comment
        const updatedComment = await Comment.findByIdAndUpdate(commentId,{user,body,editedAt : Date.now()} , {new : true});

        //Send Success Response
        res.status(200).json({
            success : true,
            message : 'Comment Successfully Updated in the Post',
            data : updatedComment,
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Updating Comment',
        })
    }
};

exports.deleteComment = async (req,res) => {
    try{
        //Fetch Information
        const {commentId,postId} = req.body;
        const {username} = req.user;

        const searchUser = await User.findOne({username : username});
        const comments = searchUser.comments;

        if(!isCommentExist(comments,commentId)){
            return res.status(400).json({
                success : false,
                message : 'You do not have Permission for Delete This Comment'
            })
        }

        //Find By it's Id and delete from Like DB
        await Comment.findByIdAndDelete(commentId);

        //Also Remove From the Post's Likes Array
        const updatedPost = await Post.findByIdAndUpdate(postId,{$pull : {comments : commentId}},{new : true});
        const updateUser = await User.findOneAndUpdate({username : username},{$pull : {comments : commentId}} , {new : true})

        //Send Success Response
        res.status(200).json({
            success : true,
            message : 'Comment Deleted from This Post',
            data : updatedPost
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Deleting Comment',
        })
    }
};