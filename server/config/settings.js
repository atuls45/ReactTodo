function _execute(app, applicationRoot) {

    /*Application root*/
    app.set('root', applicationRoot);

    app.set('ENV_CONTEXT', process.env.ENV_CONTEXT);

    app.set('inactivityTimeout', process.env.INACTIVITY_TIMEOUT || 3600); // 1 hour

    // Session secret
    app.set('SESSION_SECRET', process.env.SESSION_SECRET || 'wbygfnZQChDVAZZPVPGxxxTgWcrkadPS7BKAOK)#@0pihsM');

    global.app = app;
}

module.exports = {
    execute: _execute
};
