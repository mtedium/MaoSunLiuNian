const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  building_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  user_id: String, // Anonymous ID or User ID
  stay_duration: Number, // in seconds
  action_type: { type: String, enum: ['view', 'click_3d', 'click_panorama', 'read_article'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stat', StatSchema);
