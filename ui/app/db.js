const MongoClient = require('mongodb').MongoClient;

const dbConnectionUrl = 'mongodb+srv://derekAdmin:1234@cluster0-ldreq.mongodb.net/test?retryWrites=true&w=majority';

function initialize(
    GeneralDB,
    Users,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err) // this should be caught by the calling function
        } else {
            const dbObject = dbInstance(GeneralDB);
            const dbCollection = dbObject.collection(Users);
            console.log('[MongoDB connection] SUCCESS');

            successCallback(dbCollection);
        }
    });
}

module.exports = {
    initialize
};

db.initialize(GeneralDB, Users, (dbCollection) => {
    dbCollection.find().toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        
    });
}, (err) => {
    throw (err);
});