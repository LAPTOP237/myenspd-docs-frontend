import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Connexion réussie!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <Card className="p-8 backdrop-blur-sm bg-white/95 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
  </div>
  <h1 className="text-2xl font-bold text-gray-900">Bienvenue</h1>
  <p className="text-gray-500 mt-1">Connectez-vous à votre compte</p>
</div>


      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-error-light border border-error/20 rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Nom d'utilisateur"
          type="text"
          icon={User}
          placeholder="votre_identifiant"
          error={errors.username?.message}
          {...register('username', {
              required: "Le nom d'utilisateur est requis"
          })}
        />


        <Input
          label="Mot de passe"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Le mot de passe est requis',
            minLength: { value: 6, message: 'Minimum 6 caractères' }
          })}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('remember')}
            />
            <span className="text-gray-600">Se souvenir de moi</span>
          </label>
          <Link 
            to="/reset-password" 
            className="text-primary hover:text-primary-600 font-medium"
          >
            Mot de passe oublié?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Se connecter
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Pas encore de compte?{' '}
          <Link to="/register" className="text-secondary font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginPage;