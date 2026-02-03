const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  ...props
}) => {
  const inputId = `input-${name}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-sm font-medium text-slate-700 mb-1.5 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full py-2.5 border rounded-lg text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-accent-600/20 focus:border-accent-600
            disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-500
            transition-all
            ${icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
            ${inputClassName}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
