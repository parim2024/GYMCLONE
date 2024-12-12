
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import {sendEmail} from "./utils/sendEmail.js"

const app = express();
const router = express.Router();

config({ path: "./config.env" });

console.log(process.env.PORT);

// use middleware
app.use(
    cors({
        origin: [process.env.FRONTEND_URL] ,
        methods : ["POST"],
        credentials : true,
    })
);

// now we will use more middleware 
//one is to parese the json data
//second is to authenticate the data
app.use(express.json());
app.use(express.urlencoded({ extended : true}));


//aab hum check krengey kya backend mein server running hai
//for this we have to use router
router.get("/" , (req , res , next) =>{
   res.json({ success: true , message: "backend server is running"});
})
app.use(router);



// aab hum router bnayengey mail ki
router.post("/send/mail" , async(req,res,next) =>{
    const{ name , email , message} = req.body ;
    if(!name || !email || !message){
        return next(
            res.status(400).json({
                success:false ,
                message : "Please provide all details"
            })
        )
    }
    try{
await sendEmail ({
    email: "pmittal20115@gmail.com" , 
    subject : "GYM WEBSITE CONTACT" ,
    message ,
    userEmail: email ,
});
res.status(200).json({
    success: true, // Correct
    message : "Message was sent successfully"
})
    }
    catch(error){
        console.log(error) ;
res.status(500).json({ 
    success : false ,
    message : "Internal Server Error"
})
    }
})




app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});


