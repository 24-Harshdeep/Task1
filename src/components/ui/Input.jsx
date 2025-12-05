import React from 'react';

const Input = ({ id, label, type = 'text', value, onChange, placeholder, error, leftIcon, rightElement, ariaLabel, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-textPrimary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{leftIcon}</div>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel || label}
          className={`w-full px-4 py-3 ${leftIcon ? 'pl-10' : ''} ${rightElement ? 'pr-12' : ''} border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
          {...props}
        />
        {rightElement && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightElement}</div>}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default React.memo(Input);
