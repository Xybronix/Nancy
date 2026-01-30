import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaVideo } from 'react-icons/fa'
import './VideoSection.css'

const VideoSection = () => {
  const { isDark } = useTheme()
  const [videos, setVideos] = useState([])

  const handleVideoAdd = (e) => {
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
    setVideos(videos.filter(video => video.id !== id))
  }

  return (
    <section id="videos" className="section video-section">
      <div className="container">
        <h2 className="section-title">Vidéos</h2>
        <p className="section-description">
          Partage tes moments vidéo préférés
        </p>

        <div className="video-input-section">
          <label className="video-upload-btn">
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoAdd}
              style={{ display: 'none' }}
            />
            <FaVideo /> Ajouter des vidéos
          </label>
          
          <div className="video-url-input">
            <input
              type="text"
              placeholder="Ou colle l'URL d'une vidéo (YouTube, Vimeo, etc.)"
              onKeyPress={(e) => e.key === 'Enter' && handleVideoUrl(e)}
            />
            <button onClick={(e) => handleVideoUrl({ target: e.target.previousElementSibling })}>
              Ajouter
            </button>
          </div>
        </div>

        <div className="video-grid">
          {videos.map((video, index) => (
            <div key={video.id} className="video-item" style={{ animationDelay: `${index * 0.1}s` }}>
              {video.type === 'external' ? (
                <div className="video-embed">
                  <iframe
                    src={video.url}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <video controls className="video-player">
                  <source src={video.url} type={video.type} />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
              <button className="remove-btn" onClick={() => removeVideo(video.id)}>×</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideoSection
