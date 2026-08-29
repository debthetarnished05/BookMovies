import crypto from "crypto";
import config from "../../config/config.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

// Generate OTP
export const generateOTP = () => {
  return crypto.randomInt(1000, 9999);
};

// Hash OTP
export const hashOTP = (data) => {
  if (!config.hashingSecret) {
    throw new Error("Hashing secret is not defined");
  }

  return crypto
    .createHmac("sha256", config.hashingSecret)
    .update(data)
    .digest("hex");
};

// Verify OTP
export const verifyOTP = (hashedOTP, data) => {
  const newHashedOTP = hashOTP(data);
  return newHashedOTP === hashedOTP;
};

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUsername,
    pass: config.emailPassword,
  },
});

// Mail Generator
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "bookMovies",
    link: "www.youtube.com",
    logo: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751475322/zu4fnmh2jljzbtey77ah.png",
  },
});

// Send OTP to Email
export const sendOTPtoEmail = async (email, otp) => {
  const emailTemp = {
    body: {
      name: "",
      intro:
        "Welcome to bookMovies! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your account, please use the following OTP:",
        button: {
          color: "#323232",
          text: otp,
          link: "#",
        },
      },
      outro:
        "This OTP will expire in 2 minutes. If you did not request this OTP, please ignore this email.",
    },
  };

  const mail = mailGenerator.generate(emailTemp);

  const message = {
    from: config.emailUsername,
    to: email,
    subject: "Your OTP for bookMovies",
    html: mail,
  };

  const info = await transporter.sendMail(message);

  console.log(info);

  return info.messageId;
};