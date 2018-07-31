const app = require('express')();
// const body = require('body-parser')();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');



// Variable Declaration
var PORT = process.env.port || 3000;



// Controller Includes
const battleObj = require('./src/controllers/BattleController');



// Middleware JWT Token
app.use(function (request, response, next){
	console.log("Get Token Middle Ware");
	next();
});

app.use(fileUpload());



// Routes
app.post('/uploadBattleFile', battleObj.uploadBattles);
app.get('/list', battleObj.getBattles);
app.get('/count', battleObj.getBattleCounts);
app.get('/search', battleObj.filterBattles);
app.get('/stats', battleObj.getStats);



// Server
app.listen(PORT, function (){
	console.log(`Server Started at PORT - ${PORT}`);	
});