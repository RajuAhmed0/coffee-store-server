const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9gyi.mongodb.net/?appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeInfo = client.db("coffee_store").collection("coffee");


        app.get("/coffee", async (req, res) => {
            const result = await coffeeInfo.find().toArray()
            res.send(result)
        })


        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeInfo.findOne(query)
            res.send(result)
        })


        app.post("/coffee", async (req, res) => {
            const coffeeData = req.body;
            const result = await coffeeInfo.insertOne(coffeeData)
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeInfo.deleteOne(query);
            res.send(result)
        })


        // update 2nd method
        app.patch("/Update_Existing_Coffee/:id", async (req, res) => {
            const id = req.params.id;
            const coffeeFormUpdate = req.body;
            const query = { _id: new ObjectId(id) }

            const coffeeDoc = {
                $set: {
                    name: coffeeFormUpdate.name,
                    chef: coffeeFormUpdate.chef,
                    supplier: coffeeFormUpdate.supplier,
                    details: coffeeFormUpdate.details,
                    taste: coffeeFormUpdate.taste,
                    category: coffeeFormUpdate.category,
                    price: coffeeFormUpdate.price,
                    photo: coffeeFormUpdate.photo
                }

            }
            const result = await coffeeInfo.updateOne(query, coffeeDoc)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})