// ============== components/ui/Card.jsx ==============
export const Card = ({ children, className = '', hover = false, padding = true }) => {
  return (
    <div
      className={`
        bg-white rounded-xl
        border border-gray-100
        shadow-card
        ${hover ? 'hover:shadow-soft transition-shadow duration-200' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);
