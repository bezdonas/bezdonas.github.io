/*
 *	Server
 */
var express = require('express'),
    app = express();

app.configure(function () {
    app.use(express.static(__dirname + '/'));
});

var server = app.listen(8282);