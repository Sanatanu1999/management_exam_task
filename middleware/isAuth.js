const jwt=require('jsonwebtoken');

class AuthJwt{
    async authJwt(req,res,next){
        try{
            const authHeader=req.headers['x-token'];
            if(!authHeader){
                res.status(401).json({
                    error:'error',
                    message:'Not Authenticated'
                })
            }
            else{
                jwt.verify(authHeader,process.env.SECRET_KEY,(err,data)=>{
                    if(err){
                        console.log("Verification failed",err);
                        next();
                    }
                    else{
                        req.user=data;
                        next();
                    }
                })
                next();
            }
        }
        catch(err){
            console.log("Error to verify token",err);
            res.status(401).json({
                error:'error',
                message:"Error to verify token" +err
            })
        }
    }
}
module.exports=new AuthJwt();