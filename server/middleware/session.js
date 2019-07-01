const session = require('express-session');

module.exports = {
    checkSession,
    addSession,
    removeSession,
    loginSession,
    logout,
    afterLogOut,
    login,
    failedLogin,
    checkLogin
}

let sessionArr = []

function checkSession(req, res, next) {

    if (sessionArr.indexOf(req.sessionID) >= 0) {
        next();
    } else {
        let text = {
            msg: "session expired. please login again."
        }
        res.json(text);
    }
}

function addSession(sessionsValue, next) {
    sessionArr.push(sessionsValue);
    next();
}

function removeSession(req, res) {
    var temp = req.sessionID;
    var index = sessionArr.indexOf(temp);
    if (index >= 0) {
        sessionArr.splice(index, 1);
    }
}

function loginSession(req, res, next) {
    let temp = sessionArr.indexOf(req.sessionID)
    if (sessionArr.length === 0) {
        if (temp >= 0) {
            let text = {
                msg: "already logged in"
            }
            return res.json(text);
        } else {
            sessionArr.push(req.sessionID);
            return next();
        }
    }
    let text = {
        msg: "already login "
    }
    return res.json(text);
}

function checkLogin(req, res, next) {
    let temp = sessionArr.indexOf(req.sessionID)
    if (sessionArr.length === 0) {
        if (temp >= 0) {
            let text = {
                msg: "already logged in"
            }
            return res.json(text);
        }
        let text = {
            msg: "Login required"
        }
        return res.json(text);
    }
    let text = {
        msg: "already login "
    }
    return res.json(text);
}

function logout(req, res) {
    removeSession(req, res);
    clearSessionCookies(res);
    req.session.destroy();
    req.logout();
    console.log('Session destroyed and user logged out', req.user);
    let text = {
        msg: "successfully logout "
    }
    res.json(text);
}

function afterLogOut(req, res) {
    req.logout();
    let text = {
        msg: "successfully logout "
    }
    res.json(text);
}

function login(req, res) {
    let text = {
        msg: "successfully login"
    };
    res.json(text);
}

function failedLogin(req, res) {
    res.json({
        err: "error in login"
    })
}

function clearSessionCookies(response) {
    response.cookie('ai.session', '');
    response.clearCookie('_csrf');
}
