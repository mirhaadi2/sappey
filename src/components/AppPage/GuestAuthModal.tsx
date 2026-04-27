import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Envelope,
  Phone,
  ChatCircle,
  ArrowRight,
  ArrowLeft,
  CircleNotch,
  WarningCircle,
} from '@phosphor-icons/react';
import { useGuestConfig, useSendOTP, useVerifyOTP, useCreateCustomer } from '../../api/guest';
import { useWebsiteAuth } from '../../context/WebsiteAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
  />
);

interface GuestAuthModalProps {}

const GuestAuthModal: React.FC<GuestAuthModalProps> = () => {
  const { authModal, closeAuthModal, setGuestAuthToken } = useWebsiteAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [selectedContactType, setSelectedContactType] = useState<
    'email' | 'phone' | 'whatsapp'
  >('email');
  const [contact, setContact] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [timer, setTimer] = useState(0);

  const { config, loading: configLoading } = useGuestConfig();
  const { sendOTP, loading: sendingOTP, error: otpError } = useSendOTP();
  const {
    verifyOTP,
    loading: verifyingOTP,
    error: verifyError,
  } = useVerifyOTP();
  const { createCustomer, loading: creatingCustomer } = useCreateCustomer();

  const isOpen = authModal === 'guest';

  // Save last page when modal opens
  useEffect(() => {
    if (isOpen) {
      sessionStorage.setItem('lastPage', location.pathname + location.search);
    }
  }, [isOpen, location]);

  // Reset on modal close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('contact');
        setContact('');
        setOtpValue(['', '', '', '', '', '']);
        setError(null);
        setTouched(false);
        setTimer(0);
      }, 300);
    }
  }, [isOpen]);

  // Auto-focus first OTP field when step changes to OTP
  useEffect(() => {
    if (step === 'otp') {
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    }
  }, [step]);

  const validateContact = (value: string, type: 'email' | 'phone' | 'whatsapp'): boolean => {
    if (!value.trim()) {
      setError('This field is required');
      return false;
    }

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else if (type === 'phone' || type === 'whatsapp') {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        setError('Please enter a valid phone number');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validateContact(contact, selectedContactType)) {
      return;
    }

    const success = await sendOTP(contact, selectedContactType);
    if (success) {
      setStep('otp');
      setTimer(30);
      setError(null);
      setOtpValue(['', '', '', '', '', '']);
    } else {
      setError(otpError || 'Failed to send OTP');
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Allow only one digit
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOTPBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValue.join('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const guestToken = await verifyOTP(contact, otp, selectedContactType);
      if (!guestToken) {
        setError(verifyError || 'Failed to verify OTP');
        return;
      }

      // Store guest token and update auth state
      setGuestAuthToken(guestToken);

      // Create or get customer from guest token
      const customerId = await createCustomer(guestToken);
      if (!customerId) {
        setError('Failed to create customer record');
        return;
      }

      // Close modal and redirect
      closeAuthModal();
      const lastPage = sessionStorage.getItem('lastPage') || '/';
      navigate(lastPage);
    } catch (err) {
      setError((err as Error).message || 'Failed to complete authentication');
    }
  };

  const handleResendOTP = async () => {
    const success = await sendOTP(contact, selectedContactType);
    if (success) {
      setTimer(30);
      setError(null);
      setOtpValue(['', '', '', '', '', '']);
    } else {
      setError(otpError || 'Failed to resend OTP');
    }
  };

  if (!isOpen) return null;

  if (configLoading) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeAuthModal}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 flex items-center justify-center"
          >
            <CircleNotch size={32} className="text-brand-brown animate-spin" />
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeAuthModal}
          />

          <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-brand-brown/10 p-[clamp(1.5rem,4vw,2rem)] overflow-hidden"
          >
            {/* Header Area */}
            <div className="flex justify-between items-start ">
              <div>
                <h2 className="text-[clamp(1.5rem,4vw,1.875rem)] font-extrabold text-brand-brown tracking-tight mb-[clamp(0.5rem,1vw,0.75rem)]">
                  Sappey
                </h2>
                <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-500 font-medium">
                  {step === 'contact'
                    ? 'Continue with your contact'
                    : 'Enter the code we sent you'}
                </p>
              </div>
              <button
                onClick={closeAuthModal}
                className="p-[clamp(0.5rem,1vw,0.75rem)] hover:bg-gray-100 rounded-full transition-colors text-gray-400 min-h-10 min-w-10 flex items-center justify-center"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Error Alert */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-[clamp(1rem,2vw,1.5rem)] bg-red-50 text-red-600 p-[clamp(0.75rem,1.5vw,1rem)] rounded-2xl flex items-center gap-3 border border-red-100"
                >
                  <WarningCircle size={18} weight="fill" />
                  <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 1: Contact Form */}
            <AnimatePresence mode="wait">
              {step === 'contact' && (
                <motion.form
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSendOTP}
                  className="space-y-[clamp(1rem,2vw,1.25rem)]"
                >
                  {/* Contact Type Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {config?.enabledContactTypes?.email && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContactType('email');
                          setContact('');
                          setError(null);
                        }}
                        className={`py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          selectedContactType === 'email'
                            ? 'bg-brand-brown text-white shadow-lg shadow-brand-brown/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Envelope size={16} weight="bold" />
                        Email
                      </button>
                    )}
                    {config?.enabledContactTypes?.phone && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContactType('phone');
                          setContact('');
                          setError(null);
                        }}
                        className={`py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          selectedContactType === 'phone'
                            ? 'bg-brand-brown text-white shadow-lg shadow-brand-brown/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Phone size={16} weight="bold" />
                        Phone
                      </button>
                    )}
                    {config?.enabledContactTypes?.whatsapp && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContactType('whatsapp');
                          setContact('');
                          setError(null);
                        }}
                        className={`py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          selectedContactType === 'whatsapp'
                            ? 'bg-brand-brown text-white shadow-lg shadow-brand-brown/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ChatCircle size={16} weight="bold" />
                        WhatsApp
                      </button>
                    )}
                  </div>

                  {/* Contact Input */}
                  <div className="relative group">
                    <div className="absolute left-[clamp(0.75rem,1.5vw,1rem)] top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                      {selectedContactType === 'email' ? (
                        <Envelope size={18} weight="bold" />
                      ) : selectedContactType === 'phone' ? (
                        <Phone size={18} weight="bold" />
                      ) : (
                        <ChatCircle size={18} weight="bold" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        if (touched) {
                          validateContact(e.target.value, selectedContactType);
                        }
                      }}
                      onBlur={() => {
                        setTouched(true);
                        validateContact(contact, selectedContactType);
                      }}
                      placeholder={
                        selectedContactType === 'email'
                          ? 'Enter your email'
                          : 'Enter your phone number'
                      }
                      className={`w-full pl-[clamp(2.5rem,6vw,3rem)] pr-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.75rem,2vw,1rem)] bg-gray-50 border-2 rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium text-[clamp(0.875rem,1.5vw,1rem)] ${
                        touched && error
                          ? 'border-red-300 bg-red-50'
                          : 'border-transparent focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sendingOTP || !contact.trim()}
                    className="w-full py-[clamp(0.6rem,1.5vw,0.75rem)] bg-brand-brown text-white rounded-2xl font-bold shadow-xl shadow-brand-brown/20 hover:bg-brand-brown/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-11 text-[clamp(0.75rem,1.5vw,0.875rem)]"
                  >
                    {sendingOTP ? (
                      <>
                        <Spinner />
                        Sending...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={16} weight="bold" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Step 2: OTP Verification */}
            <AnimatePresence mode="wait">
              {step === 'otp' && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-[clamp(1rem,2vw,1.5rem)]"
                >
                  {/* OTP Input Fields */}
                  <div className="flex justify-center gap-2">
                    {otpValue.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPBackspace(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 outline-none transition-all"
                      />
                    ))}
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center text-sm">
                    {timer > 0 ? (
                      <p className="text-gray-500">
                        Resend OTP in <span className="font-bold text-brand-brown">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={sendingOTP}
                        className="text-brand-brown font-semibold hover:underline disabled:opacity-50"
                      >
                        Didn't receive? Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={verifyingOTP || creatingCustomer || otpValue.join('').length !== 6}
                    className="w-full py-[clamp(0.6rem,1.5vw,0.75rem)] bg-brand-brown text-white rounded-2xl font-bold shadow-xl shadow-brand-brown/20 hover:bg-brand-brown/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-11 text-[clamp(0.75rem,1.5vw,0.875rem)]"
                  >
                    {verifyingOTP || creatingCustomer ? (
                      <>
                        <Spinner />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={16} weight="bold" />
                      </>
                    )}
                  </button>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('contact');
                      setError(null);
                    }}
                    className="w-full py-2 text-brand-brown font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    Change Contact
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuestAuthModal;
