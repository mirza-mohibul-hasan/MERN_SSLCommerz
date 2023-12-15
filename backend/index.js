const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const SSLCommerzPayment = require('sslcommerz-lts')
// Middleware
app.use(cors())
app.use(express.json())

// mongodb
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.clbkfrr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// SSLCommerz 
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false //true for live, false for sandbox

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        /*Working Zone Start */
        const db = client.db("mernSSLCommerz")
        const orderCollection = db.collection("order");
        const booksCollection = db.collection("books");

        app.get("/books", async (req, res) => {
            res.send(await booksCollection.findOne())
        })
        const tran_id = new ObjectId().toString();
        app.post("/order", async (req, res) => {
            const book = await booksCollection.findOne({ _id: new ObjectId(req.body.productId) })
            const order = req.body;
            const data = {
                total_amount: book.price,
                currency: order.currency,
                tran_id: tran_id, // use unique tran_id for each api call
                success_url: `http://localhost:5000/payment/success/${tran_id}`,
                fail_url: `http://localhost:5000/payment/failed/${tran_id}`,
                cancel_url: 'http://localhost:3030/cancel',
                ipn_url: 'http://localhost:3030/ipn',
                shipping_method: 'Courier',
                product_name: 'Computer.',
                product_category: 'Electronic',
                product_profile: 'general',
                cus_name: order.name,
                cus_email: 'customer@example.com',
                cus_add1: order.address,
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: order.postcode,
                cus_country: 'Bangladesh',
                cus_phone: order.phone,
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
            };
            console.log(data);
            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
            sslcz.init(data).then(apiResponse => {
                // Redirect the user to payment gateway
                let GatewayPageURL = apiResponse.GatewayPageURL
                // res.redirect(GatewayPageURL)
                res.send({ url: GatewayPageURL });


                const finalOrder = {
                    book,
                    paymentStatus: false,
                    transactionId: tran_id,
                    customerName: order.name,
                }
                const result = orderCollection.insertOne(finalOrder)

                console.log('Redirecting to: ', GatewayPageURL)
            });
            app.post("/payment/success/:tranId", async (req, res) => {
                // console.log(req.params.tranId);
                const result = await orderCollection.updateOne({transactionId: req.params.tranId}, {$set:{
                    paymentStatus: true
                }})
                if(result.modifiedCount > 0){
                    res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`)
                }
            })
            app.post("/payment/failed/:tranId", async (req, res) => {
                // console.log(req.params.tranId);
                const result = await orderCollection.deleteOne({transactionId: req.params.tranId})
                if(result.deletedCount > 0){
                    res.redirect(`http://localhost:5173/payment/failed/${req.params.tranId}`)
                }
            })
        })

        /*Working Zone End */
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// Default
app.get('/', (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})