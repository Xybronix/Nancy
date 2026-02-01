// Gestionnaire IndexedDB pour stocker les gros fichiers (vidéos/images)
// IndexedDB peut stocker plusieurs GB contrairement à localStorage (5-10 MB)

const DB_NAME = 'BirthdaySiteDB'
const DB_VERSION = 1
const STORE_NAMES = {
  VIDEOS: 'videos',
  PHOTOS: 'photos',
  FRIENDS: 'friends',
  HERO_PHOTO: 'heroPhoto'
}

// Ouvrir la base de données
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Créer les object stores s'ils n'existent pas
      if (!db.objectStoreNames.contains(STORE_NAMES.VIDEOS)) {
        db.createObjectStore(STORE_NAMES.VIDEOS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.PHOTOS)) {
        db.createObjectStore(STORE_NAMES.PHOTOS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.FRIENDS)) {
        db.createObjectStore(STORE_NAMES.FRIENDS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.HERO_PHOTO)) {
        db.createObjectStore(STORE_NAMES.HERO_PHOTO, { keyPath: 'id' })
      }
    }
  })
}

// Sauvegarder un fichier dans IndexedDB
export const saveFileToIndexedDB = async (storeName, id, fileData) => {
  try {
    const db = await openDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.put({ id, data: fileData, timestamp: Date.now() })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde dans IndexedDB (${storeName}):`, error)
    throw error
  }
}

// Charger un fichier depuis IndexedDB
export const loadFileFromIndexedDB = async (storeName, id) => {
  try {
    const db = await openDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.data : null)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error(`Erreur lors du chargement depuis IndexedDB (${storeName}):`, error)
    return null
  }
}

// Charger tous les fichiers d'un store
export const loadAllFilesFromIndexedDB = async (storeName) => {
  try {
    const db = await openDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const results = request.result
        const files = {}
        results.forEach(item => {
          files[item.id] = item.data
        })
        resolve(files)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error(`Erreur lors du chargement de tous les fichiers (${storeName}):`, error)
    return {}
  }
}

// Supprimer un fichier de IndexedDB
export const deleteFileFromIndexedDB = async (storeName, id) => {
  try {
    const db = await openDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error(`Erreur lors de la suppression depuis IndexedDB (${storeName}):`, error)
    throw error
  }
}

// Vider un store
export const clearStore = async (storeName) => {
  try {
    const db = await openDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error(`Erreur lors du vidage du store (${storeName}):`, error)
    throw error
  }
}

// Exporter tous les fichiers depuis IndexedDB (pour l'export ZIP)
export const exportAllFilesFromIndexedDB = async () => {
  try {
    const [videos, photos, friends, heroPhoto] = await Promise.all([
      loadAllFilesFromIndexedDB(STORE_NAMES.VIDEOS),
      loadAllFilesFromIndexedDB(STORE_NAMES.PHOTOS),
      loadAllFilesFromIndexedDB(STORE_NAMES.FRIENDS),
      loadAllFilesFromIndexedDB(STORE_NAMES.HERO_PHOTO)
    ])
    
    return {
      videos,
      photos,
      friends,
      heroPhoto: heroPhoto['hero'] || null
    }
  } catch (error) {
    console.error('Erreur lors de l\'export depuis IndexedDB:', error)
    return {
      videos: {},
      photos: {},
      friends: {},
      heroPhoto: null
    }
  }
}

export { STORE_NAMES }
