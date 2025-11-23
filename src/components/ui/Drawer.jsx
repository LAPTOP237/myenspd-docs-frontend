// src/components/ui/Drawer.jsx
import React from 'react';

export const Drawer = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fond semi-transparent */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Drawer */}
      <div className="ml-auto w-96 bg-white h-full shadow-lg p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Drawer;