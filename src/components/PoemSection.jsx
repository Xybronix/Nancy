import { useState, useEffect } from 'react'
import { FaHeart, FaStar } from 'react-icons/fa'
import { GiPartyPopper, GiSparkles } from 'react-icons/gi'

const PoemSection = () => {
  const [showPoem, setShowPoem] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)

  const poem = [
    "En ce doux jour du trente-et-un janvier,",
    "S'éveille un chant d'amour pour te fêter,",
    "Tchounga Sani Nancy Ranaise, ô toi si belle,",
    "Reçois ces mots qui montent jusqu'au ciel.",
    "",
    "Que cette année soit un jardin fleuri,",
    "Où chaque rose porte le nom du bonheur,",
    "Où le soleil caresse tes jours bénis,",
    "Et la lune veille sur les rêves de ton cœur.",
    "",
    "Que l'amour t'enlace de ses bras de soie,",
    "Que le succès danse sur chacun de tes pas,",
    "Que la joie murmure doucement à ton oreille,",
    "Des promesses tendres, des matins vermeils.",
    "",
    "Que les étoiles tracent pour toi des chemins,",
    "Semés de rires, de lumière et de grâce,",
    "Que chaque instant soit un précieux écrin,",
    "Où le temps suspend sa course et t'embrasse.",
    "",
    "Joyeux anniversaire, douce Nancy chérie,",
    "Que ton année soit un poème infini. 🌹",
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPoem(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showPoem && currentLine < poem.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [showPoem, currentLine, poem.length])

  return (
    <section id="poem" className="py-20 px-5 min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-red via-[#1a0000] to-black dark:from-light-red dark:via-white dark:to-primary-red relative overflow-hidden">
      {/* Étoiles animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <FaStar className="text-gold text-xl opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-8 animate-bounce">
          <GiPartyPopper className="text-6xl text-gold mx-auto" />
        </div>
        
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold mb-12 text-white dark:text-black animate-pulse-slow">
          Un Poème pour Toi
        </h2>

        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-3xl p-8 md:p-6 border-4 border-primary-red shadow-2xl">
          <div className="space-y-4 text-left">
            {poem.map((line, index) => (
              <p
                key={index}
                className={`text-2xl md:text-xl sm:text-lg leading-relaxed text-white dark:text-black transition-all duration-500 ${
                  index <= currentLine
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-10'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {line || <br />}
              </p>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4 animate-pulse-slow">
            <FaHeart className="text-primary-red text-3xl" />
            <GiSparkles className="text-gold text-3xl" />
            <FaHeart className="text-primary-red text-3xl" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default PoemSection
