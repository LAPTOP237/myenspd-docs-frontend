// ============== components/ui/Select.jsx ==============
import React, { forwardRef } from 'react';
export const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Sélectionnez...',
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
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5
          border rounded-lg
          bg-white
          text-gray-900
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-error' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
});