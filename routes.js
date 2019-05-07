
const sqlite3 = require('sqlite3').verbose()
const express = require ('express')
const router = express.Router()

let db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the Redox database.');
});

router.get('/', (req, res, next) => {
    res.json({ "message": "Ok" })
});

router.get('/source', (req, res, next) => {
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

router.get('/source/:id', (req, res, next) => {
    db.serialize(() => {
        let sql = `SELECT *  from source where id = ?`
        let params = [req.params.id]
        db.get(sql, params, (err, row) => {
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

router.get('/source/:id/message', (req, res, next) => {
    db.serialize(() => {
        let sql = `SELECT message from message where source_id = ?`
        let params = [req.params.id]
        db.all(sql, params, (err, row) => {
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

router.get('/message/:id/', (req, res, next) => {
    db.serialize(() => {
        let sql = `select id, status,  count(*) status_count from message where source_id = ? group by status`
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

router.post('/source', (req, res, next) => {
    let errors = [];
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
    let data = { id: req.body.id, name: req.body.name, environment: req.body.environment, encoding: req.body.encoding };
    let sql = `INSERT INTO source (id, name, environment, encoding) VALUES (?,?,?,?)`
    let params = [data.id, data.name, data.environment, data.encoding]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        });
    });
})

router.patch('/source', (req, res, next) => {
    let data = {
        name: req.body.name,
        environment: req.body.environment,
        encoding: req.body.encoding
    }
    let params = [data.name, data.environment, data.encoding, req.body.id]
    let sql = `UPDATE source set name = ?, environment = ?, encoding = ? WHERE id = ?`;
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": res.message })
            return;
        }
        res.json({
            data: data,
            changes: this.changes,
        })
        console.log(`Row(s) updated: ${this.changes}`);
    });

});

router.delete("/source", (req, res, next) => {
    db.run('DELETE FROM source WHERE id = ?', req.body.id, function (err, result) {
        if (err) {
            res.status(400).json({ "error": res.message });
            return;
        }
        res.json({ "message": "deleted", changes: this.changes });
    });
})


module.exports=router;