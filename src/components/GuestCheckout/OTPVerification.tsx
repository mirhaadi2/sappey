import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CircleNotch, ArrowLeft } from '@phosphor-icons/react';
import { useVerifyOTP } from '../../api/guest';

interface GuestOTPVerificationProps {
  contact: string;
  onOTPVerified: (guestToken: string) => void;
  onBack: () => void;
  contactType: 'email' | 'phone' | 'whatsapp';
}

export const GuestOTPVerification: React.FC<GuestOTPVerificationProps> = ({
  contact,
  onOTPVerified,
  onBack,
  contactType,
}) => {
  const { verifyOTP, loading, error, guestToken } = useVerifyOTP();
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP verification success
  useEffect(() => {
    if (guestToken) {
      onOTPVerified(guestToken);
    }
  }, [guestToken, onOTPVerified]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOTPChange = (index: number, value: string) => {
    const numValue = value.replace(/\D/g, '');

    if (numValue.length > 1) {
      // Handle paste
      const digits = numValue.slice(0, 6 - index).split('');
      const newOTP = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOTP[index + i] = digit;
        }
      });
      setOTP(newOTP);

      // Focus last filled input
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      const newOTP = [...otp];
      newOTP[index] = numValue;
      setOTP(newOTP);

      if (numValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      return;
    }

    await verifyOTP(contact, otpValue);
  };

  const otpComplete = otp.every((digit) => digit !== '');
  const formatTimeLeft = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
  const isMaskedContact = contactType === 'email' ? contact.replace(/.(?=.*@)/g, '*') : `***${contact.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-brown mb-2">Verify OTP</h2>
        <p className="text-slate-600">
          Enter the 6-digit OTP sent to<br/>
          <span className="font-semibold">{isMaskedContact}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-brand-brown/10">
        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-brand-brown mb-4">
            Enter OTP
          </label>

          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e:any) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e: any) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition focus:outline-none ${
                  digit
                    ? 'border-brand-brown bg-brand-brown/5'
                    : 'border-slate-200 focus:border-brand-brown'
                }`}
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center mb-4">{error}</p>
          )}

          {/* Timer */}
          <div className="text-center mb-4">
            {timeLeft > 0 ? (
              <p className="text-sm text-slate-600">
                OTP expires in <span className="font-semibold text-brand-brown">{formatTimeLeft}</span>
              </p>
            ) : (
              <p className="text-sm text-red-600">OTP has expired. Please request a new one.</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!otpComplete || loading || timeLeft <= 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-brand-brown text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-cocoa disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <CircleNotch size={20} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify OTP
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="w-full mt-3 py-3 rounded-xl font-semibold text-brand-brown border-2 border-brand-brown hover:bg-brand-brown/5 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </form>

      {/* Resend Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">💡 Tip:</span> Didn't receive OTP? Check your spam folder or request a new one after the timer expires.
        </p>
      </div>
    </motion.div>
  );
};
