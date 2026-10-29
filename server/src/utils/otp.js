import bcrypt from 'bcryptjs';

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOtp = async (otp) => {
  return bcrypt.hash(otp, 10);
};

export const verifyOtpHash = async (otp, hashedOtp) => {
  return bcrypt.compare(otp, hashedOtp);
};
