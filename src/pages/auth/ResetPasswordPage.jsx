import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const ResetPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const { forgotPassword, loading } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setSent(true);
      toast.success('Email envoyé!');
    } catch {
      toast.error('Erreur lors de l\'envoi');
    }
  };

  if (sent) {
    return (
      <Card className="p-8 backdrop-blur-sm bg-white/95 animate-fade-in text-center">
        <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Email envoyé!</h1>
        <p className="text-gray-500 mt-2">
          Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
        </p>
        <Link to="/login">
          <Button variant="outline" className="mt-6">
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-8 backdrop-blur-sm bg-white/95 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
  </div>
        <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié?</h1>
        <p className="text-gray-500 mt-1">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Adresse email"
          type="email"
          icon={Mail}
          placeholder="votre.email@enspd.cm"
          error={errors.email?.message}
          {...register('email', {
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email invalide'
            }
          })}
        />

        <Button type="submit" loading={loading} className="w-full">
          Envoyer le lien
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>
      </div>
    </Card>
  );
};

export default ResetPasswordPage;