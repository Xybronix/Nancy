import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { GiPartyPopper } from 'react-icons/gi'
import { FaBirthdayCake, FaCamera, FaStar } from 'react-icons/fa'
import { SITE_CONFIG } from '../config/siteConfig'

const Hero = () => {
  const { isDark } = useTheme()
  const [photo, setPhoto] = useState(() => {
    const saved = localStorage.getItem('birthday-hero-photo')
    return saved || null
  })

  useEffect(() => {
    if (photo) {
      localStorage.setItem('birthday-hero-photo', photo)
    } else {
      localStorage.removeItem('birthday-hero-photo')
    }
  }, [photo])

  const handlePhotoChange = (e) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhoto(event.target.result)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative py-24 px-5 overflow-hidden bg-gradient-to-br from-black via-[#1a0000] to-primary-red dark:from-light-red dark:via-white dark:to-primary-red">
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl opacity-30 dark:opacity-20 animate-float pointer-events-none text-primary-red"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            >
              <GiPartyPopper className="w-8 h-8" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-white dark:text-black">
          <h1 className="text-6xl md:text-5xl sm:text-4xl font-bold mb-5 leading-tight">
            <span className="block animate-[slideInLeft_0.8s_ease-out]">Joyeux</span>
            <span className="block text-7xl md:text-6xl sm:text-5xl text-primary-red drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-[slideInLeft_0.8s_ease-out_0.2s_both]">
              Anniversaire
            </span>
            <span className="block animate-[slideInLeft_0.8s_ease-out_0.4s_both]">Nancy !</span>
          </h1>
          <p className="text-3xl md:text-2xl sm:text-xl mb-2.5 text-gold dark:text-primary-red animate-[fadeIn_1s_ease-out_0.6s_both]">
            Tchounga Sani Nancy Ranaise
          </p>
          <p className="text-2xl md:text-xl sm:text-lg mb-8 text-light-red dark:text-black animate-[fadeIn_1s_ease-out_0.8s_both]">
            31 Janvier
          </p>
          <p className="text-xl md:text-lg sm:text-base leading-relaxed max-w-lg animate-[fadeIn_1s_ease-out_1s_both]">
            Que cette nouvelle année de ta vie soit remplie de joie, de bonheur et de réussite ! 
            Nous te souhaitons tout le meilleur pour cette nouvelle étape.{' '}
            <FaBirthdayCake className="inline-block align-middle mx-1 text-primary-red w-6 h-6" />{' '}
            <FaStar className="inline-block align-middle mx-1 text-primary-red w-5 h-5" />
          </p>
        </div>
        
        <div className="flex justify-center items-center animate-[slideInRight_1s_ease-out]">
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-[3px] border-primary-red rounded-3xl p-5 text-center transition-transform hover:scale-105">
            {photo ? (
              <img src={photo} alt="Nancy" className="w-[300px] h-[300px] object-cover rounded-2xl mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]" />
            ) : (
              <div className="w-[300px] h-[300px] flex flex-col items-center justify-center bg-[rgba(220,38,38,0.1)] dark:bg-[rgba(220,38,38,0.05)] rounded-2xl mb-5 text-white dark:text-black">
                <FaCamera className="text-6xl mb-2.5 text-primary-red" />
                <p>Ajoute ta photo</p>
              </div>
            )}
            {SITE_CONFIG.ENABLE_EDITING && (
              <label className="inline-block px-8 py-3 bg-primary-red text-white border-none rounded-full cursor-pointer font-bold uppercase tracking-wider transition-all hover:bg-secondary-red hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(220,38,38,0.4)]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                {photo ? 'Changer la photo' : 'Ajouter une photo'}
              </label>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-8 h-8 border-r-[3px] border-b-[3px] border-primary-red rotate-45 animate-[bounce_2s_infinite]"></div>
      </div>
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) rotate(45deg);
          }
          40% {
            transform: translateY(-10px) rotate(45deg);
          }
          60% {
            transform: translateY(-5px) rotate(45deg);
          }
        }
      `}</style>
    </section>
  )
}

export default Hero
