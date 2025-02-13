const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const { signup, confirmMail, userLogin } = require('../controller/authController');
const AwtJwt=require('../middleware/isAuth');
const { userProfile, editUser } = require('../controller/userController');
const { addQuestions, showQuestions, addCategory, edit } = require('../controller/adminController');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,'..','uploads'),(err,data)=>{
            if(err)
                throw err
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err)
                throw err
        })
    }
})

const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes('jpeg')||
        file.mimetype.includes('jpg')||
        file.mimetype.includes('png')||
        file.mimetype.includes('svg')||
        file.mimetype.includes('webp')
    )
    callback(null,true)
    else
    callback(null,false)
}

const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1025*1025*5}
})

router.post('/signup',upload.single('user_image'),signup);

router.get('/emailVerify/:email/:token',confirmMail);

router.post('/userLogin',userLogin);

router.get('/profile',AwtJwt.authJwt,userProfile);

router.put('/edit/:id',upload.single('user_image'),editUser);

router.post('/questions',addQuestions);

router.get('/showquestions',showQuestions);

router.post('/category',addCategory);


module.exports=router;