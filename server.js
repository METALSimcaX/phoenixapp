'use strict';
const
express = require('express'),
app = express();

app.set('port', (5000));
//app.use(express.static('app'));
//app.use(express.static('dist'));
//app.use(express.static('node_modules'));
app.use(express.static(__dirname + '/../../e2e'));
app.use(express.static(__dirname + '/../../electron'));
app.use(express.static(__dirname + '/../../node_modules'));
app.use(express.static(__dirname + '/../../src'));
app.use(express.static(__dirname + '/../../target'));

app.get("*", (req,res)=>{
    res.sendFile(__dirname, "/../../src/index.html");
});

app.listen(app.get('port'), function() {
    console.log("Node server is running at localhost:" + app.get('port'));
});