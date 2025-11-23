// ============== components/ui/Input.jsx ==============
import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          ref={ref}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            border rounded-lg
            bg-white
            text-gray-900 placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});