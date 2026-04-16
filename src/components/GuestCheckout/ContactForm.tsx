import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Envelope, Phone, ChatCircle, ArrowRight, CircleNotch } from '@phosphor-icons/react';
import { useGuestConfig, useSendOTP } from '../../api/guest';

interface GuestContactFormProps {
  onOTPSent: (contact: string, contactType: 'email' | 'phone' | 'whatsapp') => void;
  onBack: () => void;
}

export const GuestContactForm: React.FC<GuestContactFormProps> = ({ onOTPSent, onBack }) => {
  const { config, loading: configLoading } = useGuestConfig();
  const { sendOTP, loading: sendingOTP, error: otpError, success: otpSuccess } = useSendOTP();

  const [contacts, setContacts] = useState<{
    email: string;
    phone: string;
    whatsapp: string;
  }>({
    email: '',
    phone: '',
    whatsapp: '',
  });
  const [selectedContactType, setSelectedContactType] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [touched, setTouched] = useState<{ [key in 'email' | 'phone' | 'whatsapp']?: boolean }>({});
  const [localErrors, setLocalErrors] = useState<{ [key in 'email' | 'phone' | 'whatsapp']?: string }>({});

  useEffect(() => {
    if (otpSuccess) {
      onOTPSent(contacts[selectedContactType], selectedContactType);
    }
  }, [otpSuccess, contacts, selectedContactType, onOTPSent]);

  const validateContact = (type: 'email' | 'phone' | 'whatsapp', value: string): boolean => {
    if (!value.trim()) {
      setLocalErrors((prev) => ({ ...prev, [type]: 'This field is required' }));
      return false;
    }

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setLocalErrors((prev) => ({ ...prev, [type]: 'Please enter a valid email address' }));
        return false;
      }
    } else if (type === 'phone' || type === 'whatsapp') {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        setLocalErrors((prev) => ({ ...prev, [type]: 'Please enter a valid phone number' }));
        return false;
      }
    }

    setLocalErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });
    return true;
  };

  const handleContactChange = (type: 'email' | 'phone' | 'whatsapp', value: string) => {
    setContacts((prev) => ({ ...prev, [type]: value }));
    if (touched[type]) {
      validateContact(type, value);
    }
  };

  const handleBlur = (type: 'email' | 'phone' | 'whatsapp') => {
    setTouched((prev) => ({ ...prev, [type]: true }));
    validateContact(type, contacts[type]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all enabled fields as touched
    if (config?.enabledContactTypes) {
      const newTouched: { [key in 'email' | 'phone' | 'whatsapp']?: boolean } = {};
      if (config.enabledContactTypes.email) newTouched.email = true;
      if (config.enabledContactTypes.phone) newTouched.phone = true;
      if (config.enabledContactTypes.whatsapp) newTouched.whatsapp = true;
      setTouched(newTouched);
    }

    // Validate selected contact type
    if (!validateContact(selectedContactType, contacts[selectedContactType])) {
      return;
    }

    await sendOTP(contacts[selectedContactType], selectedContactType);
  };

  if (configLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <CircleNotch size={32} className="text-brand-brown animate-spin" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-700">Failed to load checkout configuration. Please try again.</p>
      </div>
    );
  }

  const getIcon = (type: 'email' | 'phone' | 'whatsapp') => {
    switch (type) {
      case 'email':
        return <Envelope size={24} />;
      case 'whatsapp':
        return <ChatCircle size={24} />;
      case 'phone':
      default:
        return <Phone size={24} />;
    }
  };

  const getPlaceholder = (type: 'email' | 'phone' | 'whatsapp') => {
    switch (type) {
      case 'email':
        return 'Enter your email address';
      case 'whatsapp':
        return 'Enter your WhatsApp number';
      case 'phone':
      default:
        return 'Enter your phone number';
    }
  };

  const getLabel = (type: 'email' | 'phone' | 'whatsapp') => {
    if (config.labels?.[type]) {
      return config.labels[type];
    }
    switch (type) {
      case 'email':
        return 'Email Address';
      case 'whatsapp':
        return 'WhatsApp Number';
      case 'phone':
      default:
        return 'Phone Number';
    }
  };

  // Determine which contact types are enabled
  const enabledTypes: ('email' | 'phone' | 'whatsapp')[] = [];
  if (config.enabledContactTypes?.email) enabledTypes.push('email');
  if (config.enabledContactTypes?.phone) enabledTypes.push('phone');
  if (config.enabledContactTypes?.whatsapp) enabledTypes.push('whatsapp');

  // Fallback to contactType if enabledContactTypes not provided
  const contactTypesToShow = enabledTypes.length > 0 ? enabledTypes : [config.contactType];

  // Ensure selectedContactType is valid
  if (!contactTypesToShow.includes(selectedContactType)) {
    setSelectedContactType(contactTypesToShow[0]);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-brown mb-2">Checkout as Guest</h2>
        <p className="text-slate-600">
          We'll send you an OTP to verify your contact information
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-brand-brown/10 space-y-6">
        {/* Contact Fields */}
        {contactTypesToShow.map((type) => {
          const inputType = type === 'email' ? 'email' : 'tel';
          return (
            <div key={type} className={`${contactTypesToShow.length > 1 ? 'p-4 rounded-lg border border-slate-200' : ''}`}>
              <label className="block text-sm font-semibold text-brand-brown mb-3">
                {getLabel(type)}
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown opacity-60">
                  {getIcon(type)}
                </div>
                <input
                  type={inputType}
                  value={contacts[type]}
                  onChange={(e) => handleContactChange(type, e.target.value)}
                  onBlur={() => handleBlur(type)}
                  placeholder={getPlaceholder(type)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition focus:outline-none ${
                    localErrors[type] && touched[type]
                      ? 'border-red-500 bg-red-50 focus:bg-white'
                      : 'border-slate-200 focus:border-brand-brown'
                  }`}
                  disabled={sendingOTP}
                />
              </div>

              {touched[type] && localErrors[type] && (
                <p className="text-sm text-red-600 mt-2">{localErrors[type]}</p>
              )}
            </div>
          );
        })}

        {otpError && (
          <p className="text-sm text-red-600">{otpError}</p>
        )}

        {/* Contact Type Selection (if multiple types) */}
        {contactTypesToShow.length > 1 && (
          <div className="bg-slate-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-brand-brown mb-3">
              Send OTP to:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {contactTypesToShow.map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="selectedContactType"
                    value={type}
                    checked={selectedContactType === type}
                    onChange={() => setSelectedContactType(type)}
                    disabled={sendingOTP}
                    className="w-4 h-4 text-brand-brown"
                  />
                  <span className="text-sm text-slate-700">
                    {type === 'email' ? '📧' : type === 'phone' ? '📱' : '💬'} {getLabel(type)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={sendingOTP || !contacts[selectedContactType]?.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-brand-brown text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-cocoa disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {sendingOTP ? (
            <>
              <CircleNotch size={20} className="animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              Send OTP
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={sendingOTP}
          className="w-full py-3 rounded-xl font-semibold text-brand-brown border-2 border-brand-brown hover:bg-brand-brown/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back to Login
        </button>
      </form>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">💡 Tip:</span> You'll receive an OTP shortly. This helps us keep your order secure.
        </p>
      </div>
    </motion.div>
  );
};
