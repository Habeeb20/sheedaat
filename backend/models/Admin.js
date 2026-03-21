import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

    email: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    role: {
        type:String,
       default: "admin"
    },
      resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  newEmail: String,
  emailChangeToken: String,
  emailChangeExpiresAt: Date,
      isActive: { type: Boolean, default: true },


  refreshTokens: [{
    token: String,
    deviceInfo: String,     // optional: browser, IP, etc.
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
  }],


}, { timestamps: true })

const Admin = mongoose.model('Admin', adminSchema)


export default Admin










