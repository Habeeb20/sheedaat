// models/GalleryItem.js
import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: [true, 'Type (image/video) is required'],
    default: 'image'
  },
media: [{                 // ← array of strings
    type: String,
    required: true,
    validate: {
      validator: v => /^https?:\/\//.test(v),
      message: props => `${props.value} is not a valid URL`
    }
  }],
  caption: {
    type: String,
    trim: true,
    maxlength: [200, 'Caption cannot exceed 200 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

galleryItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

});

export default mongoose.model('GalleryItem', galleryItemSchema);