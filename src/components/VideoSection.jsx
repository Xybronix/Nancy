import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaVideo } from 'react-icons/fa'
import { SITE_CONFIG } from '../config/siteConfig'

const VideoSection = () => {
  const { isDark } = useTheme()
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('birthday-videos')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    try {
      localStorage.setItem('birthday-videos', JSON.stringify(videos))
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert('Espace de stockage insuffisant. Veuillez supprimer certaines vidéos.')
        // Retirer la dernière vidéo ajoutée
        setVideos(prev => prev.slice(0, -1))
      } else {
        console.error('Erreur lors de la sauvegarde:', error)
      }
    }
  }, [videos])

  const handleVideoAdd = (e) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    if (e.target.files && e.target.files.length > 0) {
      const MAX_FILE_SIZE = 75 * 1024 * 1024 // 75 MB max par vidéo
      const files = Array.from(e.target.files).filter(file => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`La vidéo "${file.name}" est trop grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Taille maximale : 75 MB.`)
          return false
        }
        return true
      })

      if (files.length === 0) return

      const newVideos = files.map(file => {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
          reader.onerror = () => {
            reject(new Error(`Erreur lors de la lecture du fichier "${file.name}"`))
          }
          reader.onload = (event) => {
            try {
              const dataUrl = event.target.result
              // Vérifier la taille des données encodées (base64 augmente la taille d'environ 33%)
              // localStorage a généralement une limite de 5-10MB, mais on essaie quand même pour les fichiers jusqu'à 75MB
              // Si ça échoue, on gérera l'erreur dans le catch
              resolve({
                id: Date.now() + Math.random(),
                url: dataUrl,
                name: file.name,
                type: file.type || 'video/mp4', // Type par défaut si non détecté
                size: file.size
              })
            } catch (error) {
              reject(new Error(`Erreur lors du traitement de "${file.name}": ${error.message}`))
            }
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(newVideos)
        .then(loadedVideos => {
          try {
            setVideos([...videos, ...loadedVideos])
          } catch (error) {
            if (error.name === 'QuotaExceededError') {
              alert('Espace de stockage insuffisant. Les vidéos locales sont limitées par le navigateur. Veuillez supprimer certaines vidéos ou utiliser des URLs externes (YouTube, Vimeo, etc.) pour les grandes vidéos.')
            } else {
              alert('Erreur lors de l\'ajout des vidéos: ' + error.message)
            }
          }
        })
        .catch(error => {
          console.error('Erreur lors du chargement des vidéos:', error)
          // Afficher un message d'erreur plus informatif
          if (error.message.includes('trop volumineux') || error.message.includes('QuotaExceeded')) {
            alert(`Impossible d'ajouter la vidéo : ${error.message}\n\nConseil : Pour les vidéos de plus de 10-15 MB, utilisez plutôt une URL externe (YouTube, Vimeo) ou hébergez-la sur un service de stockage en ligne.`)
          } else {
            alert(`Erreur lors du chargement de la vidéo : ${error.message}\n\nVérifiez que le fichier est bien une vidéo valide.`)
          }
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

  const removeVideo = (id) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
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
