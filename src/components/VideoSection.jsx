import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaVideo } from 'react-icons/fa'
import { SITE_CONFIG } from '../config/siteConfig'
import { saveFileToIndexedDB, loadFileFromIndexedDB, deleteFileFromIndexedDB, STORE_NAMES } from '../utils/indexedDBManager'

const VideoSection = () => {
  const { isDark } = useTheme()
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('birthday-videos')
    return saved ? JSON.parse(saved) : []
  })

  // Charger les données depuis IndexedDB au montage
  useEffect(() => {
    const loadVideosFromIndexedDB = async () => {
      // Pour les vidéos locales stockées dans IndexedDB, charger les données
      const videosWithData = await Promise.all(
        videos.map(async (video) => {
          // Si c'est une URL externe, garder tel quel
          if (video.type === 'external' || (video.url && !video.url.startsWith('indexeddb://'))) {
            return video
          }
          
          // Si c'est une référence IndexedDB, charger les données
          if (video.isInIndexedDB !== false) {
            const fileData = await loadFileFromIndexedDB(STORE_NAMES.VIDEOS, video.id)
            if (fileData) {
              return { ...video, url: fileData }
            }
          }
          
          return video
        })
      )
      
      // Mettre à jour seulement si on a chargé des données depuis IndexedDB
      const hasNewData = videosWithData.some((v, i) => v.url !== videos[i]?.url)
      if (hasNewData) {
        setVideos(videosWithData)
      }
    }
    
    if (videos.length > 0) {
      loadVideosFromIndexedDB()
    }
  }, []) // Seulement au montage

  // Sauvegarder seulement les métadonnées dans localStorage (pas les fichiers)
  useEffect(() => {
    try {
      // Sauvegarder seulement les métadonnées (sans les data URLs)
      // Les fichiers sont dans IndexedDB, pas dans localStorage
      const metadata = videos.map(v => ({
        id: v.id,
        name: v.name,
        type: v.type,
        size: v.size,
        isInIndexedDB: v.isInIndexedDB !== false, // Par défaut true si pas défini
        url: v.type === 'external' ? v.url : (v.url && !v.url.startsWith('data:') ? v.url : 'indexeddb://' + v.id)
      }))
      localStorage.setItem('birthday-videos', JSON.stringify(metadata))
    } catch (error) {
      // Si localStorage est plein, ce n'est pas grave, on a IndexedDB
      // Ne pas afficher d'erreur, juste logger
      console.warn('Impossible de sauvegarder les métadonnées dans localStorage (IndexedDB utilisé):', error)
    }
  }, [videos])

  const handleVideoAdd = (e) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    if (e.target.files && e.target.files.length > 0) {
      const MAX_FILE_SIZE = 256 * 1024 * 1024 // 256 MB max par vidéo
      const files = Array.from(e.target.files).filter(file => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`La vidéo "${file.name}" est trop grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Taille maximale : 256 MB.`)
          return false
        }
        return true
      })

      if (files.length === 0) return

      const newVideos = files.map(async (file) => {
        const videoId = Date.now() + Math.random()
        
        try {
          // Lire le fichier en base64 pour l'affichage immédiat
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onerror = () => reject(new Error(`Erreur lors de la lecture du fichier "${file.name}"`))
            reader.onload = (event) => resolve(event.target.result)
            reader.readAsDataURL(file)
          })
          
          // Sauvegarder dans IndexedDB pour le stockage long terme
          try {
            await saveFileToIndexedDB(STORE_NAMES.VIDEOS, videoId, dataUrl)
          } catch (indexedDBError) {
            console.warn('Impossible de sauvegarder dans IndexedDB, utilisation de localStorage:', indexedDBError)
            // Continuer même si IndexedDB échoue
          }
          
          return {
            id: videoId,
            url: dataUrl, // Pour l'affichage immédiat
            name: file.name,
            type: file.type || 'video/mp4',
            size: file.size,
            isInIndexedDB: true
          }
        } catch (error) {
          throw new Error(`Erreur lors du traitement de "${file.name}": ${error.message}`)
        }
      })

      Promise.all(newVideos)
        .then(loadedVideos => {
          setVideos([...videos, ...loadedVideos])
        })
        .catch(error => {
          console.error('Erreur lors du chargement des vidéos:', error)
          alert(`Erreur lors du chargement de la vidéo : ${error.message}\n\nVérifiez que le fichier est bien une vidéo valide.`)
        })
    }
  }

  // Convertir les URLs YouTube/Vimeo en URLs embed
  const convertToEmbedUrl = (url) => {
    try {
      // Nettoyer l'URL
      url = url.trim()
      
      // YouTube - format standard
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url)
        const videoId = urlObj.searchParams.get('v')
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`
        }
      }
      
      // YouTube - format court
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0]
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`
        }
      }
      
      // YouTube - format mobile
      if (url.includes('m.youtube.com/watch')) {
        const urlObj = new URL(url)
        const videoId = urlObj.searchParams.get('v')
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`
        }
      }
      
      // Vimeo
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0]
        if (videoId && !isNaN(videoId)) {
          return `https://player.vimeo.com/video/${videoId}`
        }
      }
      
      // Dailymotion
      if (url.includes('dailymotion.com/video/')) {
        const videoId = url.split('dailymotion.com/video/')[1]?.split('?')[0]?.split('_')[0]
        if (videoId) {
          return `https://www.dailymotion.com/embed/video/${videoId}`
        }
      }
      
      // Si c'est déjà une URL embed, la retourner telle quelle
      if (url.includes('/embed/') || url.includes('player.')) {
        return url
      }
      
      // Si c'est une URL directe vers un fichier vidéo (mp4, webm, etc.)
      if (url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i)) {
        return url
      }
      
      // Sinon, retourner l'URL telle quelle (peut être une URL directe)
      return url
    } catch (error) {
      console.error('Erreur lors de la conversion de l\'URL:', error)
      // En cas d'erreur, retourner l'URL originale
      return url
    }
  }

  const handleVideoUrl = (e) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    if (e.target.value.trim()) {
      const videoUrl = e.target.value.trim()
      const embedUrl = convertToEmbedUrl(videoUrl)
      setVideos([...videos, {
        id: Date.now(),
        url: embedUrl,
        name: 'Vidéo externe',
        type: 'external'
      }])
      e.target.value = ''
    }
  }

  const removeVideo = async (id) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    
    // Supprimer de IndexedDB
    try {
      await deleteFileFromIndexedDB(STORE_NAMES.VIDEOS, id)
    } catch (error) {
      console.warn('Erreur lors de la suppression depuis IndexedDB:', error)
    }
    
    // Supprimer de la liste
    setVideos(videos.filter(video => video.id !== id))
  }

  return (
    <section id="videos" className="py-20 px-5 min-h-screen bg-gradient-to-b from-[#1a0000] to-black dark:from-white dark:to-light-red">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-center mb-12 relative inline-block w-full text-white dark:text-black after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary-red after:to-black dark:after:from-primary-red dark:after:to-white after:rounded">
          Vidéos
        </h2>
        <p className="text-xl md:text-lg sm:text-base text-center mb-12 text-light-red dark:text-black">
          Partage tes moments vidéo préférés
        </p>

        {SITE_CONFIG.ENABLE_EDITING && (
          <div className="flex flex-col gap-5 mb-12 items-center">
            <label className="inline-flex items-center gap-2.5 px-10 py-4 bg-primary-red text-white border-none rounded-full cursor-pointer font-bold text-lg transition-all hover:bg-secondary-red hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(220,38,38,0.4)] uppercase tracking-wider">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoAdd}
                className="hidden"
              />
              <FaVideo className="w-5 h-5" /> Ajouter des vidéos
            </label>
            
            <div className="flex gap-2.5 w-full max-w-[600px] md:flex-col">
              <input
                type="text"
                placeholder="Ou colle l'URL d'une vidéo (YouTube, Vimeo, etc.)"
                className="flex-1 px-5 py-4 border-2 border-primary-red rounded-full bg-white/10 dark:bg-white/90 text-white dark:text-black text-base outline-none transition-all focus:border-secondary-red focus:bg-white/15 dark:focus:bg-white placeholder:text-white/60 dark:placeholder:text-black/50"
                onKeyPress={(e) => e.key === 'Enter' && handleVideoUrl(e)}
              />
              <button
                className="px-8 py-4 bg-primary-red text-white border-none rounded-full cursor-pointer font-bold transition-all hover:bg-secondary-red hover:-translate-y-0.5"
                onClick={(e) => handleVideoUrl({ target: e.target.previousElementSibling })}
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] md:grid-cols-1 gap-8 mt-10">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="relative rounded-2xl overflow-hidden border-[3px] border-primary-red transition-transform hover:scale-[1.02] bg-black animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {video.type === 'external' ? (
                <div className="relative pb-[56.25%] h-0 overflow-hidden">
                  <iframe
                    src={video.url}
                    title={video.name}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <video controls className="w-full h-auto block">
                  <source src={video.url} type={video.type} />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
              {SITE_CONFIG.ENABLE_EDITING && (
                <button
                  className="absolute top-2.5 right-2.5 w-9 h-9 bg-[rgba(220,38,38,0.9)] text-white border-none rounded-full text-2xl cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-red"
                  onClick={() => removeVideo(video.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideoSection
