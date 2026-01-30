const mongoose = require('mongoose');

const ScientistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  period: String,
  achievements: String,
  works: [String] // List of famous works
});

module.exports = mongoose.model('Scientist', ScientistSchema);
