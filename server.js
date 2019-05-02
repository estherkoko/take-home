const express = require('express')
const app = express()
const port = 8000
const sqlite3 = require('sqlite3').verbose()

//start server
app.listen(port, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', port))
})

//database connection
let db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {console.error(err.message);}
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
        "message": "success",
        "data": row
      })
    });
  });
});

//fetch single source by id and display information in greater details
app.get('/source/:id', (req, res, next) => {
  db.serialize(() => {
    let sql = `SELECT *  from source where id = ?`
    var params = [req.params.id]
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