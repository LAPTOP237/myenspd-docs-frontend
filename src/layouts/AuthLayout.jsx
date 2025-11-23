import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Logo flottant en arrière-plan */}
      {/* <div className="absolute top-8 left-8 flex items-center gap-3 text-white">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <h1 className="font-bold text-lg">MyENSPD</h1>
          <p className="text-xs text-white/60">Docs</p>
        </div>
      </div> */}

      {/* Contenu de la page d'auth */}
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-white/50 text-sm">
        © 2025 ENSPD - Tous droits réservés
      </div>
    </div>
  );
};

export default AuthLayout;