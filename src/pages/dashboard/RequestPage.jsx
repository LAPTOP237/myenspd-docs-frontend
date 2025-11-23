import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { requestService } from '../../services/api';
import { useToast } from '../../context/useToast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';

const documentTypes = [
  { value: 'attestation_scolarite', label: 'Attestation de scolarité' },
  { value: 'attestation_stage', label: 'Attestation de stage' },
  { value: 'attestation_reussite', label: 'Attestation de réussite' },
  { value: 'releve_notes', label: 'Relevé de notes' },
  { value: 'certificat_inscription', label: 'Certificat d\'inscription' },
  { value: 'lettre_recommandation', label: 'Lettre de recommandation' },
  { value: 'fiche_pre_inscription', label: 'Fiche de pré-inscription' },
  { value: 'autre', label: 'Autre document' },
];

const motifOptions = [
  { value: 'stage', label: 'Stage' },
  { value: 'emploi', label: 'Recherche d\'emploi' },
  { value: 'poursuite_etudes', label: 'Poursuite d\'études' },
  { value: 'administratif', label: 'Démarche administrative' },
  { value: 'bourse', label: 'Demande de bourse' },
  { value: 'autre', label: 'Autre' },
];

export const RequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { type: '', motif: '', details: '', urgence: false }
  });

  const selectedType = watch('type');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await requestService.create(data);
      toast.success('Demande envoyée avec succès!');
      setSubmitted(true);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Demande de document</h1>

      {/* Info Card */}
      <Card className="p-5 bg-info-light border-info/20">
        <div className="flex gap-4">
          <Info className="w-6 h-6 text-info flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-info-dark">Information importante</h3>
            <p className="text-sm text-info-dark/80 mt-1">
              Le délai de traitement standard est de 3 à 5 jours ouvrables. 
              Vous recevrez une notification par email dès que votre document sera prêt.
              Les demandes urgentes peuvent être traitées en 24-48h.
            </p>
          </div>
        </div>
      </Card>

      {/* Success Message */}
      {submitted && (
        <Card className="p-5 bg-success-light border-success/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-success-dark">Demande envoyée!</h3>
              <p className="text-sm text-success-dark/80 mt-1">
                Votre demande a été enregistrée. Vous pouvez suivre son statut dans la section "Mes Documents".
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => setSubmitted(false)}
          >
            Faire une nouvelle demande
          </Button>
        </Card>
      )}

      {/* Form */}
      {!submitted && (
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Document Type */}
            <Select
              label="Type de document"
              options={documentTypes}
              placeholder="Sélectionnez le type de document"
              error={errors.type?.message}
              required
              {...register('type', { required: 'Veuillez sélectionner un type de document' })}
            />

            {/* Dynamic info based on type */}
            {selectedType && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {documentTypes.find(d => d.value === selectedType)?.label}
                    </p>
                    <p className="text-sm text-gray-500">
                      Délai estimé: 3-5 jours ouvrables
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Motif */}
            <Select
              label="Motif de la demande"
              options={motifOptions}
              placeholder="Pourquoi avez-vous besoin de ce document?"
              error={errors.motif?.message}
              required
              {...register('motif', { required: 'Veuillez indiquer le motif' })}
            />

            {/* Additional Details */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Informations complémentaires
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                rows={4}
                placeholder="Précisez toute information utile pour votre demande (période concernée, destinataire, etc.)..."
                {...register('details')}
              />
            </div>

            {/* Urgence */}
            <div className="flex items-start gap-3 p-4 bg-warning-light/50 rounded-lg border border-warning/20">
              <input
                type="checkbox"
                id="urgence"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-warning focus:ring-warning"
                {...register('urgence')}
              />
              <label htmlFor="urgence" className="cursor-pointer">
                <span className="font-medium text-warning-dark flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Demande urgente
                </span>
                <p className="text-sm text-warning-dark/70 mt-1">
                  Cochez cette case si vous avez besoin du document en moins de 48h. 
                  Des frais supplémentaires peuvent s'appliquer.
                </p>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => reset()}
              >
                Réinitialiser
              </Button>
              <Button 
                type="submit" 
                loading={loading} 
                className="flex-1"
              >
                <Plus className="w-4 h-4" />
                Envoyer la demande
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Recent Requests */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Historique de vos demandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Attestation de stage', date: '18 Mars 2024', status: 'en_cours' },
              { type: 'Relevé de notes S2', date: '10 Mars 2024', status: 'validee' },
              { type: 'Lettre de recommandation', date: '5 Mars 2024', status: 'validee' },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{req.type}</p>
                  <p className="text-sm text-gray-500">{req.date}</p>
                </div>
                <Badge variant={req.status === 'validee' ? 'success' : 'info'}>
                  {req.status === 'validee' ? 'Validée' : 'En cours'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestPage;