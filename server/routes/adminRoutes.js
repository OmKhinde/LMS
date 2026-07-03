import express from 'express'
import { changeUserRole, listEducators, listStudents, getAdminStats } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router()

// Admin: change user role
router.put('/users/:userId/role', requireAuth, requireAdmin, changeUserRole);

// Admin: educator application review endpoints
import { adminListApplications, adminGetApplication, adminApproveApplication, adminRejectApplication } from '../controllers/applicationController.js'

router.get('/applications', requireAuth, requireAdmin, adminListApplications)
router.get('/applications/:id', requireAuth, requireAdmin, adminGetApplication)
router.put('/applications/:id/approve', requireAuth, requireAdmin, adminApproveApplication)
router.put('/applications/:id/reject', requireAuth, requireAdmin, adminRejectApplication)

// Admin lists
router.get('/educators', requireAuth, requireAdmin, listEducators);
router.get('/students', requireAuth, requireAdmin, listStudents);
router.get('/stats', requireAuth, requireAdmin, getAdminStats);

export default router;
