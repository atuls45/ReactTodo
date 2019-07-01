const express = require('express'),
    router = express.Router();

router.get('/', getAll);

async function getAll(req, res, next) {
    let data = await dbConnection['task'].findAll({
        where: {
            userId: req.user.id
        },
        raw: true
    });
    res.json({ posts: data });
}

router.post('/', async (req, res, next) => {
    console.log(req.body);
    await dbConnection['task'].create(Object.assign(req.body, {
        userId: req.user.id
    }));
    getAll(req, res, next);
});

router.put('/', async function (req, res, next) {
    await dbConnection['task'].update(req.body, {
        where: {
            id: req.body.id,
            userId: req.user.id
        }
    });
    getAll(req, res, next);
});

router.delete('/', async function (req, res, next) {
    await dbConnection['task'].destroy({
        where: {
            id: req.body.id,
            userId: req.user.id
        }
    });
    getAll(req, res, next);
});

module.exports = router;
