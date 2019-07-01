const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports.init = _init;

function _init() {
    passport.use('local', new LocalStrategy({
        passReqToCallback: true
    }, async (req, username, password, done) => {
        console.log('username here=', username);
        try {
            result = await dbConnection['user']
                .findOne({
                    attributes: ["username", "firstName", "lastName", "password", "id"],
                    where: {
                        username
                    }
                });
            if (!result || !result.dataValues) {
                return done(null, false, {
                    message: 'User does not exist'
                });
            } else if (password !== result.dataValues.password) {
                return done(null, false, {
                    message: 'wrong password'
                });
            } else {
                delete result.dataValues.password;
                req.logIn(result.dataValues, function (err) {
                    if (err) {
                        console.error('passport: authenticate - login failed. Error: ', err);
                        return done(null, false, err);
                    }
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
