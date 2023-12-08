const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.forgetPassword = async(req,res) => {
    try{
        //Fetch Email
        const email = req.body.email;

        //Validation Check
        if(!email){
            return res.status(400).json({
                success : false,
                message : 'Enter the Email Carefully'
            })
        }

        //Looking For User
        const user = await User.findOne({ email: email });

        //if User Does't exist with this email
        if(!user){
            return res.status(400).json({
                success : false,
                message : `This Email: ${email} is not Registered With Us Enter a Valid Email `
            })
        }

        //Create Token Using Crypto for Authenticaton
        const token = crypto.randomBytes(20).toString("hex");

        //Adding Token in User Details
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
              token: token,
              resetPasswordExpires: Date.now() + 3600000,
            },
            { new: true }
        );
        console.log(updatedDetails);
        //Return succesful Response with the Token for Reseting Password
        res.status(200).json({
            success : true,
            message : `You are approved for Reseting Password kindly go to Reset Password with this token ${token}`
        })
    }   
    catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong while User Forget Password'
        })
    }
}

exports.resetPassword = async(req,res) => {
    try{
        //Fetching Details for Reset Password
        const {newPassword , confirmNewPassword , token} = req.body;

        //Validation Check
        if(!newPassword || !confirmNewPassword || !token){
            return res.status(400).json({
                success : false,
                message : 'Enter the Details Carefully'
            })
        }
        //Checking Both Password are Same or Not
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
              success: false,
              message: "Password and Confirm Password Does not Match",
            })
        }

        //Looking For User
        const userDetails = await User.findOne({ token: token })

        //If any User not found
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Token is Invalid",
            })
        }

        //If Token expires
        if (!(userDetails.resetPasswordExpires > Date.now())) {
            return res.status(403).json({
                success: false,
                message: `Token is Expired, Please Regenerate Your Token and Try Again`,
            })
        }

        //If all Going Right then Hash the New Password
        let hashPass;
        try{
            //Hasing the Password Using Bcrypt
            hashPass = await bcrypt.hash(newPassword,10);
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                success : false,
                message : 'Internal Server Problem while Hashing Password'
            })
        }

        //Now Update Password with New Password
        const updateUser = await User.findOneAndUpdate({token : token},{password : hashPass},{new : true});

        //Send Successful Message
        res.status(200).json({
            success : true,
            data : updateUser,
            message : 'The password has been successfully reset.'
        });
    }
    catch(err){
        console.log(err);
        return res.json({
            success: false,
            message: `Some Error in Updating the Password`,
        })
    }
}