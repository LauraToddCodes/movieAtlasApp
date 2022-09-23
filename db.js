// driver and connection
const MongoClient = require("mongodb").MongoClient

const dbConnectionUrl = process.env.API_KEY

function initialise(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDb connection] ERROR: ${err}`)
            failureCallback(err)
        } else {
            const dbObject = dbInstance.db(dbName)
            const dbCollection = dbObject.collection(dbCollectionName)
            console.log(`[MongoDb connection] SUCCESS`)
            successCallback(dbCollection)
        }
    })
}

module.exports = {
    initialise,
}
