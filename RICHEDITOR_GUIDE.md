# RichEditor - Guide des fonctionnalités

## Vue d'ensemble

Le RichEditor est un éditeur de texte riche complet, similaire à Microsoft Word, construit avec TipTap et React. Il offre toutes les fonctionnalités essentielles pour créer et éditer des documents professionnels.

---

## Fonctionnalités principales

### 1. Formatage du texte de base
- **Gras** (Ctrl+B)
- *Italique* (Ctrl+I)
- <u>Souligné</u> (Ctrl+U)
- ~~Barré~~
- Exposant (x²)
- Indice (H₂O)

### 2. Police et taille
- Sélection de la police de caractères (Times New Roman, Arial, Courier New, etc.)
- Taille de police personnalisable (8px à 72px)
- Couleur du texte (palette complète)
- Surbrillance du texte (10 couleurs)

### 3. Titres et paragraphes
- Titre 1 (H1) - Pour les titres principaux
- Titre 2 (H2) - Pour les sous-titres
- Titre 3 (H3) - Pour les sections
- Paragraphe normal

### 4. Alignement
- Aligné à gauche
- Centré
- Aligné à droite
- Justifié

### 5. Listes
- Liste à puces
- Liste numérotée
- Augmenter le retrait
- Diminuer le retrait

### 6. Éléments enrichis
- **Images** : Upload et insertion d'images (base64)
- **Liens hypertextes** : Créer des liens cliquables
- **Tableaux** : Insertion de tableaux 3x3 avec en-têtes
- **Citations** : Blocs de citation stylisés
- **Code** : Code inline et blocs de code
- **Ligne horizontale** : Séparateurs visuels

### 7. Outils avancés
- **Annuler/Refaire** (Ctrl+Z / Ctrl+Y)
- **Rechercher et remplacer** (Ctrl+F)
- **Effacer le formatage** : Retirer tous les styles
- **Compteur de mots** : Affichage en temps réel
- **Mode plein écran** : Pour une concentration maximale

### 8. Variables dynamiques
- Insertion de variables `{{NOM_VARIABLE}}`
- Parfait pour les templates de documents

---

## Raccourcis clavier

| Action | Raccourci |
|--------|-----------|
| Gras | Ctrl+B |
| Italique | Ctrl+I |
| Souligné | Ctrl+U |
| Annuler | Ctrl+Z |
| Refaire | Ctrl+Y |
| Rechercher | Ctrl+F |

---

## Styles de tableaux

Les tableaux sont complètement stylisés avec:
- Bordures visibles
- En-têtes grisés
- Sélection de cellules
- Redimensionnement possible

---

## Aperçu en temps réel

L'aperçu du document est mis à jour instantanément dans la section droite de la modal de création de template.

---

## Technologies utilisées

- **TipTap** : Framework d'édition de texte
- **React** : Interface utilisateur
- **Lucide Icons** : Icônes modernes
- **Tailwind CSS** : Styles personnalisés

---

## Améliorations futures possibles

- Export en PDF
- Collaboration en temps réel
- Historique des versions
- Templates prédéfinis
- Insertion de formules mathématiques
- Vérification orthographique
