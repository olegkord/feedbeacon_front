'use strict';

const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.Server(app);

app.use(express.static(__dirname+'/public'));
app.get('/', (req,res) => {
  res.sendfile(__dirname + '/index.html');
})

app.listen(process.env.PORT || 3000);
