import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mysql from "mysql2"


const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()

const port = process.env.PORT || 3030
const CREDENTIAL = JSON.parse(process.env.CREDENTIAL)
const db = mysql.createConnection(CREDENTIAL)
const mysqlTable = 'mock_data'

// check if connected to database
db.connect( (err) => {
    if (err) {
        console.log(err)
        // if the parameter is true stop
        process.exit(1)
    }
    console.log('MySQL Connected')
})

//! GET:ROOT
app.get('/', (req,res) => {
    res.send('SQL: I am root')
})

//! GET: ALL
app.get('/gettable', (req,res) => {
    // query
    // mock_data table has to be lower case
    const query = `SELECT * FROM ${mysqlTable} ORDER BY id DESC LIMIT 10`

    // send query
    db.query(query, (err, result) => {
        if (err) { process.exit(1) }
        
        console.table(result)
        res.send('Query Sent')
    })

    // result
})


//! GET by ID
// http://localhost:3030/class/id# into postman
app.get('/class/:id', (req,res) => {
    // parameter & query
    const parameter = Number(req.params.id) // for security reasons Number() is converting everything into a number
    const query = `SELECT * FROM ${mysqlTable} WHERE id=?}` // the ? question mark only allows the parameter above to be passed into "id=?"

    // send query
    // the parameter being in an array is so its returned organized
    db.query(query, [parameter], (err,result) => {
        if (err) { process.exit(1) }

        console.table(result)
        res.send('Query Sent by ID')
    })
    // result
})

//! POST 
app.post('/post', (req,res) => {
    // parameter & query
    const parameter = req.body // this grabs the body from the request 
    const query = `INSERT INTO ${mysqlTable} SET ?`

    // send query
    db.query(query, parameter, (err, result) => {
        if (err) { 
            console.error(err) 
            process.exit(1); 
        }

        // console.table(result)
        console.table(parameter)
        res.send('Post Added')
    })
})

//! COMPLETED:  ADD DELETE BY ID QUERY
app.delete('/delete/:id', (req,res) => {
    // parameter & query
    const parameter = Number(req.params.id)
    const query = `DELETE FROM ${mysqlTable} WHERE id=?`

    // send query
    db.query(query, [parameter], (err, result) => {
        try{
            console.table(parameter)
            res.send('Data Deleted')
        } catch(err) {
            console.error(err)
            process.exit(1)
        }

    })
})

app.listen(port, () => {
    console.log(`Server is listening in port...${port}`)
})