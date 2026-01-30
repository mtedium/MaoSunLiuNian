const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
const Stat = require('../models/Stat');
const Scientist = require('../models/Scientist');
const authRoutes = require('./auth');
const authMiddleware = require('../middleware/auth');

// Auth Routes
router.use('/auth', authRoutes);

// GET /api/buildings - Get all buildings (with optional filters)
router.get('/buildings', async (req, res) => {
  try {
    const { type, dynasty } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (dynasty) filter.dynasty = dynasty;

    const buildings = await Building.find(filter).populate('scientist_id');
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/buildings/:id - Get single building details
router.get('/buildings/:id', async (req, res) => {
  try {
    const building = await Building.findById(req.params.id).populate('scientist_id');
    if (!building) return res.status(404).json({ error: 'Building not found' });
    res.json(building);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stats - Record user activity
router.post('/stats', async (req, res) => {
  try {
    const stat = new Stat(req.body);
    await stat.save();
    res.status(201).json(stat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/stats/dashboard - Aggregated stats for Admin Dashboard
router.get('/stats/dashboard', async (req, res) => {
  try {
    // Top 10 Popular Buildings (by visit count)
    const topBuildings = await Stat.aggregate([
      { $match: { action_type: 'view' } },
      { $group: { _id: '$building_id', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'buildings',
          localField: '_id',
          foreignField: '_id',
          as: 'building'
        }
      },
      { $unwind: '$building' },
      { $project: { name: '$building.name', count: 1 } }
    ]);

    // Total Visits
    const totalVisits = await Stat.countDocuments({ action_type: 'view' });

    res.json({
      topBuildings,
      totalVisits
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
