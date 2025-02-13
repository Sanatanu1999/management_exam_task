require('dotenv').config();
const express=require('express');
const appServer=express();
const mongoose=require('mongoose');
const router = require('./router/router');
const port=process.env.PORT||5500

appServer.use(express.urlencoded({extended:true}));


appServer.use(router);
mongoose.connect(process.env.DB_URL)
.then(res=>{
    appServer.listen(port,()=>{
        console.log(`Database and Server Connected Successfully at http://localhost:${port}`);
    })
})
.catch(err=>{
    console.log('Error in cretaion of database or server',err);
})
