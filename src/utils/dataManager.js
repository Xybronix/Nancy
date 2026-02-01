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

// Convertir base64 en Blob
const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64.split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

// Obtenir l'extension de fichier depuis le type MIME
const getFileExtension = (mimeType, defaultExt = 'bin') => {
  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogg',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
  }
  return mimeMap[mimeType] || defaultExt
}

// Exporter toutes les données en ZIP avec fichiers (images/vidéos)
// OPTIMISÉ pour gérer des centaines de GB sans limitation
export const exportDataAsZIP = async () => {
  const JSZip = (await import('jszip')).default
  const { exportAllFilesFromIndexedDB, STORE_NAMES } = await import('./indexedDBManager')
  
  const zip = new JSZip()
  const data = loadAllData()
  const timestamp = Date.now()
  let fileCounter = 0
  
  // Charger tous les fichiers depuis IndexedDB (peut contenir des GB)
  const indexedDBFiles = await exportAllFilesFromIndexedDB()
  
  // Créer les dossiers
  const imagesFolder = zip.folder('data/images')
  const videosFolder = zip.folder('data/videos')
  
  // Préparer les données avec références aux fichiers
  const exportData = {
    photos: [],
    videos: [],
    wishes: data.wishes || [],
    friends: [],
    contacts: data.contacts || [],
    heroPhoto: null,
  }
  
  // Traiter les photos (depuis localStorage ou IndexedDB)
  if (data.photos && Array.isArray(data.photos)) {
    for (const photo of data.photos) {
      let photoData = photo.url
      
      // Si la photo est dans IndexedDB, la charger
      if (photo.id && indexedDBFiles.photos[photo.id]) {
        photoData = indexedDBFiles.photos[photo.id]
      }
      
      if (photoData && photoData.startsWith('data:')) {
        // Extraire le type MIME
        const mimeMatch = photoData.match(/data:([^;]+);base64,/)
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
        const extension = getFileExtension(mimeType, 'jpg')
        
        // Nom de fichier unique avec compteur
        fileCounter++
        const fileName = `photo_${photo.id || fileCounter}_${timestamp}_${fileCounter}.${extension}`
        const filePath = `images/${fileName}`
        
        // Convertir base64 en Blob et ajouter au ZIP (optimisé pour gros fichiers)
        const blob = base64ToBlob(photoData, mimeType)
        imagesFolder.file(fileName, blob)
        
        // Référencer le fichier dans le JSON
        exportData.photos.push({
          id: photo.id,
          url: `/data/${filePath}`,
          name: photo.name || fileName
        })
      } else if (photo.url && !photo.url.startsWith('data:') && !photo.url.startsWith('indexeddb://')) {
        // URL externe, garder tel quel
        exportData.photos.push(photo)
      }
    }
  }
  
  // Traiter les vidéos (depuis localStorage ou IndexedDB)
  if (data.videos && Array.isArray(data.videos)) {
    for (const video of data.videos) {
      if (video.type === 'external') {
        // URL externe, garder tel quel
        exportData.videos.push(video)
        continue
      }
      
      let videoData = video.url
      
      // Si la vidéo est dans IndexedDB, la charger
      if (video.id && indexedDBFiles.videos[video.id]) {
        videoData = indexedDBFiles.videos[video.id]
      } else if (video.url && video.url.startsWith('indexeddb://')) {
        // Charger depuis IndexedDB si c'est une référence
        const videoId = video.url.replace('indexeddb://', '')
        const indexedData = await (await import('./indexedDBManager')).loadFileFromIndexedDB(STORE_NAMES.VIDEOS, videoId)
        if (indexedData) {
          videoData = indexedData
        }
      }
      
      if (videoData && videoData.startsWith('data:')) {
        // Extraire le type MIME
        const mimeMatch = videoData.match(/data:([^;]+);base64,/)
        const mimeType = mimeMatch ? mimeMatch[1] : (video.type || 'video/mp4')
        const extension = getFileExtension(mimeType, 'mp4')
        
        // Nom de fichier unique avec compteur
        fileCounter++
        const fileName = `video_${video.id || fileCounter}_${timestamp}_${fileCounter}.${extension}`
        const filePath = `videos/${fileName}`
        
        // Convertir base64 en Blob et ajouter au ZIP (optimisé pour gros fichiers)
        const blob = base64ToBlob(videoData, mimeType)
        videosFolder.file(fileName, blob)
        
        // Référencer le fichier dans le JSON
        exportData.videos.push({
          id: video.id,
          url: `/data/${filePath}`,
          name: video.name || fileName,
          type: mimeType
        })
      }
    }
  }
  
  // Traiter les photos d'amies
  if (data.friends && Array.isArray(data.friends)) {
    for (const friend of data.friends) {
      let friendPhoto = friend.photo
      
      // Si la photo est dans IndexedDB, la charger
      if (friend.id && indexedDBFiles.friends[friend.id]) {
        friendPhoto = indexedDBFiles.friends[friend.id]
      }
      
      if (friendPhoto && friendPhoto.startsWith('data:')) {
        const mimeMatch = friendPhoto.match(/data:([^;]+);base64,/)
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
        const extension = getFileExtension(mimeType, 'jpg')
        
        fileCounter++
        const fileName = `friend_${friend.id || fileCounter}_${timestamp}_${fileCounter}.${extension}`
        const filePath = `images/${fileName}`
        
        const blob = base64ToBlob(friendPhoto, mimeType)
        imagesFolder.file(fileName, blob)
        
        exportData.friends.push({
          id: friend.id,
          photo: `/data/${filePath}`,
          name: friend.name || 'Ami(e)'
        })
      } else {
        exportData.friends.push(friend)
      }
    }
  }
  
  // Traiter la photo hero
  let heroPhotoData = data.heroPhoto
  if (indexedDBFiles.heroPhoto) {
    heroPhotoData = indexedDBFiles.heroPhoto
  }
  
  if (heroPhotoData && heroPhotoData.startsWith('data:')) {
    const mimeMatch = heroPhotoData.match(/data:([^;]+);base64,/)
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const extension = getFileExtension(mimeType, 'jpg')
    
    fileCounter++
    const fileName = `hero_${timestamp}_${fileCounter}.${extension}`
    const filePath = `images/${fileName}`
    
    const blob = base64ToBlob(heroPhotoData, mimeType)
    imagesFolder.file(fileName, blob)
    
    exportData.heroPhoto = `/data/${filePath}`
  } else if (data.heroPhoto && !data.heroPhoto.startsWith('indexeddb://')) {
    exportData.heroPhoto = data.heroPhoto
  }
  
  // Ajouter le JSON au ZIP
  zip.file('data/site-data.json', JSON.stringify(exportData, null, 2))
  
  // Générer le ZIP avec compression optimisée pour gros fichiers
  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 } // Niveau de compression équilibré
  })
  
  // Télécharger le ZIP
  const url = URL.createObjectURL(zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `site-data-${new Date().toISOString().split('T')[0]}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  return exportData
}

// Exporter toutes les données en JSON (pour sauvegarde dans le repo) - Version simple
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

// Charger une image/vidéo depuis un fichier
const loadFileAsDataURL = async (filePath) => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) return null
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn(`Erreur lors du chargement de ${filePath}:`, error)
    return null
  }
}

// Convertir les références de fichiers en data URLs pour compatibilité
const convertFileReferencesToDataURLs = async (data) => {
  const converted = { ...data }
  
  // Convertir les photos
  if (converted.photos && Array.isArray(converted.photos)) {
    converted.photos = await Promise.all(
      converted.photos.map(async (photo) => {
        if (photo.url && photo.url.startsWith('/data/')) {
          const dataUrl = await loadFileAsDataURL(photo.url)
          return { ...photo, url: dataUrl || photo.url }
        }
        return photo
      })
    )
  }
  
  // Convertir les vidéos
  if (converted.videos && Array.isArray(converted.videos)) {
    converted.videos = await Promise.all(
      converted.videos.map(async (video) => {
        if (video.url && video.url.startsWith('/data/') && video.type !== 'external') {
          const dataUrl = await loadFileAsDataURL(video.url)
          return { ...video, url: dataUrl || video.url }
        }
        return video
      })
    )
  }
  
  // Convertir les photos d'amies
  if (converted.friends && Array.isArray(converted.friends)) {
    converted.friends = await Promise.all(
      converted.friends.map(async (friend) => {
        if (friend.photo && friend.photo.startsWith('/data/')) {
          const dataUrl = await loadFileAsDataURL(friend.photo)
          return { ...friend, photo: dataUrl || friend.photo }
        }
        return friend
      })
    )
  }
  
  // Convertir la photo hero
  if (converted.heroPhoto && converted.heroPhoto.startsWith('/data/')) {
    converted.heroPhoto = await loadFileAsDataURL(converted.heroPhoto) || converted.heroPhoto
  }
  
  return converted
}

// Charger depuis un fichier JSON statique (pour production)
// IMPORTANT: Ne remplace PAS les données localStorage existantes
// Utilisé uniquement comme données initiales si localStorage est vide
export const loadFromJSONFile = async (filePath) => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      console.warn(`Fichier ${filePath} non trouvé, utilisation de localStorage`)
      return null
    }
    const data = await response.json()
    
    // Convertir les références de fichiers en data URLs si nécessaire
    const convertedData = await convertFileReferencesToDataURLs(data)
    
    // Vérifier si localStorage contient déjà des données
    const existingData = loadAllData()
    const hasExistingData = Object.values(existingData).some(v => {
      if (v === null || v === undefined) return false
      if (Array.isArray(v)) return v.length > 0
      return true
    })
    
    // Si localStorage est vide, charger les données du JSON
    // Sinon, NE PAS écraser les données existantes (ajoutées en ligne)
    if (!hasExistingData) {
      console.log('localStorage vide, chargement des données initiales depuis JSON')
      saveAllData(convertedData)
      return convertedData
    } else {
      console.log('Données existantes dans localStorage, conservation des données en ligne')
      // Retourner les données existantes, pas celles du JSON
      return existingData
    }
  } catch (error) {
    console.warn(`Erreur lors du chargement de ${filePath}:`, error)
    return null
  }
}
