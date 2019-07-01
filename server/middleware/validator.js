// thrird party modules
const _ = require('lodash');
const Joi = require('joi');

module.exports = (schema) => (req, res, next) => _validator(schema, req, res, next);


async function _validator(schema, req, res, next) {
    const data = _extractor(req, schema);

    try {
        _fixCorruptedFormDataObjects(req.url, data, schema);
        const validatedData = await Joi.validate(data, schema, { stripUnknown: {objects: true} });
        _assigner(validatedData, req);
        next();
    } catch (error) {
        let message;
        if (error.details && error.details.length > 0) {
            message = error.details[0].message && error.details[0].message.length < 60 ?
                error.details[0].message :
                error.details[0].path[0] + ' is invalid';
        }
        _errorCheck({ code: 'INVALID_SCHEMA', status: 400, message: message, data: error }, req, res, next);
    }
}

function _fixCorruptedFormDataObjects(url, data, schema) {
    if (schema.body && data.body) {
        for(const key in schema.body) {
            if (schema.body[key] && schema.body[key]._type === 'object') {
                if (data.body[key] === 'null') {
                    data.body[key] = null;
                }
            }
        }
    }
}

function _extractor(req, schema) {
    const data = {};
    for (let property of ['params', 'body', 'query']) {
        //checking in req.body first if there is no body then
        //check in schema also if there is body in schema then add empty body object
        if (!_.isEmpty(req[property])) {
            data[property] = req[property];
        } else if (schema[property]) {
            data[property] = {};
        }
    }
    return data;
}

/**
 * To validate all schemas by acting as an express middleware
 *
 * @param {Object} schema Schema to validate against
 * @returns {ExpressMiddleware}
 */

function _assigner({ body, query, params }, req) {
    if (body) {
        req.body = body;
    }
    if (query) {
        req.query = query;
    }
    if (params) {
        req.params = params;
    }
}

/**
 * Checks the error provided.
 * @param {Object} error An error object to be checked.
 * @param {Object} req An expressjs request object.
 * @param {Object} res An expressjs response object.
 * @param {Function} next An express middleware for error handling.
 */
async function _errorCheck(error, req, res, next) {
    console.error('\n\n\n\nCUSTOM error handler\n\n', error, error.stack);

    const properties = {
        code: error.code,
        stack: error.stack ? error.stack : error
    };
    if (req && req.user) {
        properties.userId = req.user.ID;
        properties.username = req.user.name;
        properties.client = req.user.client;
    }
    if (req && req.method) {
        properties.url = `${req.method.toUpperCase()} ${req.url}`;
        properties.host = req.host;
    }

    // return generic regardless of the error for now
    next(properties);
}
