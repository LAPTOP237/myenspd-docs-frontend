// ============== components/ui/Spinner.jsx ==============
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} animate-spin ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="text-primary">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ============== components/ui/Table.jsx ==============
export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto">
    <table className={`w-full ${className}`}>{children}</table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200">{children}</tbody>
);

export const TableRow = ({ children, className = '', onClick }) => (
  <tr 
    className={`hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = '' }) => (
  <th className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);