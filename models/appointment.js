import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false,
  },
  serviceName: {
    type: String,
    required: false,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  time: {
    type: String, // "HH:mm" format, e.g. "14:30"
    required: [true, 'Appointment time is required'],
    // match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use HH:mm)'],
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name too short'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    // You can add better validation with regex if needed (e.g. Nigerian numbers)
  },
  email: {
    type: String,
    required: false,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Note too long'],
  },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // if you have User model; otherwise remove or make optional
//     default: null,
//   },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to prevent double-booking same service/date/time
appointmentSchema.index({ service: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model('Appointment', appointmentSchema);