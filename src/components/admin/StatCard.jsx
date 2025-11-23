import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, link }) => (
  <Link to={link}>
    <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-2xl`}>
        {Icon && <Icon className="w-6 h-6 text-white" />}
      </div>
    </div>
  </Link>
);

export default StatCard;
