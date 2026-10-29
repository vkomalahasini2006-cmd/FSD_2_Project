import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyEmail, resendOtp, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // Only take last character
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // If backspace on an empty input, move back to previous input
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      toast.error('Please enter the complete 6-digit verification code.');
      return;
    }
    if (!email) {
      toast.error('No email specified for verification. Please register or log in.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyEmail(email, fullOtp);
      toast.success(res.message || 'Email verified successfully! Welcome to RentKart.');
      if (res.data?.user?.role === 'OWNER') {
        navigate('/my-listings');
      } else {
        navigate('/browse');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error(err.response?.data?.error?.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    setIsResending(true);
    try {
      const res = await resendOtp(email);
      toast.success(res.message || 'Verification code resent!');
      setResendCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend error:', err);
      toast.error(err.response?.data?.error?.message || 'Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-floating text-center">
        
        {/* Header */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <Mail className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Verify your email
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            We sent a 6-digit verification code to
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800 break-all bg-slate-50 py-1 px-3 rounded-lg border border-slate-200 inline-block font-mono">
            {email || 'your email'}
          </p>
        </div>

        {/* 6-box OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold text-slate-900 border-2 rounded-xl border-slate-200 bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none transition-all shadow-subtle"
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={otpDigits.join('').length !== 6}
            className="w-full font-semibold shadow-md"
          >
            <span>Verify & Proceed</span>
            {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>

        {/* Resend Controls */}
        <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Didn't receive the email code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`font-semibold transition-colors flex items-center gap-1 ${
                canResend
                  ? 'text-brand-600 hover:text-brand-700 cursor-pointer'
                  : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              <RotateCcw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              {canResend ? 'Resend Code' : `Resend in ${resendCountdown}s`}
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            (Check server terminal log in dev mode if SMTP is unconfigured)
          </span>
        </div>

        {/* Wrong Email fallback link */}
        <div className="text-center">
          <Link to="/register" className="text-xs text-slate-500 hover:text-slate-800">
            Wrong email address? Register again
          </Link>
        </div>
      </div>
    </div>
  );
};
