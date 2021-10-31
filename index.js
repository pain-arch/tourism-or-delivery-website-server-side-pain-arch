const express = require('express');
const app = express();
const cors =require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ok4d4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
   try{
        await client.connect();
        const database = client.db('travelio_db');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('placed-orders')

        //post Api
        app.post('/services', async (req,res) =>{
          const service = req.body;
          const result = await serviceCollection.insertOne(service);
          console.log(result);
          res.json(result);
        });
        //post Api for Placed order
        app.post('/placed-order', async (req, res)=>{
             const order = req.body;
             const result = await orderCollection.insertOne(order);
             console.log('hitting',order);
             res.json(result);
        });

        //Get API 
        app.get('/services', async(req, res) =>{

          const cursor = serviceCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
        });

        //Get API for all Order
        app.get('/placed-order', async(req, res) =>{

          const cursor = orderCollection.find({});
          const orders = await cursor.toArray();
          res.send(orders);
        });

        //Get Single Service
        app.get('/services/:id', async (req, res)=>{
             const id =req.params.id;
             const query = {_id:ObjectId(id)};
             const service = await serviceCollection.findOne(query);
             res.json(service);

        });
        //delete order
        app.delete('/placed-order/:id', async(req, res)=> {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await orderCollection.deleteOne(query);
  
          console.log("deleting user", id);
          console.log("delete done", result);
  
          res.json(result);
        })
       
   }
   finally{
        //await client.close;
   }
}

run().catch(console.dir);


app.get('/', (req, res) => {
     res.send('Hello World!');
});
app.listen(port, () => {
     console.log(`Running app listening on port !`, port);
});