import dotenv from "dotenv"
import connectDB from "./Database/dbindex.js"
import {app} from "./app.js"

dotenv.config()

const port = process.env.PORT || 4000

connectDB() 
.then(() => {
    app.listen(port, ()=>{
        console.log(`Server is running at port : ${port}`);
    })
})
.catch((err)=>{
    console.log("Mongodb connection failed !!!", err)
})