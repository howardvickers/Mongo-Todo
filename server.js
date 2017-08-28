var express = require('express')

var app = express()

var bodyParser = require('body-parser')

var mongo = require('mongodb')

var MongoClient = mongo.MongoClient
ObjectID = mongo.ObjectID


MongoClient.connect('mongodb://localhost:27017/todo', function(err, db){
    app.use(express.static('./public'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
    extended: true
    }))

    app.get('/', function(req, res){
        res.send('./index.html', {root: './public'})
    })

    app.post('/todo', function(req, res){

        db.collection('todos').insertOne(JSON.parse(req.body.newtodo), function(docs, err){
            if (err) {console.log(err)}
            res.status(200).send(docs)
        })
    })
    
    app.get('/todo/all', function(req, res){
        db.collection('todos').find({}).toArray(function(err, docs){
            console.log(docs)
            console.log(typeof docs)
            res.send(docs)
        })
    })

    app.post('/todo/done', function(req, res){
        console.log(req.body)
        db.collection('todos').updateOne({
            '_id': ObjectID(req.body['_id'])
        },
            {$set: {
                todoDone: true
            }}  ,
            function(err){
                console.log('err on line 42: ', err)
                res.send({success:'success with changing to completed!'})
            })
    })
    
    app.post('/todo/del', function(req, res){
        console.log(req.body)
        db.collection('todos').findOneAndDelete({
            '_id': ObjectID(req.body['_id'])
        },
            function(err){
                console.log('err on line 42: ', err)
                res.send({success:'success with deletion!'})
            })
    })




    // app.post('/todo/done', function(req, res){

    // })

    // app.delete('/todo', function(req, res){

    // })


    app.use(function(req, res, next){
        res.status(404).send("Not Found")
    })

    app.use(function(err, req, res, next){
                    if (err) {console.log(err)}

        res.status(500).send(err)
    })

app.listen(8080)
})











