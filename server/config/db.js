const FileSync = require('lowdb/adapters/FileSync');

module.exports = {
    adapter: new FileSync('./d/db.json')
};