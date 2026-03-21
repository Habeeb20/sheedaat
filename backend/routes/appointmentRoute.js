import express from 'express';
import * as appointmentCtrl from '../controllers/appointmentController.js';
import { protect } from '../middleware/verifyToken.js';


const router = express.Router();

// Public or protected (depending on your needs)
router.post('/book', appointmentCtrl.bookAppointment);

// Protected routes (uncomment protect middleware)
// router.get('/my-appointments', protect, appointmentCtrl.getMyAppointments);
router.get('/all', protect,  appointmentCtrl.getAllAppointments);
router.put('/:id/cancel', protect, appointmentCtrl.cancelAppointment);
router.put('/:id/status', protect, appointmentCtrl.updateAppointmentStatus)

export default router;