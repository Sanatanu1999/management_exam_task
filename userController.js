const userModel = require("../model/users");
const fs=require('fs');
const path=require('path');

const userProfile=async(req,res)=>{
    let user=req.user.userData;
    res.status(200).json({
        success:'success',
        data:user
    })
}

const editUser=async(req,res)=>{
        try{
            console.log(req.body,req.file);
            console.log(req.params.id);
            
            // let user_id=req.user.userData._id
            let oldData=await userModel.findOne({_id:req.params.id});
            console.log('Old Data',oldData);
            let editData=await userModel.findOneAndUpdate({_id:req.params.id},{
                user_name:req.body.user_name,
                user_image:req.file.filename,
            })
            fs.unlinkSync(path.join(__dirname,'..','uploads',oldData.user_image))
        if(editData){
            console.log('Edited Succesfully');
            res.status(201).json({
                success:true,
                message:'New Data after editing',
                newData:editData
            })
        }
        }
        catch(err){
            console.log('Error in editing Data',err);
            res.status(201).json({
                success:false,
                message:'old Data',err
            })
    
        }
        
}

module.exports={
    userProfile,
    editUser
}