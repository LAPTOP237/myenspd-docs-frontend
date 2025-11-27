import React from 'react';

export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};
export const DialogHeader = ({ children }) => (
  <div className="border-b px-6 py-4">
    <h2 className="text-xl font-bold">{children}</h2>
  </div>
);

export const DialogBody = ({ children }) => (
  <div className="px-6 py-4">{children}</div>
);

export const DialogFooter = ({ children }) => (
  <div className="border-t px-6 py-4 flex justify-end gap-2">{children}</div>
);
