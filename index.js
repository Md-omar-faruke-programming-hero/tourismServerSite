const express =require('express')
require('dotenv').config()
const cors= require('cors')
const ObjectId=require('mongodb').ObjectId
const app=express()
const port= process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("server connected")
})
app.listen(port,()=>{
    console.log("listening port",port)
})


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqb98.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

 async function run(){
            try{
                await client.connect();
                const database = client.db("tourism");
                const spotCollection = database.collection("spot");
                const bookCollection=database.collection("bookData")
                // get api
                app.get("/spot",async(req,res)=>{
                    const cursor= spotCollection.find({})
                    const result= await cursor.toArray()
                    res.send(result)
                    console.log("ok")
                    
                })
               
                // post api for spot
                app.post("/spot",async(req,res)=>{
                    console.log(req.body)
                    const name=req.body.name;
                    const price=req.body.price;
                    const day=req.body.day;
                    const img=req.body.img;
                    const rating=req.body.rating

                   const data={
                       name:name,price:price,day:day,img:img,rating:rating
                   }
                   const result= await spotCollection.insertOne(data)
                   res.json(result)
                   console.log(result);
                   
                })

                // get api single item
                app.get('/spot/:id',async(req,res)=>{
                    const id=req.params.id;
                    const query={_id:ObjectId(id)}
                    const result= await spotCollection.findOne(query)
                    res.send(result);
                })

                // post api
                app.post("/bookData",async(req,res)=>{
                    console.log(req.body)
                    const name=req.body.name;
                    const email=req.body.email;
                    const spot=req.body.spot;
                    const date=req.body.date;
                    const phn=req.body.phn;
                    const status=req.body.status;
                    const price=req.body.price
                    const doc={
                        name:name,email:email,spot:spot,data:date,phn:phn,status:status,price:price,
                    }

                    const result= await bookCollection.insertOne(doc)
                    res.json(result)
                    console.log(result)
                })
                // get api for bookdata
                app.get("/bookData",async(req,res)=>{
                    const coursor= bookCollection.find({})
                    const result= await coursor.toArray()
                    res.send(result)
                })

                // get api for single bookData
                app.get("/bookData/:id",async(req,res)=>{
                    const id= req.params.id;
                    const query={_id:ObjectId(id)}
                    const result= await bookCollection.findOne(query)
                    res.send(result)
                })

                //  delete api for single sopt
                app.delete("/bookData/:id",async(req,res)=>{
                    const id=req.params.id;
                    const query= {_id:ObjectId(id)}
                    const result= await bookCollection.deleteOne(query)
                    res.json(result)
                    console.log(result)
                })

                // update api
                app.put("/bookData/:id",async(req,res)=>{
                    const id=req.params.id;
                    const query={_id:ObjectId(id)}
                    const status=req.body.status

                    const options = { upsert: true };
                    const doc={
                        $set:{
                            status:status
                        }
                    }
            const result= await bookCollection.updateOne(query,doc,options)
            console.log(result);
            res.json(result)

                })
            }
            finally{
               

            }
 }
 run().catch(console.dir)