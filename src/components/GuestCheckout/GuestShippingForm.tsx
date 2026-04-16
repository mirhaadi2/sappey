import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { GuestShippingAddress } from '../../api/guest';

interface GuestShippingFormProps {
  contact: string;
  contactType: 'email' | 'phone' | 'whatsapp';
  onSubmit: (address: GuestShippingAddress) => void;
  onBack: () => void;
  loading?: boolean;
}

export const GuestShippingForm: React.FC<GuestShippingFormProps> = ({
  contact,
  contactType,
  onSubmit,
  onBack,
  loading = false,
}) => {
  const [formData, setFormData] = useState<GuestShippingAddress>({
    name: '',
    email: contactType === 'email' ? contact : '',
    phone: contactType === 'phone' || contactType === 'whatsapp' ? contact : '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    // Email validation
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (formData.phone.trim() && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (
    label: string,
    name: keyof GuestShippingAddress,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const error = errors[name];
    const isTouched = touched[name];

    return (
      <div key={name}>
        <label className="block text-sm font-semibold text-brand-brown mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          onBlur={() => handleBlur(name)}
          placeholder={placeholder}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg border-2 transition focus:outline-none ${
            isTouched && error
              ? 'border-red-500 bg-red-50 focus:bg-white'
              : 'border-slate-200 focus:border-brand-brown'
          }`}
        />
        {isTouched && error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center">
          <MapPin size={24} className="text-brand-brown" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brand-brown">Shipping Address</h2>
          <p className="text-sm text-slate-600">Where should we deliver your order?</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-brand-brown/10 space-y-4">
        {/* Name */}
        {renderField('Full Name', 'name', 'text', 'John Doe')}

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          {renderField('Email', 'email', 'email', 'john@example.com')}
          {renderField('Phone', 'phone', 'tel', '+91 9876543210')}
        </div>

        {/* Street Address */}
        {renderField('Street Address', 'street', 'text', '123 Main Street')}

        {/* City, State, ZIP */}
        <div className="grid grid-cols-3 gap-4">
          {renderField('City', 'city', 'text', 'Mumbai')}
          {renderField('State', 'state', 'text', 'Maharashtra')}
          {renderField('ZIP Code', 'zipCode', 'text', '400001')}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-brand-brown mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-brand-brown focus:outline-none"
          >
            <option value="India">India</option>
            <option value="Other">Other Countries</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold text-brand-brown border-2 border-brand-brown hover:bg-brand-brown/5 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-brand-brown text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-cocoa disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Continue to Review
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
