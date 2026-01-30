const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['民居', '官府', '皇宫', '桥梁'], required: true },
  dynasty: { type: String, required: true }, // e.g., 'Tang', 'Song', 'Yuan', 'Ming', 'Qing'
  coordinates: {
    type: [Number], // [lng, lat]
    required: true,
    index: '2dsphere'
  },
  cover_img: String,
  model_3d_url: String,
  panorama_url: String,
  content_md: String, // Markdown content
  scientist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scientist' },
  references: [String]
});

module.exports = mongoose.model('Building', BuildingSchema);
