// Gestionnaire de données pour sauvegarder/charger depuis localStorage et JSON

const STORAGE_KEYS = {
  photos: 'birthday-photos',
  videos: 'birthday-videos',
  wishes: 'birthday-wishes',
  friends: 'birthday-friends',
  contacts: 'birthday-contacts',
  heroPhoto: 'birthday-hero-photo',
}

// Charger depuis localStorage
export const loadFromStorage = (key) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error(`Erreur lors du chargement de ${key}:`, error)
    return null
  }
}

// Sauvegarder dans localStorage
export const saveToStorage = (key, data) => {
  try {
    if (data === null || data === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(data))
    }
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error)
  }
}

// Charger toutes les données depuis localStorage
export const loadAllData = () => {
  return {
    photos: loadFromStorage(STORAGE_KEYS.photos) || [],
    videos: loadFromStorage(STORAGE_KEYS.videos) || [],
    wishes: loadFromStorage(STORAGE_KEYS.wishes) || [],
    friends: loadFromStorage(STORAGE_KEYS.friends) || [],
    contacts: loadFromStorage(STORAGE_KEYS.contacts) || [],
    heroPhoto: loadFromStorage(STORAGE_KEYS.heroPhoto) || null,
  }
}

// Sauvegarder toutes les données dans localStorage
export const saveAllData = (data) => {
  saveToStorage(STORAGE_KEYS.photos, data.photos)
  saveToStorage(STORAGE_KEYS.videos, data.videos)
  saveToStorage(STORAGE_KEYS.wishes, data.wishes)
  saveToStorage(STORAGE_KEYS.friends, data.friends)
  saveToStorage(STORAGE_KEYS.contacts, data.contacts)
  saveToStorage(STORAGE_KEYS.heroPhoto, data.heroPhoto)
}

// Exporter toutes les données en JSON (pour sauvegarde dans le repo)
export const exportDataAsJSON = () => {
  const data = loadAllData()
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'site-data.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return data
}

// Importer des données depuis un fichier JSON
export const importDataFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        saveAllData(data)
        resolve(data)
      } catch (error) {
        reject(new Error('Fichier JSON invalide'))
      }
    }
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
    reader.readAsText(file)
  })
}

// Charger depuis un fichier JSON statique (pour production)
export const loadFromJSONFile = async (filePath) => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      console.warn(`Fichier ${filePath} non trouvé, utilisation de localStorage`)
      return null
    }
    const data = await response.json()
    // Sauvegarder dans localStorage pour synchronisation
    saveAllData(data)
    return data
  } catch (error) {
    console.warn(`Erreur lors du chargement de ${filePath}:`, error)
    return null
  }
}
