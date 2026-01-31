// Configuration du site
// Mettez ENABLE_EDITING à false pour désactiver toutes les modifications (sauf les souhaits)
export const SITE_CONFIG = {
  // Activez/désactivez l'édition des contenus
  // true = mode édition (développement)
  // false = mode lecture seule (production)
  ENABLE_EDITING: import.meta.env.VITE_ENABLE_EDITING === 'true' || import.meta.env.VITE_ENABLE_EDITING === undefined,
  
  // Fichier JSON pour sauvegarder les données
  DATA_FILE: '/data/site-data.json',
  
  // Configuration de l'anniversaire
  BIRTHDAY_DAY: 31, // Jour de l'anniversaire (31)
  BIRTHDAY_MONTH: 0, // Mois (0 = janvier, 11 = décembre)
  
  // Nombre de jours après l'anniversaire pour commencer le compteur de l'année suivante
  // Par défaut: 1 jour (le compteur commence le 1er février si l'anniversaire est le 31 janvier)
  COUNTDOWN_START_OFFSET_DAYS: 1,
}
