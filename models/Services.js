// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
      user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        },
         type: {
    type: String,

    trim: true,
    maxlength: [100, 'type cannot exceed 100 characters'],
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {  // write-up
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  media: [{  // array of Cloudinary URLs
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)/.test(v);
      },
      message: props => `${props.value} is not a valid URL`,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

});

export default mongoose.model('Service', serviceSchema);