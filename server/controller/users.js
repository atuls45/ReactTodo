const express = require('express'),
      low = require('lowdb'),
      configDb = require('../config/db'),
      router = express.Router(),
      db = low(configDb.adapter);

db.defaults({
    posts: []
    })
    .write();


router.get('/', function(req, res, next) {
    res.send([{"firstName":"ad","lastName":"ad","username":"ad","password":"ad","id":1}]);
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    db.get('posts').push(req.body).last().assign({
        id: Math.random().toString().slice(2)
    }).write();
    res.json({
        posts: db.get('posts').value()
    });
});

router.post('/authenticate', function(req, res, next) {
    console.log(req.body);
    // db.get('posts').push(req.body).last().assign({
    //     id: Math.random().toString().slice(2)
    // }).write();
    res.json({
        id: 1,
        username: 'ad',
    });
});

router.put('/', function(req, res, next) {
    console.log(req.body);
    db.get('posts').find({
        id: req.body.id
    }).assign({
        title: req.body.title,
        content: req.body.content
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
