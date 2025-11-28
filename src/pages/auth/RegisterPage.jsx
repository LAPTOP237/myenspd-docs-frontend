import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { Mail, Lock, User, Hash } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';

const filieres = [
  { value: 'genie_logiciel', label: 'Génie Logiciel' },
  { value: 'genie_civil', label: 'Génie Civil' },
  { value: 'genie_electrique', label: 'Génie Électrique' },
  { value: 'genie_mecanique', label: 'Génie Mécanique' },
  { value: 'genie_industriel', label: 'Génie Industriel' },
];

export const RegisterPage = () => {
  const { register: registerUser, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const password = useWatch({ control, name: 'password' });

  const onSubmit = async (data) => {
    try {
      await registerUser({
  username: data.username,
  email: data.email,
  matricule: data.matricule,
  filiere: data.filiere,
  password: data.password,
  confirm_password: data.confirmPassword,  
});

      toast.success('Inscription réussie! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <Card className="p-8 backdrop-blur-sm bg-white/95 animate-fade-in">
      {/* Header */}
     <div className="text-center mb-8">
  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
  </div>
  <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
  <p className="text-gray-500 mt-1">Rejoingnez ENSPD Docs</p>
</div>


      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nom d'utilisateur"
            icon={User}
            placeholder="Ex: jkoffi24"
            error={errors.username?.message}
            {...register("username", { required: "Nom d'utilisateur requis" })}
          />
          {/* <Input
            label="Nom"
            icon={User}
            placeholder="Kamga"
            error={errors.nom?.message}
            {...register('nom', { required: 'Le nom est requis' })}
          />
          <Input
            label="Prénom"
            placeholder="Jean"
            error={errors.prenom?.message}
            {...register('prenom', { required: 'Le prénom est requis' })}
          /> */}
        </div>

        <Input
          label="Email"
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

        <Input
          label="Matricule"
          icon={Hash}
          placeholder="00G00000"
          error={errors.matricule?.message}
          {...register('matricule', {
            required: 'Le matricule est requis',
            pattern: {
              value: /^\d{2}[A-Z]\d{5}$/,
              message: 'Format: 2 chiffres + 1 lettre majuscule + 5 chiffres (ex: 23G01212)'
            }
          })}
        />
        <Select
          label="Filière"
          options={filieres}
          placeholder="Sélectionnez votre filière"
          error={errors.filiere?.message}
          {...register('filiere', { required: 'La filière est requise' })}
        />

        <Input
          label="Mot de passe"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Le mot de passe est requis',
            minLength: { value: 8, message: 'Minimum 8 caractères' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Doit contenir majuscule, minuscule et chiffre'
            }
          })}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirmation requise',
            validate: value => value === password || 'Les mots de passe ne correspondent pas'
          })}
        />

        <Button type="submit" loading={loading} className="w-full">
          S'inscrire
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Déjà un compte?{' '}
          <Link to="/login" className="text-secondary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default RegisterPage;