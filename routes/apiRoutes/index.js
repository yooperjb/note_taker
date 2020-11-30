const router = require( 'express' ).Router();
const noteRoutes = require('./noteRoutes');

// middleware for server api routes
router.use(noteRoutes);

module.exports = router;