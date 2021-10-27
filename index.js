const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')

const app = express();
const port = 5000;
// middleWare
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// node mongodb, function 
async function run(){
    try{
        await client.connect();
        const database = client.db('online_shop');
        const productCollection = database.collection('products')

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
            })
        })
        // console.log('database connected successfully')
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