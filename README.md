# face-detect-app-api
The Back End part of the repo "face-detect-app"

To work properly we need to create a folder named "configurations" outsie of the git repo folder and make a file inside it called "db.conf.js" with the following content:

const db_database = {
  client: 'pg',
  connection: {
    host : 'localhost',
    port: '5432',
    user : 'username',
    password : 'password',
    database : 'database'	
  }
};

module.exports = {
	db_database
}

