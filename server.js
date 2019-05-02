const express = require('express')
const app = express()
const cors = require('cors')
const port = 8000
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require("body-parser")

//preprocessing to parse the body of post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())

//start server
app.listen(port, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', port))
})

//database connection
let db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) { console.error(err.message); }
  console.log('Connected to the Redox database.');
});

// root endpoint
app.get('/', (req, res, next) => {
  res.json({ "message": "Ok" })
});

//fetch all sources and basic info
app.get('/source', (req, res, next) => {
  db.serialize(() => {
    db.all(`SELECT id, name from source`, (err, row) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "data": row
      })
    });
  });
});

//fetch single source by id and display information in greater details
app.get('/source/:id', (req, res, next) => {
  db.serialize(() => {
    let sql = `SELECT *  from source where id = ?`
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": row
      })
    });
  });
});

//fetch messages for a single source
app.get('/source/:id/message', (req, res, next) => {
  db.serialize(() => {
    let sql = `SELECT message from message where source_id = ?`
    let params = [req.params.id]
    db.all(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": row
      })
    });
  });
});

//fetch aggregate status of messages for a particular source
app.get('/message/:id/', (req, res, next) => {
  db.serialize(() => {
    let sql = `select  count(*) status_count, status from message where source_id = ? group by status`
    let params = [req.params.id]
    db.all(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": row
      })
    });
  });
});

//insert a new source with info 
app.post('/source', (req, res, next) => {
  let errors = []
  if (!req.body.id) {
    errors.push("No ID specified");
  }
  if (!req.body.name) {
    errors.push("No name specified");
  }
  if (!req.body.environment) {
    errors.push("No environment specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  let data = {
    id: req.body.id,
    name: req.body.name,
    environment: req.body.environment,
    encoding: req.body.encoding
  }
  let sql = `INSERT INTO source (id, name, environment, encoding) VALUES (?,?,?,?)`
  let params = [data.id, data.name, data.environment, data.encoding]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return;
    }
    res.json({
      "message": "success",
      "data": data,
      "id": this.lastID
    })
  });
})

//update existing source information
app.patch('/source/:id', (req, res, next) => {
  let data = {
    name: req.body.name,
    environment: req.body.environment,
    encoding: req.body.encoding
  }
  let params = [data.name, data.environment, data.encoding, req.params.id]
  let sql = `UPDATE source set name = ?, environment = ?, encoding = ? WHERE id = ?`;
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": res.message })
      return;
    }
    res.json({
      message: "success",
      data: data,
      changes: this.changes
    })
    console.log(`Row(s) updated: ${this.changes}`);

  });

});

//delete source by id
app.delete("/source/:id", (req, res, next) => {
  db.run(
      'DELETE FROM source WHERE id = ?',
      req.params.id,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
  });
})
