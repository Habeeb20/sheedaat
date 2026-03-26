import Appointment from '../models/appointment.js';
import Service from '../models/Services.js'; // to verify service exists
import cache from '../cache.js';

// Cache keys (optional - invalidate on create/cancel)
const APPOINTMENTS_LIST_KEY = 'appointments:all'; // if you show admin list

export const bookAppointment = async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      date,         // e.g. "2025-04-15"
      time,         // e.g. "14:30"
      fullName,
      phoneNumber,
      email,
      note,
    } = req.body;

  

    const service = await Service.findById(serviceId);
    // if (!service) {
    //   return res.status(404).json({ message: 'Service not found' });
    // }

    // Use provided serviceName or fallback to real one
    const finalServiceName = serviceName || service.name;

    // 2. Parse date + time → full DateTime for conflict check
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Combine date + time (assuming local timezone or UTC — adjust offset if needed)
    const [hours, minutes] = time.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // 3. Check for conflict (same service, same datetime)
    const conflict = await Appointment.findOne({
      service: serviceId,
      date: {
        $gte: appointmentDate,
        $lt: new Date(appointmentDate.getTime() + 60 * 60 * 1000), // assuming 1-hour slots; adjust
      },
      time,
    });

    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    // 4. Create appointment
    const appointment = new Appointment({
      service: serviceId,
      serviceName: finalServiceName,
      date: appointmentDate,   // now full datetime
      time,
      fullName,
      phoneNumber,
      email,
      note,
   
    });

    await appointment.save();

    // Optional: invalidate cache if you cache appointment lists
    cache.del(APPOINTMENTS_LIST_KEY);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Optional: Get user's own appointments (if authenticated)
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const appointments = await Appointment.find({ user: userId })
      .populate('service', 'name price')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// Optional: Admin - get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    // Add admin auth check in middleware

    let appointments = cache.get(APPOINTMENTS_LIST_KEY);

    if (!appointments) {
      appointments = await Appointment.find()
        .populate('service', 'name')
        .sort({ date: -1 })
        .lean();

      cache.set(APPOINTMENTS_LIST_KEY, appointments, 300); // 5 min
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all appointments' });
  }
};

// Optional: Cancel appointment (user or admin)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Optional: check ownership or admin
    // if (appointment.user.toString() !== req.user.id && !isAdmin) { ... }

    appointment.status = 'cancelled';
    await appointment.save();

    cache.del(APPOINTMENTS_LIST_KEY);

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
};




export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate allowed statuses
    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    // Find appointment
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Optional: prevent changing already completed/cancelled (business rule)
    if (['completed', 'cancelled'].includes(appointment.status) && 
        !['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${appointment.status} to ${status}`,
      });
    }

    // Update status
    appointment.status = status;

    await appointment.save();


    cache.del('appointments:all');
  
    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: {
        id: appointment._id,
        serviceName: appointment.serviceName,
        date: appointment.date,
        time: appointment.time,
        fullName: appointment.fullName,
        phoneNumber: appointment.phoneNumber,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error('Update appointment status error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment status',
      error: error.message,
    });
  }
};