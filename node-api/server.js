const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/machine_round")
.then(()=>console.log("Mongo Connected"))
.catch(err=>console.log(err));

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true
    }
});

const User = mongoose.model("User", userSchema);

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

app.get("/",(req,res)=>{
    res.send("Node API Running");
});

/*
|--------------------------------------------------------------------------
| MYSQL -> MONGO SYNC
|--------------------------------------------------------------------------
*/

app.post("/sync-mongo", async(req,res)=>{

    try{

        let name = req.body.name;

        name = name.trim().toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | CHECK DUPLICATE
        |--------------------------------------------------------------------------
        */

        const existing = await User.findOne({name});

        if(existing){

            return res.json({
                status:false,
                message:"Duplicate in MongoDB"
            });
        }

        /*
        |--------------------------------------------------------------------------
        | INSERT INTO MONGO
        |--------------------------------------------------------------------------
        */

        await User.create({name});

        res.json({
            status:true,
            message:"MongoDB synced"
        });

    }catch(err){

        res.json({
            status:false,
            error:err.message
        });
    }
});


/*
|--------------------------------------------------------------------------
| INSERT INTO MONGODB
|--------------------------------------------------------------------------
*/

app.post("/insert-mongo", async(req,res)=>{

    try{

        let name = req.body.name;

        name = name.trim().toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | CHECK DUPLICATE
        |--------------------------------------------------------------------------
        */

        const existing = await User.findOne({name});

        if(existing){

            return res.json({
                status:false,
                message:"Duplicate name"
            });
        }

        /*
        |--------------------------------------------------------------------------
        | INSERT INTO MONGODB
        |--------------------------------------------------------------------------
        */

        await User.create({name});

        /*
        |--------------------------------------------------------------------------
        | SYNC TO MYSQL
        |--------------------------------------------------------------------------
        */

        const axios = require("axios");

        const mysqlResponse = await axios.post(
            "http://localhost/project/php-api/sync_mysql.php",
            {
                name
            }
        );

        res.json({
            status:true,
            message:"Inserted into MongoDB and synced to MySQL",
            mysql:mysqlResponse.data
        });

    }catch(err){

        res.json({
            status:false,
            error:err.message
        });
    }
});


app.listen(5000,()=>{
    console.log("Server running on port 5000");
});