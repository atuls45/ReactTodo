const express = require('express'),
      low = require('lowdb'),
      configDb = require('../config/db'),
      router = express.Router(),
      db = low(configDb.adapter);

router.post('/', async function(req, res, next) {
    console.log(req.body);
    let data = await dbConnection['user'].findAll({
        attributes: ['id'],
        where: {
            username: req.body.username
        },
        raw: true
      });
    console.log('data here==', data);
    if (data && data.length > 0) {
        return res.json({
            isError: true,
            message: 'Username already exist!'
         });
    }
    await dbConnection['user'].create(req.body);
    res.json('User registered successfully')
});




module.exports = router;