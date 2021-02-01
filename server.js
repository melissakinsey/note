// IMPORT EXPRESS AND CREATE AN EXPRESS APPLICATION (See https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)
const express = require("express");
const app = express();
// REQUIRE fs TO WRITE TO FILE
const fs = require("fs")

// ADD DATABASE
const db = require("./db/db.json");

// SET UP CROSS-ORIGIN RESOURCE SHARING
// https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
const cors = require("cors")

// SET UP SERVER TO LISTEN ON PORT 3001
let port = 3001;
app.use(cors())
app.use(express.json())

// SET UP API GET (READ) REQUEST
app.get("/api/notes", (request, respond) => {
    respond.json(db)
})

// SET UP API POST (CREATE) REQUEST
// * "db.push" posts to json.db file
// * "id = db.push" generates note id
// * "fs.writeFile" is an async method to write data to a file. 
//  * "./db/db.json" tells file system where to write to (https://www.geeksforgeeks.org/node-js-fs-writefile-method/).
// * JSON.stringify converts JS object into a JSON string.
// * The response function is placed as a callback (passed as a parameter) within the writeFile function.
// * Spread syntax (...) is used to update all request body properties except the id.
app.post("/api/notes", function (req, res) {
    let id = db.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(db), () => {
        res.json({...req.body,id:id})
    })
});

// SET UP API DELETE REQUEST
// db.splice RETAINS NOTE ID# WHEN NOTE OBJECT IS DELETED
app.delete("/api/notes/:id", function (req, res){
    let id = req.params.id;
    db.splice(id,1);
    fs.writeFile("./db/db.json", JSON.stringify(db), () => {
        res.status(200)
    })
})

// CONSOLE.LOG MESSAGE TO CONFIRM SERVER IS RUNNING
app.listen(port,()=>console.log(`Server running on port ${port} with update`))