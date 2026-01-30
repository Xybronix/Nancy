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
    localStorage.setItem('birthday-videos', JSON.stringify(videos))
  }, [videos])

  const handleVideoAdd = (e) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    if (e.target.files && e.target.files.length > 0) {
      const newVideos = Array.from(e.target.files).map(file => {
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = (event) => {
            resolve({
              id: Date.now() + Math.random(),
              url: event.target.result,
              name: file.name,
              type: file.type
            })
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(newVideos).then(loadedVideos => {
        setVideos([...videos, ...loadedVideos])
      })
    }
  }

  const handleVideoUrl = (e) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    if (e.target.value.trim()) {
      const videoUrl = e.target.value.trim()
      setVideos([...videos, {
        id: Date.now(),
        url: videoUrl,
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
