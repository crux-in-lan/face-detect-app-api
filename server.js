const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const knex = require('knex');

const app = express();

app.use(bodyParser.json());

app.post('/register',(req,res) => {

});

app.post('/signin',(req,res) => {

});

app.put('/detect',(req,res)=>{

})

app.listen(3001);