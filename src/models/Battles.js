const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const Battles = new Schema({
  bId: ObjectId,
  name: String,
  year: String,
  battle_number: String,
  attacker_king: String,
  defender_king: String,
  attacker_1: String,
  attacker_2: String,
  attacker_3: String,
  attacker_4: String,
  defender_1: String,
  defender_2: String,
  defender_3: String,
  defender_4: String,
  attacker_outcome: String,
  battle_type: String,
  major_death: String,
  major_capture: String,
  attacker_size: String,
  defender_size: String,
  attacker_commander: String,
  defender_commander: String,
  summer: String,
  location: String,
  region: String
});


module.exports.Battles = Battles;