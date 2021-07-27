const express = require('express')
//const bodyParser = require('body-parser');
const cors = require('cors')
//const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

// const uri = `mongodb://${process.env.DB_USER}:${procenss.env.DB_PASS}@cluster0-shard-00-00.nsfyh.mongodb.net:27017,cluster0-shard-00-01.nsfyh.mongodb.net:27017,cluster0-shard-00-02.nsfyh.mongodb.net:27017/${process.DB_NAME}?ssl=true&replicaSet=atlas-o69sfx-shard-0&authSource=admin&retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eigw8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()

app.use(express.json());
app.use(cors());
//app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000


app.get('/', (req, res) => {
  res.send('Hello World!')
})
// if (process.env.NODE_ENV === 'production') {
//   // Exprees will serve up production assets
//   app.use(express.static('client/build'));

//   // Express serve up index.html file if it doesn't recognize route
//   // const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
//

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(" creative").collection(`AgencyServices`);
  const OrderCollection = client.db(" creative").collection("AllOrder");
  const reviewCollection = client.db(" creative").collection("Review");
  const adminCollection = client.db("creative").collection("Admin");


  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const Description = req.body.Description;
    const email = req.body.email;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    productsCollection.insertOne({ name, email, image, Description })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })

    app.get('/service', (req, res) => {
      productsCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
    })

    app.get('/service/item/:_id', (req, res) => {
      productsCollection.find({ _id: ObjectId(req.params._id) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        })
    })


    app.post('/addOrder', (req, res) => {
      const file = req.files.file;
      const name = req.body.name;
      const serviceName = req.body.serviceName;
      const email = req.body.email;
      const description = req.body.description;
      const newImg = file.data;
      const status = req.body.status;
      const encImg = newImg.toString('base64');

      var image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encImg, 'base64')
      };

      OrderCollection.insertOne({ name, serviceName, email, description, status, image })
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/Orders', (req, res) => {
      OrderCollection.find({ email: req.query.email })
          .toArray((err, documents) => {
              res.send(documents);
          })
    });

    app.get('/allServiceList', (req, res) => {
      OrderCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
    });

    // Update Status
    app.patch('/update/:id', (req, res) => {
      ordersCollection.updateOne({_id: ObjectId(req.params.id)},
      {
          $set: {status: req.body.status}
      })
      .then(result => {
          res.send(result.modifiedCount > 0);
      })
    })



    app.post('/addReview', (req, res) => {
        const reviewInfo = req.body;
        reviewCollection.insertOne(reviewInfo)
          .then(result => {
              res.send(result.insertedCount > 0)
          })
    })

    app.get('/review', (req, res) => {
        reviewCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
          })
    });

    app.post('/addAdmin', (req, res) => {
        const adminInfo = req.body;
          adminCollection.insertOne(adminInfo)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/admin', (req, res) => {
        adminCollection.find({ email: req.query.email })
          .toArray((err, documents) => {
              res.send(documents);
          })
    });

});

app.listen(process.env.PORT || port)