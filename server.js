const express = require('express')
const app = express()
const cors = require('cors')
const port = 8000
const bodyParser = require("body-parser")
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', routes)

app.listen(port, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', port));
});

