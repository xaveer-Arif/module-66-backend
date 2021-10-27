const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const { application } = require('express');

const app = express();
const port = proces.env.PORT || 5000;
// middleWare
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// node mongodb, function 
async function run(){
    try{
        await client.connect();
        const database = client.db('online_shop');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('order')

        app.get('/products', async(req,res) => {
            const cursor = productCollection.find({});
            // console.log(req.query);
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const count = await cursor.count();
            let products;
            if(page){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray()
            }
            // const products = await cursor.toArray();
            res.send({
                count,
                products
            });
        });
        // console.log('database connected successfully')
        // pagination post 
            app.post('/products/keys', async (req, res) => {
            const keys = req.body;
            const query = {key: {$in: keys}}
            const products = await productCollection.find(query).toArray()

            // console.log(req.body)
            res.json(products)
})
// order post 
            app.post('/order', async(req, res) => {
                const keys = req.body;
                const orderResult = await orderCollection.insertOne(keys);
                res.json(orderResult)
                // console.log('order keys', keys)
            })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req,res) => {
    console.log('get command')
    res.send('get the api using /products')
})
app.listen(port, () => {
    console.log('Listining port' , port)
})