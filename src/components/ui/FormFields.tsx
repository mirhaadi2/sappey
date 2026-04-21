import React, { forwardRef } from 'react';
import { FieldError, UseFormRegister, Path, FieldValues } from 'react-hook-form';

type RHFName<T extends FieldValues> = Path<T> & string;

interface BaseFieldProps<T extends FieldValues = any> {
    name?: RHFName<T>;
    register?: UseFormRegister<T>;
    error?: FieldError;
    className?: string;
}

interface InputProps<T extends FieldValues = any> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>, BaseFieldProps<T> {
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, name, register, error, className = '', ...props }, ref) => {
        const baseClass = "w-full px-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-0 transition";
        const inputClass = `${baseClass} ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-brand-brown'} ${className}`;

        const registerProps = name && register ? register(name) : {};

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-[13px] font-semibold text-brand-brown mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    name={name}
                    className={inputClass}
                    {...registerProps}
                    {...props}
                />
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface SelectProps<T extends FieldValues = any> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'>, BaseFieldProps<T> {
    label?: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, name, register, error, className = '', options, placeholder, ...props }, ref) => {
        const baseClass = "w-full px-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-0 transition";
        const selectClass = `${baseClass} ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-brand-brown'} ${className}`;

        const registerProps = name && register ? register(name) : {};

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-[13px] font-semibold text-brand-brown mb-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    name={name}
                    className={selectClass}
                    {...registerProps}
                    {...props}
                >
                    {placeholder && (
                        <option value="">{placeholder}</option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

interface TextareaProps<T extends FieldValues = any> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>, BaseFieldProps<T> {
    label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, name, register, error, className = '', ...props }, ref) => {
        const baseClass = "w-full px-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-0 transition resize-none";
        const textareaClass = `${baseClass} ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-brand-brown'} ${className}`;

        const registerProps = name && register ? register(name) : {};

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-[13px] font-semibold text-brand-brown mb-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    name={name}
                    className={textareaClass}
                    {...registerProps}
                    {...props}
                />
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

interface CheckboxProps<T extends FieldValues = any> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'>, BaseFieldProps<T> {
    label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, name, register, error, className = '', ...props }, ref) => {
        const registerProps = name && register ? register(name) : {};

        return (
            <div className="space-y-1">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        ref={ref}
                        name={name}
                        type="checkbox"
                        className={`w-5 h-5 text-brand-brown rounded border-slate-300 focus:ring-0 ${className}`}
                        {...registerProps}
                        {...props}
                    />
                    <span className="text-[13px] text-brand-brown font-semibold">{label}</span>
                </label>
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';