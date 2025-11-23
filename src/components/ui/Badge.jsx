// ============== components/ui/Badge.jsx ==============
const badgeVariants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success-light text-success-dark',
  error: 'bg-error-light text-error-dark',
  warning: 'bg-warning-light text-warning-dark',
  info: 'bg-info-light text-info-dark',
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        rounded-full
        text-xs font-medium
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
