const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const Sse = require('json-sse')

const app = express()



const port = process.env.PORT || 4000
app.listen(port, () => console.log(`server running on port: ${port}`))