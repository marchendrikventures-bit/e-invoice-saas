'use client';

import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const inputBase =
  'block w-full rounded-lg border-0 bg-white py-2.5 px-3.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-shadow focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:bg-gray-50 disabled:text-gray-400';

type FieldWrapperProps = {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (id: string) => React.ReactNode;
};

function FieldWrapper({ label, hint, error, required, className = '', children }: FieldWrapperProps) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children(id)}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string; wrapperClassName?: string }
>(({ label, hint, error, wrapperClassName, className = '', ...props }, ref) => (
  <FieldWrapper label={label} hint={hint} error={error} required={props.required} className={wrapperClassName}>
    {(id) => (
      <input
        ref={ref}
        id={id}
        className={`${inputBase} ${error ? 'ring-red-300 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
    )}
  </FieldWrapper>
));
Input.displayName = 'Input';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string; wrapperClassName?: string }
>(({ label, hint, error, wrapperClassName, className = '', ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <FieldWrapper label={label} hint={hint} error={error} required={props.required} className={wrapperClassName}>
      {(id) => (
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            className={`${inputBase} pr-10 ${error ? 'ring-red-300 focus:ring-red-500' : ''} ${className}`}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      )}
    </FieldWrapper>
  );
});
PasswordInput.displayName = 'PasswordInput';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string; error?: string; wrapperClassName?: string }
>(({ label, hint, error, wrapperClassName, className = '', children, ...props }, ref) => (
  <FieldWrapper label={label} hint={hint} error={error} required={props.required} className={wrapperClassName}>
    {(id) => (
      <select ref={ref} id={id} className={`${inputBase} bg-white ${className}`} {...props}>
        {children}
      </select>
    )}
  </FieldWrapper>
));
Select.displayName = 'Select';
