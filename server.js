const {db_webapps} = require('../configurations/db.conf.js');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const db = require('knex')(db_webapps);
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/register',(req,res) => {
	const {email, username, password} = req.body;
	const joined = moment().format('YYYY-MM-DD HH:mm:ss');
	db.transaction(trx => {
		trx.insert({email,username,joined}).into('tmp.users').returning('email')
		.then(result => {
			// console.log("second obj",{email:result[0],password:bcrypt.hashSync(password)});
			trx.insert({email:result[0],hash:bcrypt.hashSync(password)})
			.into('tmp.login')
			.then(res1 => {
				trx.commit();
				res.json({data:`Successful registered username ${username}`});
			})
			.catch(err => {
				trx.rollback();
				res.status(400).json({err: {log: 'DB error 1', info: err}});
			})	
		})
		.catch(err => {
			trx.rollback();
			res.status(400).json({err: {log: 'DB error 2', info: err}});
		})	
	})

});

app.post('/signin',(req,res) => {
	const {email, password} = req.body;
	// console.log(req.body);
	db.select('hash').from('tmp.login').where('email','=',email)
	.then(result => {
		if(result.length) {
			if(bcrypt.compareSync(password,result[0].hash)) {
				db.select('*').from('tmp.users').where('email','=',email)
				.then(data => {
					res.json({data: data[0]});
				})
				.catch(err => {
					res.status(400).json({err: "DB error 2"});
				})				
			} else {
				res.status(400).json({err: "Wrong password"});
			}
		} else {
			res.status(400).json({err: "User not found"});
		}
	})
	.catch(err => {
		res.status(400).json({err: "DB error 1"});
	});
});

app.put('/detect/:userId',(req,res)=>{
	
	const {userId} = req.params;

	db('tmp.users').increment('detections').where('id','=',userId).returning('detections')
	.then(result =>  res.json({data: result[0]}))
	.catch(err => res.status(400).json({err: err}));
})

app.listen(3001);