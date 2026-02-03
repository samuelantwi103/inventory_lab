const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = `select-${name}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3.5 py-2.5 border rounded-lg text-slate-900 bg-white
          focus:outline-none focus:ring-2 focus:ring-accent-600/20 focus:border-accent-600
          disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-500
          transition-all
          ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
        `}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
