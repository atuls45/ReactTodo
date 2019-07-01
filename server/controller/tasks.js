const express = require('express'),
      low = require('lowdb'),
      configDb = require('../config/db'),
      router = express.Router(),
      db = low(configDb.adapter);

// db.defaults({
//     posts: []
//     })
//     .write();


router.get('/', getAll);

async function getAll(req, res, next) {
    let data =  await dbConnection['task'].findAll({
        raw: true
      });
    res.json(data);
}

router.post('/', async (req, res, next) => {
    console.log(req.body);
    await dbConnection['task'].create(req.body)
    getAll(req, res, next);
});

router.put('/', function(req, res, next) {
    console.log(req.body);
    db.get('posts').find({
        id: req.body.id
    }).assign({
        title: req.body.title,
        content: req.body.content,
        isDone: req.body.isDone
    }).write();
    res.json({
        posts: db.get('posts').value()
    });
});

router.delete('/', function(req, res, next) {
    db.get('posts').remove({
        id: req.body.id
    }).write();
    res.json({
        posts: db.get('posts').value()
    });
});





module.exports = router;
