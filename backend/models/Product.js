// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  price: {
    type: Number,
    required: [false, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  media: [{  // array of Cloudinary URLs (pictures/videos)
    type: String,

    validate: {
      validator: function(v) {
        return /^(https?:\/\/)/.test(v); // basic URL check
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

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
 
});

export default mongoose.model('Product', productSchema);