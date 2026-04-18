import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Envelope, Phone, Check, WarningCircle } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../api/authentication/hooks";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useWebsiteAuth();
  const { updateProfileMutation } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (currentUser && isOpen) {
      setValue("name", currentUser.name || "");
      setValue("email", currentUser.email || "");
      setValue("phone", currentUser.phone || "");
    }
  }, [currentUser, isOpen, setValue]);

  // Reset form and messages when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset();
        setSuccessMessage(null);
      }, 300);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Profile update failed:", error);
      // Error handling is done by the mutation
    }
  };

  const FloatingLabelInput = ({
    label,
    register,
    error,
    placeholder,
    type = "text",
    icon: Icon,
    disabled = false,
    ...props
  }: {
    label: string;
    register: any;
    error?: any;
    placeholder?: string;
    type?: string;
    icon?: React.ComponentType<any>;
    disabled: boolean;
    props?: any;
  }) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] font-black uppercase tracking-widest text-brand-brown/50 ml-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown/40">
            <Icon size={18} weight="duotone" />
          </div>
        )}
        <input
          {...register}
          {...props}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-12' : 'pl-5'} pr-5 py-3 bg-white border rounded-2xl focus:ring-4 focus:ring-brand-brown/5 focus:border-brand-brown outline-none transition-all text-sm font-semibold placeholder:text-gray-300 ${
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : 'border-brand-brown/10'
          }`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-[10px] font-bold ml-1 flex items-center gap-1">
          <WarningCircle size={12} weight="bold" />
          {error.message}
        </p>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-brand-brown/10 overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-brand-brown flex items-center gap-2">
                <div className="p-1.5 bg-brand-brown/5 rounded-lg">
                  <User size={20} weight="duotone" className="text-brand-brown" />
                </div>
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                  >
                    <Check size={20} className="text-green-600" weight="bold" />
                    <p className="text-green-800 text-sm font-semibold">{successMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FloatingLabelInput
                  label="Full Name"
                  register={register("name")}
                  error={errors.name}
                  disabled={isSubmitting || updateProfileMutation.isPending}
                  placeholder="Enter your full name"
                  icon={User}
                />

                <FloatingLabelInput
                  label="Email Address"
                  register={register("email")}
                  error={errors.email}
                  disabled={true}
                  placeholder="Enter your email address"
                  type="email"
                  icon={Envelope}
                />

                <FloatingLabelInput
                  label="Phone Number"
                  register={register("phone")}
                  error={errors.phone}
                  disabled={isSubmitting || updateProfileMutation.isPending}
                  placeholder="Enter your phone number"
                  type="tel"
                  icon={Phone}
                />

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || updateProfileMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-brand-brown text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-brand-brown/20 hover:bg-brand-cocoa transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting || updateProfileMutation.isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check size={18} weight="bold" />
                      Update Profile
                    </>
                  )}
                </motion.button>
              </form>

              {/* Error Display */}
              <AnimatePresence>
                {updateProfileMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                  >
                    <WarningCircle size={20} className="text-red-600" weight="bold" />
                    <p className="text-red-800 text-sm font-semibold">
                      {updateProfileMutation.error instanceof Error
                        ? updateProfileMutation.error.message
                        : "Failed to update profile. Please try again."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileEditModal;