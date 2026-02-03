const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  padding = true,
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-slate-200/80';
  const hoverStyles = hoverable ? 'hover:shadow-md hover:border-slate-300/80 transition-all cursor-pointer hover:-translate-y-0.5' : '';
  const paddingStyles = padding ? 'p-4 sm:p-6' : '';

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
