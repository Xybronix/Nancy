import { useState, useEffect, useRef } from 'react'
import { FaMusic, FaPause, FaPlay } from 'react-icons/fa'

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

  // URL de la musique Naza - "Aujourd'hui c'est ton jour, c'est ton anniversaire"
  // Option 1 : Utiliser un fichier local (recommandé)
  // Placez le fichier audio dans public/music/naza-anniversaire.mp3
  const musicUrl = '/music/naza-anniversaire.mp3'
  
  // Option 2 : Utiliser une URL directe vers un fichier audio
  // const musicUrl = 'https://example.com/path/to/music.mp3'
  
  // Option 3 : Pour YouTube, utilisez un service de conversion ou téléchargez le fichier
  // Note : YouTube ne permet pas la lecture directe via l'élément <audio>

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Charger la préférence de l'utilisateur
    const savedPreference = localStorage.getItem('music-enabled')
    if (savedPreference === 'true') {
      audio.play().catch(err => {
        console.log('Autoplay bloqué, l\'utilisateur devra cliquer pour démarrer')
      })
      setIsPlaying(true)
    }

    const handleEnded = () => {
      // Rejouer en boucle
      audio.currentTime = 0
      audio.play()
    }

    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      localStorage.setItem('music-enabled', 'false')
    } else {
      audio.play().catch(err => {
        console.error('Erreur lors de la lecture de la musique:', err)
        // Si la musique ne peut pas être lue, afficher un message
        alert('La musique ne peut pas être lue. Vérifiez que le fichier existe dans public/music/naza-anniversaire.mp3')
      })
      localStorage.setItem('music-enabled', 'true')
    }
    setIsPlaying(!isPlaying)
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
            <FaMusic className={`w-5 h-5 ${isMuted ? 'opacity-50' : ''}`} />
          </button>
        )}
      </div>
    </>
  )
}

export default BackgroundMusic
