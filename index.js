const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qcwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Parcel_Task');
        const usersCollection = database.collection('users');
        const parcelsCollection = database.collection('parcels');


        // get parcels for single user
        app.get('/parcels', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const cursor = parcelsCollection.find(query);
            const parcels = await cursor.toArray();
            console.log('user parcels found');
            res.json(parcels);
        })


        // add parcel detail
        app.post('/parcels', async (req, res) => {
            const newParcel = req.body;
            const result = await parcelsCollection.insertOne(newParcel);
            console.log('parcel added');
            res.json(result);
        })


        // save user info
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log('users data saved');
            res.json(result);
        })

        // update user info
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log('update user data');
            res.json(result);
        })

        console.log('database connection ok');
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('It is a parcel task!')
})

app.listen(port, () => {
    console.log(`Port :${port}`)
})