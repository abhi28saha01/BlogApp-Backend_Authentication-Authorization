const Post = require('../model/postModel');
const User = require('../model/userModel');

exports.createPost = async(req,res) => {
    try{
        //Fetch Data
        const {title,body} = req.body;
        const {username} = req.user;

        //DB Call : Create Method
        const newPost = await Post.create({user : username,title,body});
        const updateUser = await User.findOneAndUpdate({username : username},{$push : {posts : newPost._id}},{new : true})
                                    .populate('posts').exec();

        //Send Success Response
        res.status(200).json({
            success : true,
            message : 'Post Created Successfully',
            data : newPost,
            user : updateUser
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Creating Post',
        })
    }
}

function isPostExist(posts,postId){
    return posts.includes(postId);
}

exports.editPost = async(req,res) => {
    try{
        //Fetch Data
        const {id} = req.params;
        const {title,body} = req.body;
        const {username} = req.user;

        const searchUser = await User.findOne({username : username})
        const posts = searchUser.posts; 

        if(!isPostExist(posts,id)){
            return res.status(400).json({
                success : false,
                message : 'You do not have Permission for Edit This Post'
            })
        }

        //DB Call : Update Method
        const updatedPost = await Post.findByIdAndUpdate(id,{title,body,editedAt : Date.now()},{new : true});

        //Return Successful Message
        res.status(200).json({
            success : true,
            message : 'Post Updated Successfully',
            data : updatedPost
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Updating Post',
        })
    }
}

exports.deletePost = async(req,res) => {
    try{
        //Fetch Data
        const {id} = req.params;
        const {username} = req.user;
        
        //Find Post by Id and Delete
        await Post.findByIdAndDelete(id);
        await User.findOneAndUpdate({username : username},{$pull : {posts : id}},{new : true});

        //Return Successful Message
        res.status(200).json({
            success : true,
            message : 'Post Deleted Successfully'
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Deleting Post',
        })
    }
}

exports.fetchAllPost = async(req,res) => {
    try{
        const posts = await Post.find({}).populate('comments').populate('likes').exec();

        res.status(200).json({
            success : true,
            message : 'Post Fetched Successfully',
            data : posts
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something Went wrong while Fetching Post',
        })
    }
}