const csv = require('csvtojson')
const battleSchema = require('../models/Battles');
const mongoose = require('mongoose');
var MongoUtil = require('../db/MongoDB.js');

module.exports.uploadBattles = function (request, response) { 

	var mongoObj = new MongoUtil();
    const filePath = request.files.battle;
    var newFilePath = `${__dirname}/../../uploads/${Math.floor(new Date() / 1000)}.csv`;

    filePath.mv(newFilePath, function(err) {
	    
	    if (err) return response.status(500).send(err);

	    csv().fromFile(newFilePath).then((battleObj) => {
	    	mongoObj.MongoConnect(function(dbHook){
				const collection = dbHook.collection('battles');
		  		collection.insertMany(battleObj, function(err, result) {
		    		response.send("File Uploaded Successfully");
	    		});
			});
		});
  	});
};





module.exports.getBattles = function (request, response) { 

	var mongoObj = new MongoUtil();

	mongoObj.MongoConnect(function(dbHook){
		const collection = dbHook.collection('battles');
  		collection.find({}).toArray(function(err, battles) {
		    response.send(battles);
		});
	});
};





module.exports.getBattleCounts = function (request, response) { 

	var mongoObj = new MongoUtil();

	mongoObj.MongoConnect(function(dbHook){
		const collection = dbHook.collection('battles');
  		collection.count({}, function(err, count) {
            if (err) console.log(err);

            var countObj = {
            	"battles_fought": count
            };
            response.send(countObj);
        });
	});
};





module.exports.filterBattles = function (request, response) { 

	var mongoObj = new MongoUtil();
	var searchFilter = {};

	if(request.query.king){
		searchFilter.$or = [ { attacker_king: request.query.king  }, { defender_king: request.query.king } ];
	}

	if(request.query.location){
		searchFilter = location = request.query.location;
	}

	if(request.query.type){
		searchFilter.battle_type = request.query.type;
	}

	mongoObj.MongoConnect(function(dbHook){
		const collection = dbHook.collection('battles');
  		collection.find(searchFilter).toArray(function(err, battles) {
		    response.send(battles);
		});
	});
};






module.exports.getStats = function (request, response) { 

	var mongoObj = new MongoUtil();

	mongoObj.MongoConnect(function(dbHook){
		const collection = dbHook.collection('battles');

  		collection.aggregate(
  			[
  				{
  					$group : {
  						_id : "$attacker_outcome", 
  						count : {
  							$sum : 1
  						}
  					}
  				}
  			]
  		).toArray(function(err, battles) {

  			var resultSet = {};
		    resultSet.attacker_outcome = battles;

		    collection.aggregate(
	  			[
	  				{
	  					$group: {
	  						_id: null, 
	  						battle_type: {
	  							$addToSet: "$battle_type"
	  						}
	  					}
	  				},
	  				{
	  					$project: {
	  						_id: 0, 
	  						battle_type: 1
	  					}
	  				}
	  			]
	  		).toArray(function(err, battles) {

	  			console.log(battles);
			    resultSet.battle_type = battles;

			    collection.aggregate(
		  			[
		  				{
		  					$group: {
		  						_id: null,
		           				avgQuantity: { $avg: "$defender_size" },
		           				minQuantity: { $min: "$defender_size" },
		           				maxQuantity: { $max: "$defender_size" }
		  					}
		  				}
		  			]
		  		).toArray(function(err, battles) {
		  			console.log(battles);
				    resultSet.defender_size = battles;

				    var mostActive = {};

					collection.aggregate(
			  			[
			  				{
			  					$group : {
			  						_id : "$attacker_king", 
			  						total_win : {
			  							$sum : 1
			  						}
			  					}
			  				},
			  				{$sort:{total_win:-1}},
			  				{$limit:1}
			  			]
			  		).toArray(function(err, battles) {

			  			mostActive.attacker_king = battles;

					    collection.aggregate(
				  			[
				  				{
				  					$group : {
				  						_id : "$defender_king", 
				  						total_win : {
				  							$sum : 1
				  						}
				  					}
				  				},
				  				{$sort:{total_win:-1}},
				  				{$limit:1}
				  			]
				  		).toArray(function(err, battles) {
						    
						    mostActive.defender_king = battles;

						    collection.aggregate(
					  			[
					  				{
					  					$group : {
					  						_id : "$region", 
					  						total_win : {
					  							$sum : 1
					  						}
					  					}
					  				},
					  				{$sort:{total_win:-1}},
					  				{$limit:1}
					  			]
					  		).toArray(function(err, battles) {

					  			mostActive.region = battles;

							    collection.aggregate(
						  			[
						  				{
						  					$group : {
						  						_id : "$name", 
						  						total_win : {
						  							$sum : 1
						  						}
						  					}
						  				},
						  				{$sort:{total_win:-1}},
						  				{$limit:1}
						  			]
						  		).toArray(function(err, battles) {

						  			mostActive.name = battles;
								    resultSet.most_active = mostActive;
								    response.send(resultSet);
								});
							});
						});
					});
				});
			});
		});

		


		




		


		


		
		
	});
};
























