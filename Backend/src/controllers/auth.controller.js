import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sequelize, User, Association } from "../models/index.js";
import { sendEmail } from "../utils/sendEmail.js";

const buildAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: parseInt(process.env.COOKIE_MAX_AGE, 10),
});

const issueAuthToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const buildVerificationUrl = (token) => {
  const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/verify-email?token=${token}`;
};

export const register = async (req, res) => {
  try {
    const { full_name, email, password, role, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password_hash,
      role: role || "donor",
      phone,
    });

    const token = issueAuthToken(user);
    res.cookie("token", token, buildAuthCookieOptions());

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const registerAssociation = async (req, res) => {
  const tx = await sequelize.transaction();

  try {
    const {
      full_name,
      email,
      password,
      phone,
      social_number,
      name,
      description,
      logo_url,
      wilaya,
      Maps_link,
      phone_number,
      social_media_links,
      opening_hours,
      agreed_to_tos,
    } = req.body;

    const existing = await User.findOne({ where: { email }, transaction: tx });
    if (existing) {
      await tx.rollback();
      return res.status(409).json({ error: "Email already registered" });
    }

    const socialNumberTaken = await Association.findOne({
      where: { social_number },
      transaction: tx,
    });
    if (socialNumberTaken) {
      await tx.rollback();
      return res.status(409).json({ error: "Social number already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const verification_token = crypto.randomBytes(32).toString("hex");

    const user = await User.create(
      {
        full_name,
        email,
        password_hash,
        role: "association",
        phone,
        is_email_verified: false,
        verification_token,
      },
      { transaction: tx }
    );

    const association = await Association.create(
      {
        user_id: user.id,
        social_number,
        name,
        description,
        logo_url,
        wilaya,
        Maps_link,
        phone_number,
        social_media_links,
        opening_hours,
        agreed_to_tos,
      },
      { transaction: tx }
    );

    const token = issueAuthToken(user);

    try {
      const verificationUrl = buildVerificationUrl(verification_token);
      await sendEmail({
        to: user.email,
        subject: "Verify your IhsanTrack association email",
        text: `Welcome to IhsanTrack. Verify your email using this link: ${verificationUrl}`,
        html: `<p>Welcome to IhsanTrack.</p><p>Verify your email by clicking <a href="${verificationUrl}">this link</a>.</p>`,
      });
    } catch (emailErr) {
      await tx.rollback();
      return res.status(500).json({ error: `Association created failed while sending verification email: ${emailErr.message}` });
    }

    await tx.commit();

    res.cookie("token", token, buildAuthCookieOptions());

    return res.status(201).json({
      message: "Association registered successfully. Please verify your email to activate association actions.",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_email_verified: user.is_email_verified,
      },
      association,
    });
  } catch (err) {
    if (!tx.finished) {
      await tx.rollback();
    }
    return res.status(500).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    await user.update({
      is_email_verified: true,
      verification_token: null,
    });

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = issueAuthToken(user);
    res.cookie("token", token, buildAuthCookieOptions());

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
};

export const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash", "verification_token"] },
      include: [{ model: Association, as: "associationProfile" }],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
