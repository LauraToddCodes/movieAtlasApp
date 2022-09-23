const express = require("express")
const server = express()
const bodyParser = require("body-parser")

server.use(bodyParser.json())

const port = 4000

// setupdb
const db = require("./db")
const { response } = require("express")
const dbName = "data"
const dbCollection = "movies"

// success and failure callbacks
function successCallback(dbCollection) {
    dbCollection.find().toArray(function (err, result) {
        if (err) throw err
        console.log(result)
    })

    // let's do some CRUD
    // POST to insert
    server.post("/items", (request, response) => {
        const item = request.body
        dbCollection.insertOne(item, (error, result) => {
            if (error) throw error

            dbCollection.find().toArray((_error, _result) => {
                if (_error) throw _error
                response.json(_result)
            })
        })
    })

    // GET 1 record by id
    server.get("/items/:id", (request, response) => {
        const itemId = request.params.id

        dbCollection.findOne({ id: itemId }, (error, result) => {
            if (error) throw error

            response.json(result)
        })
    })

    // GET all records
    server.get("/items", (request, response) => {
        dbCollection.find().toArray((error, result) => {
            if (error) throw error

            response.json(result)
        })
    })

    // UPDATE a record
    server.put("/items/:id", (request, response) => {
        const itemId = request.params.id
        const item = request.body
        console.log(`Editing item: ${itemId} to be ${item}`)

        dbCollection.updateOne(
            { id: itemId },
            { $set: item },
            (error, results) => {
                if (error) throw error
                dbCollection.find().toArray(function (_error, _result) {
                    if (error) throw _error
                    response.json(_result)
                })
            }
        )
    })

    // DELETE a record
    server.delete("/items/:id", (request, response) => {
        const itemId = request.params.id
        console.log(`Deleting record with id ${itemId}`)

        dbCollection.deleteOne({ id: itemId }, (error, result) => {
            if (error) throw error

            dbCollection.find().toArray((_error, _result) => {
                if (_error) throw _error
                response.json(_result)
            })
        })
    })
}

function failureCallback(err) {
    throw err
}

// perform database initialisation
db.initialise(dbName, dbCollection, successCallback, failureCallback)

server.listen(port, () => console.log(`Listening on port ${port}`))
