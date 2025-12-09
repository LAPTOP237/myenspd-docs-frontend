export const APP_NAME = 'MyENSPD Docs';

export const DOCUMENT_STATUS = {
  DISPONIBLE: 'disponible',
  EN_ATTENTE: 'en_attente',
  EN_COURS: 'en_cours',
  VALIDE: 'validee',
  REJETE: 'rejetee',
};

export const DOCUMENT_TYPES = [
  { value: 'attestation_scolarite', label: 'Attestation de scolarité' },
  { value: 'attestation_stage', label: 'Attestation de stage' },
  { value: 'attestation_reussite', label: 'Attestation de réussite' },
  { value: 'releve_notes', label: 'Relevé de notes' },
  { value: 'certificat_inscription', label: 'Certificat d\'inscription' },
  { value: 'lettre_recommandation', label: 'Lettre de recommandation' },
];

export const FILIERES = [
  { value: 'genie_logiciel', label: 'Génie Logiciel' },
  { value: 'genie_civil', label: 'Génie Civil' },
  { value: 'genie_electrique', label: 'Génie Électrique' },
  { value: 'genie_mecanique', label: 'Génie Mécanique' },
  { value: 'genie_proce', label: 'Génie Industriel' },
];

export const NIVEAUX = [
  { value: 'niveau_1', label: 'Niveau 1' },
  { value: 'niveau_2', label: 'Niveau 2' },
  { value: 'niveau_3', label: 'Niveau 3' },
  { value: 'niveau_4', label: 'Niveau 4' },
  { value: 'niveau_5', label: 'Niveau 5' },
];