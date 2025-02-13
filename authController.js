const bcrypt=require('bcryptjs');
const userModel = require('../model/users');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');

const transport=nodemailer.createTransport({
    host:'smtp',
    requireTLS:false,
    port:465,
    service:'gmail',
    auth:{
        user:'taufikur1999@gmail.com',
        pass:'ynxi rdso puus auwa'
    }
})

const signup=async(req,res)=>{
    try{
        let formData;
        console.log(req.body,req.file);
        if(!req.body.user_name){
            res.status(201).json({
                Error:'Error',
                message: 'User Name is Required'
            })
        }
        else if(!req.file){
            res.status(201).json({
                Error:'Error',
                message: 'User Image is Required'
            })
        }
        else if(!req.body.user_email){
            res.status(201).json({
                Error:'Error',
                message: 'User Email is Required'
            })
        }
        else if(!req.body.password){
            res.status(201).json({
                Error:'Error',
                message: 'Passowrd is Required'
            })
        }
        else{
            exist_user=await userModel.findOne({user_email:req.body.user_email});
            if(exist_user){
                res.status(201).json({
                    Error:'Error',
                    message: 'User Already Exists'
                })
            }
            else{
                    formData=await userModel({
                    user_name:req.body.user_name,
                    user_image:req.file.filename,
                    user_email:req.body.user_email,
                    password:await bcrypt.hash(req.body.password,12),
                })
                let saved=await formData.save();
                if(saved){
                    let email_token=jwt.sign(
                        {user_email:req.body.user_email},
                        process.env.SECRET_KEY,
                        {expiresIn:'1h'}
                    )
                    console.log('Email_Token',email_token);
                    let mailOptions={
                        from:'taufikur1999@gmail.com',
                        to:req.body.user_email,
                        subject:'Confirm Your Mail',
                        text:'Hello ' + req.body.user_name+'\n\n'+
                        'Your registration Done Successfully'+'\n\nPlease Confirm your email below'+
                        '\n\n'+`http://localhost:5500/emailVerify/${req.body.user_email}/${email_token}` +'\n\nThank You'
                    }
                    transport.sendMail(mailOptions,(err,data)=>{
                        if(err){
                            console.log('Error in sending Mail',err);
                            res.status(201).json({
                                Error:'Error',
                                message: 'Error in sending Mail'+err
                            }) 
                        }
                        else{
                            console.log('Email sent',data.response);
                            res.status(200).json({
                                Success:'Success',
                                message: 'Email sent'+data.response
                            })
                        }
                    })
                }
            }
        }    
        
    }
    catch(err){
        console.log('Error in signing up',err);
        res.status(401).json({
            Error:'Error',
            message: 'Error in signing up' +err
        })
    }
}

const confirmMail=async(req,res)=>{
    try{
        let exist_user=await userModel.findOne({user_email:req.params.email});
        if(exist_user){
            exist_user.emailVerify=true
            await exist_user.save();
            res.status(200).json({
                Success:'Success',
                message: 'Email Verification Succesfully'
            })
        }
    }
    catch(err){
        console.log('Error in verification',err);
        res.status(401).json({
            Error:'Error',
            message: 'Error in verification' +err
        })
        
    }
}

const userLogin=async(req,res)=>{
    try{
        console.log(req.body);
        let exist_user;
        let checkPass;
        if(!req.body.user_email){
            res.status(201).json({
                Error:'Error',
                message: 'User Email is Required'
            })
        }
        else if(!req.body.password){
            res.status(201).json({
                Error:'Error',
                message: 'Password is Required'
            })
        }
        else{
            exist_user=await userModel.findOne({user_email:req.body.user_email})
            if(exist_user){
                checkPass=await bcrypt.compare(req.body.password,exist_user.password);
                if(checkPass){
                    let verify_token=jwt.sign(
                        {userData:exist_user},
                        process.env.SECRET_KEY,
                        {expiresIn:'1h'}
                    )
                res.status(200).json({
                    Success: 'Success',
                    message: 'Login Succesful',
                    token:verify_token
                })
                }
                else{
                    res.status(401).json({
                        Error:'Error',
                        message: 'Password Mismatch'
                    })
                }
            }
            else{
                res.status(401).json({
                    Error:'Error',
                    message: 'Email does not exists'
                })
            }
        }
    }
    catch(err){
        console.log('Error in login',err);
        res.status(401).json({
            Error:'Error',
            message: 'Error in login',err
        })  
    }
}

module.exports={
    signup,
    confirmMail,
    userLogin
}