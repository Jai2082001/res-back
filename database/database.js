const mongoDb = require('mongodb');
const mongoose = require('mongoose')
const mongoClient = mongoDb.MongoClient;


let db;

const mongoConnect = (callback) => {
    mongoose.connect('mongodb+srv://jaideeGrover:UBOwimNdbkRlrKKL@cluster0.wztcd.mongodb.net/newCapstoneDatbase?retryWrites=true&w=majority&appName=Cluster0'
        , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    db = mongoose.connection;

    db.on('error', () => {
        console.log('some error has occured')   
    }) 

    db.once('open', () => {
        console.log('connected to database')
    })

    callback()

}

const getDb = () => {
    if (db) {
        return db
    } else {
        console.log('Database Middle is not initialized');
    }
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;









