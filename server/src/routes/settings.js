const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Get settings
router.get('/', authenticate, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = new Settings({
        lastUpdatedBy: req.user.id
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/', authenticate, checkPermission('settings', 'update'), async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    settings.lastUpdatedBy = req.user.id;
    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update specific setting section
router.patch('/:section', authenticate, checkPermission('settings', 'update'), async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Update only the specified section
    Object.assign(settings, req.body);
    settings.lastUpdatedBy = req.user.id;
    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
