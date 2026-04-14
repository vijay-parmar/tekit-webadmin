/**
 * API Router Index
 * Central registration of all route modules.
 */
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const blogRoutes = require('./blog.routes');
const categoryRoutes = require('./category.routes');
const jobRoutes = require('./job.routes');
const userRoutes = require('./user.routes');

// Mount route modules
router.use('/admin', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/jobs', jobRoutes);
router.use('/users', userRoutes);

module.exports = router;
