import { useState, useEffect, useRef } from 'react'
import { FaPause, FaPlay, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef(null)

  const baseUrl = import.meta.env.BASE_URL || '/'
  const musicUrl = baseUrl === '/' 
    ? '/music/music-anniversaire.mp3' 
    : `${baseUrl}music/music-anniversaire.mp3`.replace(/\/\//g, '/')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleError = (e) => {
      setHasError(true)
      setIsPlaying(false)
    }

    const handleCanPlay = () => {
      setHasError(false)
    }

    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)

    const tryAutoplay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        localStorage.setItem('music-enabled', 'true')
      } catch (err) {
        setIsPlaying(false)
        setupFirstInteractionHandler()
      }
    }

    const setupFirstInteractionHandler = () => {
      const handleFirstInteraction = async () => {
        if (audio.paused) {
          try {
            await audio.play()
            setIsPlaying(true)
            localStorage.setItem('music-enabled', 'true')
          } catch (err) {
            console.error('❌ Impossible de démarrer la musique:', err)
          }
        }
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('touchstart', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
      }

      document.addEventListener('click', handleFirstInteraction, { once: true })
      document.addEventListener('touchstart', handleFirstInteraction, { once: true })
      document.addEventListener('keydown', handleFirstInteraction, { once: true })
    }

    audio.addEventListener('loadstart', () => {
      if (audio.readyState >= 1) {
        tryAutoplay()
      }
    }, { once: true })

    audio.addEventListener('canplay', () => {
      if (audio.paused && !isPlaying) {
        tryAutoplay()
      }
    }, { once: true })

    audio.addEventListener('canplaythrough', tryAutoplay, { once: true })

    if (audio.readyState >= 2) {
      tryAutoplay()
    } else if (audio.readyState >= 1) {
      tryAutoplay()
    }

    const handleEnded = () => {
      audio.currentTime = 0
      audio.play().catch(err => {
        console.error('Erreur lors de la reprise:', err)
      })
    }

    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [musicUrl])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      localStorage.setItem('music-enabled', 'false')
      setIsPlaying(false)
    } else {
      try {
        if (audio.readyState === 0) {
          audio.load()
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Timeout: Le fichier audio prend trop de temps à charger'))
            }, 5000)
            
            const handleCanPlay = () => {
              clearTimeout(timeout)
              audio.removeEventListener('canplay', handleCanPlay)
              audio.removeEventListener('error', handleError)
              resolve()
            }
            
            const handleError = (e) => {
              clearTimeout(timeout)
              audio.removeEventListener('canplay', handleCanPlay)
              audio.removeEventListener('error', handleError)
              reject(new Error(`Fichier audio introuvable: ${musicUrl}. Vérifiez que le fichier existe dans public/music/music-anniversaire.mp3`))
            }
            
            audio.addEventListener('canplay', handleCanPlay, { once: true })
            audio.addEventListener('error', handleError, { once: true })
          })
        }
        
        await audio.play()
        localStorage.setItem('music-enabled', 'true')
        setIsPlaying(true)
        setHasError(false)
      } catch (err) {
        console.error('Erreur lors de la lecture de la musique:', err)
        setHasError(true)
        setIsPlaying(false)
        
        const errorMessage = err.message.includes('introuvable') 
          ? err.message 
          : `Impossible de lire la musique.\n\nChemin attendu: ${musicUrl}\n\nVérifiez que:\n1. Le fichier existe dans public/music\n2. Le nom du fichier est exactement "music-anniversaire.mp3"\n3. Le fichier n'est pas corrompu`
        
        alert(errorMessage)
      }
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        style={{ display: 'none' }}
      />
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-primary-red hover:bg-secondary-red text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white dark:border-black"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <FaPause className="w-6 h-6" />
          ) : (
            <FaPlay className="w-6 h-6 ml-1" />
          )}
        </button>
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 text-white dark:text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border border-white/50 dark:border-black/50"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <FaVolumeMute className="w-5 h-5" />
            ) : (
              <FaVolumeUp className="w-5 h-5" />
            )}
          </button>
        )}
        {hasError && (
          <div className="absolute bottom-16 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Erreur de chargement
          </div>
        )}
      </div>
    </>
  )
}

export default BackgroundMusic
