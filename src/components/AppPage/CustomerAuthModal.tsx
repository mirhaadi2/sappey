import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, WarningCircle, ArrowLeft } from '@phosphor-icons/react';
import { useSendCustomerOtp, useVerifyCustomerOtp } from '../../api/customers';
import { useWebsiteAuth } from '../../contexts/WebsiteAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
  />
);

interface CustomerAuthModalProps {}

const CustomerAuthModal: React.FC<CustomerAuthModalProps> = () => {
  const { authModal, closeAuthModal, setUserState } = useWebsiteAuth();
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

  const { mutateAsync: sendOtp, isPending: sendingOTP } = useSendCustomerOtp();
  const { mutateAsync: verifyOtp, isPending: verifyingOTP } = useVerifyCustomerOtp();

  const isOpen = authModal === 'customer';

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

    try {
      await sendOtp({ contact, contactType: selectedContactType });
      setStep('otp');
      setTimer(30);
      setError(null);
      setOtpValue(['', '', '', '', '', '']);
    } catch (err) {
      const errorMsg = (err instanceof Error) ? err.message : 'Failed to send OTP';
      setError(errorMsg);
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

  const handleOTPPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text') || '';
    const digits = pastedText.replace(/\D/g, '').slice(0, 6).split('');
    
    const newOtp = [...otpValue];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtpValue(newOtp);
    
    // Focus last filled input
    const lastFilledIndex = Math.min(digits.length - 1, 5);
    setTimeout(() => {
      document.getElementById(`otp-${lastFilledIndex}`)?.focus();
    }, 0);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValue.join('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const result = await verifyOtp({ contact, otp, contactType: selectedContactType });

      const userFromResponse = result?.data?.data?.user;
      if (userFromResponse) {
        setUserState(userFromResponse);
      }

      closeAuthModal();
      const lastPage = sessionStorage.getItem('lastPage') || '/';
      navigate(lastPage);
    } catch (err) {
      const errorMsg = (err instanceof Error) ? err.message : 'Failed to verify OTP';
      setError(errorMsg);
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOtp({ contact, contactType: selectedContactType });
      setTimer(30);
      setError(null);
      setOtpValue(['', '', '', '', '', '']);
    } catch (err) {
      const errorMsg = (err instanceof Error) ? err.message : 'Failed to resend OTP';
      setError(errorMsg);
    }
  };

  if (!isOpen) return null;

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
                  Sign In
                </h2>
                {/* <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-500 font-medium">
                  {step === 'contact'
                    ? 'Enter your contact to sign in'
                    : 'Enter the code we sent you'}
                </p> */}
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
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6"
                >
                  <WarningCircle size={20} weight="bold" className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact Step */}
            <AnimatePresence mode="wait">
              {step === 'contact' && (
                <motion.form
                  key="contact-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  {/* Contact Type Selection */}
                  {/* <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {config?.enabledContactTypes?.email && (
                        <button
                          type="button"
                          onClick={() => setSelectedContactType('email')}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            selectedContactType === 'email'
                              ? 'border-brand-brown bg-brand-brown/5 text-brand-brown'
                              : 'border-gray-200 hover:border-gray-300 text-gray-500'
                          }`}
                        >
                          <Envelope size={20} weight="bold" />
                          <span className="text-xs font-medium">Email</span>
                        </button>
                      )}
                      {config?.enabledContactTypes?.phone && (
                        <button
                          type="button"
                          onClick={() => setSelectedContactType('phone')}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            selectedContactType === 'phone'
                              ? 'border-brand-brown bg-brand-brown/5 text-brand-brown'
                              : 'border-gray-200 hover:border-gray-300 text-gray-500'
                          }`}
                        >
                          <Phone size={20} weight="bold" />
                          <span className="text-xs font-medium">Phone</span>
                        </button>
                      )}
                      {config?.enabledContactTypes?.whatsapp && (
                        <button
                          type="button"
                          onClick={() => setSelectedContactType('whatsapp')}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            selectedContactType === 'whatsapp'
                              ? 'border-brand-brown bg-brand-brown/5 text-brand-brown'
                              : 'border-gray-200 hover:border-gray-300 text-gray-500'
                          }`}
                        >
                          <ChatCircle size={20} weight="bold" />
                          <span className="text-xs font-medium">WhatsApp</span>
                        </button>
                      )}
                    </div>
                  </div> */}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-brown">
                      {selectedContactType === 'email' ? 'Email Address' :
                       selectedContactType === 'phone' ? 'Phone Number' : 'WhatsApp Number'}
                    </label>
                    <input
                      type={selectedContactType === 'email' ? 'email' : 'tel'}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={
                        selectedContactType === 'email' ? 'Enter your email' :
                        selectedContactType === 'phone' ? 'Enter your phone number' : 'Enter your WhatsApp number'
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        error && touched ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-brand-brown focus:ring-brand-brown/10'
                      }`}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={sendingOTP}
                    className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendingOTP ? <Spinner /> : <ArrowRight size={16} weight="bold" />}
                    Send OTP
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* OTP Step */}
            <AnimatePresence mode="wait">
              {step === 'otp' && (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  {/* OTP Inputs */}
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {otpValue.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOTPChange(index, e.target.value)}
                          onKeyDown={(e) => handleOTPBackspace(index, e)}
                          onPaste={handleOTPPaste}
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/10 transition-all"
                          maxLength={1}
                        />
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      We sent a 6-digit code to {contact}
                    </p>
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center space-y-2">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-500">
                        Resend code in {timer}s
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-sm text-brand-brown font-medium hover:underline"
                      >
                        Resend code
                      </button>
                    )}
                  </div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="w-full flex items-center justify-center gap-2 text-brand-brown py-2 rounded-xl hover:bg-brand-brown/5 transition-colors"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    Change contact
                  </button>

                  {/* Verify Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={verifyingOTP}
                    className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {verifyingOTP ? <Spinner /> : null}
                    Sign In
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomerAuthModal;