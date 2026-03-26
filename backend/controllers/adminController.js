// controllers/authController.js
import User from "../models/Admin.js"

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import mongoose from "mongoose";
import { comparePassword,  forgotPassword as forgotPasswordUtil,
  resetPassword as resetPasswordUtil,
  changePassword as changePasswordUtil,
  sendEmailChangeRequest,
  confirmEmailChange as confirmEmailChangeUtil,

  generateToken,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
  revokeAllRefreshTokens, } from "../utils/function.js";



// Custom token generator (aligned with utils)
const generateTokenCustom = (user) => {
  return generateToken(user._id, user.role);
};


// ────────────────────────────────────────────────
// LOGIN USER
// ────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Email and password are required",
    });
  }

  try {
    // Include password explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid email ",
      });
    }

    if(user.password !== password){
        return res.status(400).json({message: "incorrect password"})
    }

 

   
    const token = generateTokenCustom(user);
       const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    await saveRefreshToken(user._id, refreshToken, req.headers['user-agent'] || 'unknown');

  res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      status: true,
      message: `Login successful, You are welcome sheedatsbraiding `,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
    
     
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};


// ────────────────────────────────────────────────
// FORGOT PASSWORD
// ────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }

  try {
    await forgotPasswordUtil(email);
    return res.status(200).json({
      status: true,
      message: "If your email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// RESET PASSWORD
// ────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
console.log(req.body)
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ status: false, message: "Password must be at least 6 characters" });
  }

  try {
      // const saltRounds = 12;
      // const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await resetPasswordUtil(token, newPassword);
    return res.status(200).json({
      status: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// ────────────────────────────────────────────────
// UPDATE PROFILE
// ────────────────────────────────────────────────

export const updateProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { user, guarantors = [], documents = [] } = req.body;

    /* ================= 1. UPDATE USER ================= */
    const allowedUserFields = [
      'firstName', 'lastName', 'phone', 'avatar', 
      'address', 'state', 'lga', 'dateOfBirth', 
      'vehicle', 'preferredPayment', 'category'
    ];

    const userUpdates = {};
    allowedUserFields.forEach(field => {
      if (user?.[field] !== undefined) {
        userUpdates[field] = user[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userUpdates },
      { new: true, runValidators: true, session }
    );

    if (!updatedUser) throw new Error('User account not found');

    /* ================= 2. UPSERT GUARANTORS ================= */
    for (const g of guarantors) {
      // Basic validation based on your Schema's 'required' fields
      if (!g.position || !g.name || !g.phone || !g.relationship || !g.idDocument) continue;

      await Guarantor.findOneAndUpdate(
        { user: userId, position: g.position },
        {
          $set: {
            name: g.name,
            phone: g.phone,
            relationship: g.relationship,
            idDocument: g.idDocument, // Cloudinary URL
            address: {
              street: g.address?.street,
              city: g.address?.city,
              state: g.address?.state,
              country: g.address?.country || 'Nigeria'
            },
            status: 'pending',
            verifiedAt: null,
            rejectionReason: null
          }
        },
        { upsert: true, new: true, runValidators: true, session }
      );
    }

    /* ================= 3. UPSERT DOCUMENTS ================= */
    for (const doc of documents) {
      if (!doc.type || !doc.url) continue;

      // Ensure guarantorPosition is present if the type is 'guarantor-id'
      const gPos = doc.type === 'guarantor-id' ? doc.guarantorPosition : null;

      await Document.findOneAndUpdate(
        {
          user: userId,
          type: doc.type,
          guarantorPosition: gPos
        },
        {
          $set: {
            url: doc.url, // Cloudinary URL
            status: 'pending',
            rejectedAt: null,
            rejectionReason: null
          }
        },
        { upsert: true, new: true, runValidators: true, session }
      );
    }

    // Success: Commit all changes
    await session.commitTransaction();
    
    return res.status(200).json({
      status: true,
      message: 'Profile and related records updated successfully',
      user: updatedUser.toJSON()
    });

  } catch (error) {
    // Failure: Rollback every change made during this attempt
    await session.abortTransaction();
    console.error('Update profile error:', error);
    
    return res.status(500).json({
      status: false,
      message: error.message || 'An error occurred during the update'
    });
  } finally {
    session.endSession();
  }
};
// ────────────────────────────────────────────────
// GET DASHBOARD / OVERVIEW STATS
// ────────────────────────────────────────────────
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let stats = {
      role: user.role,
      totalTrips: user.totalTrips || 0,
      earnings: user.earnings || 0,
      rating: user.rating || 0,
    };

    if (user.role === 'driver') {
      // Driver stats from Hire model
      const hires = await Hire.find({ driver: userId });

      const totalPaidAmount = hires.reduce((sum, h) => {
        return h.paymentStatus === 'paid' ? sum + (h.amountOffered || 0) : sum;
      }, 0);

      const adminPercentage = await getDriverCommission(); // from admin controller
      const adminCommission = Math.round((totalPaidAmount * adminPercentage) / 100);
      const driverShare = totalPaidAmount - adminCommission;

      const totalBookedHours = hires.reduce((sum, h) => sum + (h.durationHours || 0), 0);

      const activeHires = hires.filter(h => h.status === 'active').length;
      const pendingHires = hires.filter(h => h.status === 'pending' || h.status === 'pending_approval').length;

      stats = {
        ...stats,
        totalPaidAmount,
        adminCommission,
        driverShare,
        totalBookedHours,
        activeHires,
        pendingHires,
        currentHireStatus: user.currentHireStatus || 'available',
      };
    } else if (user.role === 'client') {
      // Client stats
      const hires = await Hire.find({ client: userId });

      const totalAmountPaid = hires.reduce((sum, h) => {
        return h.paymentStatus === 'paid' ? sum + (h.amountOffered || 0) : sum;
      }, 0);

      const activeHires = hires.filter(h => h.status === 'active').length;
      const pendingHires = hires.filter(h => h.status === 'pending' || h.status === 'pending_approval').length;

      stats = {
        ...stats,
        totalAmountPaid,
        activeHires,
        pendingHires,
      };
    }

    return res.status(200).json({
      status: true,
      message: "Dashboard loaded",
      data: {
        user: user.toJSON(),
        stats,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// ────────────────────────────────────────────────
// CHANGE PASSWORD (logged-in)
// ────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      status: false,
      message: "Valid current and new passwords required (min 6 chars)",
    });
  }

  try {
    await changePasswordUtil(userId, currentPassword, newPassword);
    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// ────────────────────────────────────────────────
// CHANGE EMAIL REQUEST
// ────────────────────────────────────────────────
export const changeEmail = async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    return res.status(400).json({ status: false, message: "New email and password required" });
  }

  try {
    const user = await User.findById(req.user._id);
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Incorrect password" });
    }

    await sendEmailChangeRequest(user, newEmail.toLowerCase());
    return res.status(200).json({
      status: true,
      message: "Verification email sent to new address",
    });
  } catch (error) {
    console.error("Change email error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// CONFIRM EMAIL CHANGE
// ────────────────────────────────────────────────
export const confirmEmailChange = async (req, res) => {
  const { token } = req.params;

  try {
    await confirmEmailChangeUtil(token);
    return res.status(200).json({
      status: true,
      message: "Email changed successfully",
    });
  } catch (error) {
    console.error("Confirm email change error:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
};































// Refresh access token using refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: false,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and check if this refresh token is still valid
    const user = await User.findOne({
      _id: decoded.id,
      'refreshTokens.token': refreshToken,
    });

    if (!user) {
      // Token was revoked or invalid
      res.clearCookie('refreshToken');
      return res.status(403).json({
        status: false,
        message: "Invalid or revoked refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    return res.status(200).json({
      status: true,
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.clearCookie('refreshToken');
    return res.status(403).json({
      status: false,
      message: "Invalid refresh token",
    });
  }
};




// Logout – single device (clears current refresh token)
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Remove this specific refresh token
      await removeRefreshToken(req.user._id, refreshToken);
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error during logout",
    });
  }
};

// Logout from ALL devices
export const logoutAll = async (req, res) => {
  try {
    await revokeAllRefreshTokens(req.user._id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      status: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};







