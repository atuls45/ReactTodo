const passport = require('passport');
const bcrypt = require("bcrypt-nodejs");
const LocalStrategy = require('passport-local').Strategy;

const utils = require('../config/utilsFunction')

module.exports.init = _init;

function _init() {
    passport.use('local', new LocalStrategy({
        passReqToCallback: true
    }, async (req, email, password, done) => {
        console.log('email=', email);
        let username = utils.findUserName(email);
        console.log('user1==', username);
        let client = utils.findClientName(email);
        const {
            initialise
        } = require('../config/sequelize');
        let tenantDetails;
        let whereCondition = {};
        let dbConnection = {};
        if (!client) {
            let {
                user
            } = await initialise("individual", true);
            dbConnection = user;
            whereCondition = {
                username
            }
        } else {
            let {
                organisationuser
            } = await initialise('tenant', true, true);
            dbConnection = organisationuser;
            whereCondition = {
                domainname: client
            }
        }
        try {
            tenantDetails = await dbConnection
                .find({
                    where: whereCondition
                });
            if (client && (!tenantDetails || !tenantDetails.isActive)) {
                return done(null, false, {
                    message: 'Your organisation is not active yet! Please contact your administration.'
                });
            } else if (!client && !tenantDetails) {
                return done(null, false, {
                    message: 'Invalid username!'
                });
            }
        } catch (err) {
            console.error('error connecting tenant', err);
            return done(null, false, {
                message: 'Something went wrong! Please contact your administration.'
            });
        }
        let result;
        let dbconfig = {
            database: 'individual'
        };
        try {
            if (client) {
                dbconfig = JSON.parse(tenantDetails.dbconfig);
            }
        } catch (error) {
            console.log('error parsing config', error);
            return done(null, false, {
                message: 'Invalid organisation details! Please contact your administration.'
            });
        }
        try {
            const {
                user
            } = await initialise(dbconfig.database, true);
            result = await user
                .find({
                    attributes: ["username", "firstname", "lastname", "email", "password", "contactno", "id"],
                    where: {
                        username
                    }
                });
            const isPassword = bcrypt.compareSync(password, result.dataValues.password);
            if (!result || !result.dataValues) {
                return done(null, false, {
                    message: 'User does not exist'
                });
            } else if (!isPassword) {
                return done(null, false, {
                    message: 'bad password'
                });
            } else {
                delete result.dataValues.password;
                req.logIn(result.dataValues, function (err) {
                    if (err) {
                        console.error('passport: authenticate - login failed. Error: ', err);
                        return done(null, false, err);
                    }
                });
                result.dataValues = Object.assign(result.dataValues, {
                    client: dbconfig.database
                });
                return done(null, result.dataValues);
            }
        } catch (e) {
            console.log('e', e);
            throw (e);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}
