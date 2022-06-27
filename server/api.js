// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const jwt = require("jsonwebtoken");

module.exports = function(app, db){
    app.get('/api/test', function(req, res){
        res.json({
            name: 'Siweh'
        });
    });
};