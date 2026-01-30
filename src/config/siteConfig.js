// Configuration du site
// Mettez ENABLE_EDITING à false pour désactiver toutes les modifications (sauf les souhaits)
export const SITE_CONFIG = {
  // Activez/désactivez l'édition des contenus
  // true = mode édition (développement)
  // false = mode lecture seule (production)
  ENABLE_EDITING: import.meta.env.VITE_ENABLE_EDITING === 'true' || import.meta.env.VITE_ENABLE_EDITING === undefined,
  
  // Fichier JSON pour sauvegarder les données
  DATA_FILE: '/data/site-data.json',
}
