import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, WarningCircle, SpinnerGap } from '@phosphor-icons/react';
import { useSendGuestOtp, useVerifyGuestOtp } from '../../api/guest/otp';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (data: { contact: string; type: 'email' | 'phone' | 'whatsapp'; guestToken: string }) => void;
  contactData: {
    email: string;
    phone: string;
    whatsapp: string;
  };
  defaultType?: 'email' | 'phone' | 'whatsapp';
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  contactData,
  defaultType = 'email',
}) => {
  const [step, setStep] = useState<'select' | 'verify'>('select');
  const [selectedType, setSelectedType] = useState<'email' | 'phone' | 'whatsapp'>(defaultType);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const sendOtpMutation = useSendGuestOtp();
  const verifyOtpMutation = useVerifyGuestOtp();

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const availableContactTypes = (['email', 'phone', 'whatsapp'] as const).filter(
    (type) => Boolean(contactData[type])
  ) as Array<'email' | 'phone' | 'whatsapp'>;

  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setOtp('');
    setSuccess(false);
    setTimeLeft(0);

    const typeToUse = availableContactTypes.includes(defaultType)
      ? defaultType
      : availableContactTypes[0];

    if (typeToUse) {
      setSelectedType(typeToUse);
    }

    if (availableContactTypes.length === 1 && typeToUse) {
      setStep('verify');
      sendOtpMutation
        .mutateAsync({ contact: contactData[typeToUse], type: typeToUse })
        .then(() => setTimeLeft(300))
        .catch((err) => {
          setError(err instanceof Error ? err.message : `Failed to send OTP to ${typeToUse}`);
        });
    } else {
      setStep('select');
    }
  }, [isOpen, contactData.email, contactData.phone, contactData.whatsapp, defaultType]);

  const getContact = () => {
    return contactData[selectedType] || '';
  };

  const formatContact = (contact: string) => {
    if (selectedType === 'email') return contact;
    // Mask phone numbers: show first 3 and last 2 digits
    const masked = contact.replace(/^(\d{3})\d{4}(\d{2})$/, '$1****$2');
    return masked;
  };

  const handleSendOtp = async () => {
    const contact = getContact();
    if (!contact) {
      setError(`No ${selectedType} provided`);
      return;
    }

    setError('');
    try {
      await sendOtpMutation.mutateAsync({
        contact,
        type: selectedType,
      });
      setStep('verify');
      setTimeLeft(300); // 5 minutes
      setOtp('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to send OTP to ${selectedType}`
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const contact = getContact();
    setError('');
    try {
      const result = await verifyOtpMutation.mutateAsync({
        contact,
        otp,
        type: selectedType,
      });

      setSuccess(true);
      setTimeout(() => {
        onVerified({
          contact,
          type: selectedType,
          guestToken: result.guestToken,
        });
        setStep('select');
        setOtp('');
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
      setOtp('');
    }
  };

  const handleResendOtp = () => {
    setOtp('');
    setError('');

    if (availableContactTypes.length === 1) {
      handleSendOtp();
    } else {
      setStep('select');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e:any) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Verify Your Contact</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Step 1: Select Contact Type */}
            {step === 'select' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <p className="text-sm text-slate-600 mb-4">
                  Choose how you'd like to receive the OTP
                </p>

                {/* Email Option */}
                {contactData.email && (
                  <button
                    onClick={() => setSelectedType('email')}
                    className={`w-full p-4 border-2 rounded-xl transition ${
                      selectedType === 'email'
                        ? 'border-brand-brown bg-brand-brown/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedType === 'email'}
                        onChange={() => setSelectedType('email')}
                        className="mt-1"
                      />
                      <div className="text-left flex-1">
                        <div className="text-sm font-semibold text-slate-900">Email</div>
                        <div className="text-xs text-slate-600">{contactData.email}</div>
                      </div>
                    </div>
                  </button>
                )}

                {/* Phone Option */}
                {contactData.phone && (
                  <button
                    onClick={() => setSelectedType('phone')}
                    className={`w-full p-4 border-2 rounded-xl transition ${
                      selectedType === 'phone'
                        ? 'border-brand-brown bg-brand-brown/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedType === 'phone'}
                        onChange={() => setSelectedType('phone')}
                        className="mt-1"
                      />
                      <div className="text-left flex-1">
                        <div className="text-sm font-semibold text-slate-900">SMS</div>
                        <div className="text-xs text-slate-600">{contactData.phone}</div>
                      </div>
                    </div>
                  </button>
                )}

                {/* WhatsApp Option */}
                {contactData.whatsapp && (
                  <button
                    onClick={() => setSelectedType('whatsapp')}
                    className={`w-full p-4 border-2 rounded-xl transition ${
                      selectedType === 'whatsapp'
                        ? 'border-brand-brown bg-brand-brown/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedType === 'whatsapp'}
                        onChange={() => setSelectedType('whatsapp')}
                        className="mt-1"
                      />
                      <div className="text-left flex-1">
                        <div className="text-sm font-semibold text-slate-900">WhatsApp</div>
                        <div className="text-xs text-slate-600">{contactData.whatsapp}</div>
                      </div>
                    </div>
                  </button>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <WarningCircle size={16} className="text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                {/* Send Button */}
                <button
                  onClick={handleSendOtp}
                  disabled={sendOtpMutation.isPending || !getContact()}
                  className="w-full bg-brand-brown text-white py-3 rounded-xl font-semibold hover:bg-brand-brown/90 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
                >
                  {sendOtpMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <SpinnerGap size={18} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'verify' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Success State */}
                {success && (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <CheckCircle size={48} className="text-green-600 mb-3" />
                      <p className="text-lg font-semibold text-slate-900">Verified!</p>
                      <p className="text-sm text-slate-600">Proceeding to checkout...</p>
                    </motion.div>
                  </div>
                )}

                {!success && (
                  <>
                    <p className="text-sm text-slate-600">
                      Enter the OTP sent to <span className="font-semibold">{formatContact(getContact())}</span>
                    </p>

                    {/* OTP Input */}
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      className="w-full px-4 py-3 text-2xl text-center tracking-widest border-2 border-slate-200 rounded-xl focus:border-brand-brown focus:outline-none"
                    />

                    {/* Timer */}
                    <div className="text-center">
                      <p className="text-sm text-slate-600">
                        OTP expires in{' '}
                        <span className={`font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-brand-brown'}`}>
                          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </span>
                      </p>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <WarningCircle size={16} className="text-red-600 flex-shrink-0" />
                        <span className="text-sm text-red-700">{error}</span>
                      </div>
                    )}

                    {/* Verify Button */}
                    <button
                      onClick={handleVerifyOtp}
                      disabled={verifyOtpMutation.isPending || otp.length !== 6}
                      className="w-full bg-brand-brown text-white py-3 rounded-xl font-semibold hover:bg-brand-brown/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {verifyOtpMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <SpinnerGap size={18} className="animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>

                    {/* Resend Link */}
                    <button
                      onClick={handleResendOtp}
                      className="w-full text-center text-sm text-brand-brown hover:underline"
                    >
                      Didn't receive? Send to different contact
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OtpVerificationModal;
