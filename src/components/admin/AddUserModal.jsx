import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { userService } from '../../services/api';

const AddUserModal = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await userService.create(data);
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Dialog.Panel className="bg-white rounded-xl w-full max-w-md p-6">
        <Dialog.Title className="text-xl font-bold mb-4">Ajouter un utilisateur</Dialog.Title>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('first_name', { required: true })} placeholder="Prénom" className="w-full border rounded-lg p-2" />
          <input {...register('last_name', { required: true })} placeholder="Nom" className="w-full border rounded-lg p-2" />
          <input {...register('email', { required: true })} placeholder="Email" className="w-full border rounded-lg p-2" />
          <input {...register('matricule')} placeholder="Matricule (facultatif)" className="w-full border rounded-lg p-2" />
          <select {...register('role')} className="w-full border rounded-lg p-2">
            <option value="STUDENT">Étudiant</option>
            <option value="STAFF">Personnel</option>
          </select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default AddUserModal;
