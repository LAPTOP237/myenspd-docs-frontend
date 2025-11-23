import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Hash, BookOpen, Edit3, Save, Lock, Camera, Shield } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { profileService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
    }
  });

  const passwordForm = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await profileService.update(data);
      updateUser(res.user);
      toast.success('Profil mis à jour avec succès!');
      setEditing(false);
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await profileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Mot de passe modifié avec succès!');
      setShowPasswordModal(false);
      passwordForm.reset();
    } catch {
      toast.error('Erreur lors du changement de mot de passe');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Edit3 className="w-4 h-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={loading}>
              <Save className="w-4 h-4" />
              Enregistrer
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.prenom} {user?.nom}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {user?.matricule}
              </span>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                {user?.niveau}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Nom"
              icon={User}
              disabled={!editing}
              error={errors.nom?.message}
              {...register('nom', { required: 'Le nom est requis' })}
            />
            <Input
              label="Prénom"
              disabled={!editing}
              error={errors.prenom?.message}
              {...register('prenom', { required: 'Le prénom est requis' })}
            />
            <Input
              label="Email"
              type="email"
              icon={Mail}
              disabled
              {...register('email')}
            />
            <Input
              label="Téléphone"
              type="tel"
              placeholder="+237 6XX XXX XXX"
              disabled={!editing}
              {...register('telephone')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <Input
              label="Matricule"
              icon={Hash}
              value={user?.matricule || ''}
              disabled
            />
            <Input
              label="Filière"
              icon={BookOpen}
              value={user?.filiere || ''}
              disabled
            />
          </div>
        </form>
      </Card>

      {/* Security Card */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mot de passe</p>
                <p className="text-sm text-gray-500">Dernière modification: il y a 30 jours</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Changer le mot de passe"
        size="md"
      >
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            {...passwordForm.register('currentPassword', { required: true })}
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            helperText="Minimum 8 caractères avec majuscule, minuscule et chiffre"
            {...passwordForm.register('newPassword', { 
              required: true,
              minLength: 8,
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
            })}
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            {...passwordForm.register('confirmPassword', { required: true })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setShowPasswordModal(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              Confirmer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;