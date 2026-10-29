import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { AppError } from '../utils/apiResponse.js';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/otp.js';
import { signToken } from '../utils/jwt.js';
import { emailService } from './emailService.js';

const sanitizeUser = (user) => {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const register = async ({ name, fullName, email, phone, password, role }) => {
  const userName = fullName || name;
  const normalizedRole = role ? role.toUpperCase() : 'RENTER';
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new AppError('An account with this email address already exists. Please log in.', 409, 'EMAIL_EXISTS');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: userName,
        phone: phone || null,
        passwordHash,
        role: normalizedRole,
        isEmailVerified: true
      }
    });

    const token = signToken({ userId: updatedUser.id, role: updatedUser.role });
    return {
      user: sanitizeUser(updatedUser),
      token,
      message: 'Account created successfully.'
    };
  }

  // Brand new registration
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: userName,
      email: email.toLowerCase(),
      phone: phone || null,
      passwordHash,
      role: normalizedRole,
      isEmailVerified: true
    }
  });

  const token = signToken({ userId: newUser.id, role: newUser.role });

  return {
    user: sanitizeUser(newUser),
    token,
    message: 'Account created successfully.'
  };
};

export const verifyEmail = async ({ email, otp }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new AppError('No account found with this email address.', 404, 'USER_NOT_FOUND');
  }

  if (user.isEmailVerified) {
    const token = signToken({ userId: user.id, role: user.role });
    return {
      user: sanitizeUser(user),
      token,
      message: 'Email is already verified.'
    };
  }

  const latestOtp = await prisma.emailOtp.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  if (!latestOtp) {
    throw new AppError('No verification code request found. Please request a new code.', 400, 'NO_OTP_FOUND');
  }

  if (new Date() > latestOtp.expiresAt) {
    throw new AppError('Verification code has expired. Please request a new one.', 400, 'OTP_EXPIRED');
  }

  if (latestOtp.attempts >= 5) {
    throw new AppError('Maximum verification attempts (5) exceeded. Please request a new code.', 400, 'MAX_ATTEMPTS_EXCEEDED');
  }

  // Increment attempts
  await prisma.emailOtp.update({
    where: { id: latestOtp.id },
    data: { attempts: { increment: 1 } }
  });

  const isMatch = await verifyOtpHash(otp, latestOtp.otpHash);
  if (!isMatch) {
    const remaining = 4 - latestOtp.attempts;
    throw new AppError(
      remaining > 0
        ? `Invalid code. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`
        : 'Invalid code. Maximum attempts reached.',
      400,
      'INVALID_OTP'
    );
  }

  // Code is valid! Mark verified and clean up
  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true }
  });

  await prisma.emailOtp.deleteMany({
    where: { userId: user.id }
  });

  const token = signToken({ userId: verifiedUser.id, role: verifiedUser.role });

  return {
    user: sanitizeUser(verifiedUser),
    token,
    message: 'Email verified successfully! Welcome to RentKart.'
  };
};

export const resendOtp = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new AppError('No account found with this email address.', 404, 'USER_NOT_FOUND');
  }

  if (user.isEmailVerified) {
    throw new AppError('Your email address is already verified. Please log in.', 400, 'ALREADY_VERIFIED');
  }

  // Rate limit: max 3 resends per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentOtpsCount = await prisma.emailOtp.count({
    where: {
      userId: user.id,
      createdAt: { gte: oneHourAgo }
    }
  });

  if (recentOtpsCount >= 3) {
    throw new AppError(
      'Resend limit reached. You can request up to 3 verification codes per hour. Please try again later.',
      429,
      'RESEND_LIMIT_EXCEEDED'
    );
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  await prisma.emailOtp.deleteMany({ where: { userId: user.id } });
  await prisma.emailOtp.create({
    data: {
      userId: user.id,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0
    }
  });

  await emailService.sendOtpEmail(user.email, otp, user.name);

  return {
    message: 'A fresh 6-digit verification code has been sent to your email.'
  };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      'Your email is not verified yet. Please verify your email before logging in.',
      403,
      'EMAIL_NOT_VERIFIED',
      { requiresVerification: true, email: user.email }
    );
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
    message: 'Logged in successfully.'
  };
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
  }

  return user;
};
