import { useState, useEffect, useMemo } from 'react'
import { FaBirthdayCake, FaStar, FaHeart } from 'react-icons/fa'
import { GiPartyPopper, GiSparkles } from 'react-icons/gi'
import { SITE_CONFIG } from '../config/siteConfig'

const LoadingScreen = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const { birthdayDate, isBirthdayToday, isBirthdayWeek } = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const birthdayDay = SITE_CONFIG.BIRTHDAY_DAY // 31
    const birthdayMonth = SITE_CONFIG.BIRTHDAY_MONTH // 0 (janvier)
    const offsetDays = SITE_CONFIG.COUNTDOWN_START_OFFSET_DAYS // 1 jour
    
    // Date de l'anniversaire cette année
    const thisYearBirthday = new Date(currentYear, birthdayMonth, birthdayDay)
    
    // Date de début du compteur pour l'année prochaine (anniversaire + offset)
    const nextYearCountdownStart = new Date(currentYear, birthdayMonth, birthdayDay + offsetDays)
    
    // Date de l'anniversaire l'année prochaine
    const nextYearBirthday = new Date(currentYear + 1, birthdayMonth, birthdayDay)
    
    // Vérifier si c'est le jour de l'anniversaire
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const birthday = new Date(currentYear, birthdayMonth, birthdayDay)
    const isToday = today.getTime() === birthday.getTime()
    
    // Vérifier si on est dans la semaine de l'anniversaire (jour J et jours suivants jusqu'au début du compteur)
    const isInWeek = now >= birthday && now < nextYearCountdownStart
    
    let targetDate
    if (isToday || isInWeek) {
      // Si c'est le jour J ou dans la période spéciale, on compte vers l'année prochaine
      targetDate = nextYearBirthday
    } else if (now < birthday) {
      // Si l'anniversaire n'est pas encore passé cette année
      targetDate = thisYearBirthday
    } else {
      // Sinon, on compte vers l'année prochaine
      targetDate = nextYearBirthday
    }
    
    return {
      birthdayDate: targetDate,
      isBirthdayToday: isToday,
      isBirthdayWeek: isInWeek
    }
  }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = birthdayDate - new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [birthdayDate])

  const showCountdown = !isBirthdayToday && !isBirthdayWeek

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-[#1a0000] to-primary-red dark:from-light-red dark:via-white dark:to-primary-red flex items-center justify-center z-[9999] overflow-hidden">
      <div className="absolute inset-0 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,transparent_70%)] animate-spin-slow"></div>
      
      {/* Confettis animés pour le jour de l'anniversaire */}
      {isBirthdayToday && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <GiPartyPopper className="text-4xl text-gold opacity-80" />
            </div>
          ))}
        </div>
      )}
      
      <div className="relative z-10 text-center text-white dark:text-black p-5">
        <div className="w-[120px] h-[120px] md:w-20 md:h-20 sm:w-[60px] sm:h-[60px] animate-float mb-5 flex items-center justify-center text-primary-red mx-auto">
          <FaBirthdayCake className="w-full h-full max-w-[120px] max-h-[120px] md:max-w-20 md:max-h-20 sm:max-w-[60px] sm:max-h-[60px]" />
        </div>
        
        <h1 className="text-5xl md:text-3xl sm:text-2xl font-bold mb-2.5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] animate-pulse-slow">Joyeux Anniversaire !</h1>
        <h2 className="text-2xl md:text-xl sm:text-base mb-10 text-light-red dark:text-primary-red drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)]">Tchounga Sani Nancy Ranaise</h2>
        
        {isBirthdayToday ? (
          <div className="my-10 p-8 bg-gradient-to-br from-[rgba(220,38,38,0.3)] via-[rgba(251,191,36,0.2)] to-[rgba(220,38,38,0.3)] backdrop-blur-md rounded-2xl border-4 border-primary-red shadow-[0_0_30px_rgba(220,38,38,0.6),0_0_60px_rgba(251,191,36,0.4)] animate-pulse-slow relative overflow-hidden">
            {/* Effet de brillance animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            
            <div className="mb-6 relative z-10">
              <GiPartyPopper className="text-6xl md:text-5xl sm:text-4xl text-gold mx-auto mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
            </div>
            <div className="relative z-10 flex items-center justify-center gap-3 mb-5">
              <GiSparkles className="text-4xl md:text-3xl sm:text-2xl text-gold animate-spin-slow" />
              <p className="text-4xl md:text-3xl sm:text-2xl font-bold text-white dark:text-black drop-shadow-[0_0_20px_rgba(251,191,36,0.8),2px_2px_4px_rgba(0,0,0,0.8)] animate-pulse-slow">
                C'EST AUJOURD'HUI !
              </p>
              <GiSparkles className="text-4xl md:text-3xl sm:text-2xl text-gold animate-spin-slow" />
            </div>
            <p className="text-3xl md:text-2xl sm:text-xl font-bold mb-5 animate-pulse-slow flex items-center justify-center gap-2.5 flex-wrap relative z-10">
              <GiPartyPopper className="text-3xl md:text-2xl sm:text-xl text-gold animate-bounce" />
              <span className="text-white dark:text-black drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">Le jour de ton anniversaire est arrivé !</span>
              <GiPartyPopper className="text-3xl md:text-2xl sm:text-xl text-gold animate-bounce" />
            </p>
            <p className="text-2xl md:text-xl sm:text-lg mb-4 text-white dark:text-black font-semibold relative z-10 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-4xl md:text-3xl sm:text-2xl font-bold text-primary-red drop-shadow-[0_0_15px_rgba(220,38,38,0.8),2px_2px_4px_rgba(0,0,0,0.8)] animate-pulse-slow relative z-10">
              {new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
              <FaBirthdayCake className="text-2xl md:text-xl sm:text-lg text-gold animate-float" />
              <p className="text-xl md:text-lg sm:text-base text-white dark:text-black italic drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                Profite de cette journée spéciale !
              </p>
              <FaStar className="text-2xl md:text-xl sm:text-lg text-gold animate-pulse-slow" />
            </div>
          </div>
        ) : isBirthdayWeek ? (
          <div className="my-10 p-8 bg-[rgba(220,38,38,0.2)] backdrop-blur-md rounded-2xl border-2 border-[rgba(220,38,38,0.5)]">
            <p className="text-3xl md:text-2xl sm:text-xl font-bold mb-5 animate-pulse-slow flex items-center justify-center gap-2.5 flex-wrap">
              <GiPartyPopper className="text-3xl md:text-2xl sm:text-xl text-gold" />
              C'est encore ton anniversaire !
              <GiPartyPopper className="text-3xl md:text-2xl sm:text-xl text-gold" />
            </p>
            <div className="flex items-center justify-center gap-2">
              <GiSparkles className="text-2xl text-gold" />
              <p className="text-xl md:text-lg sm:text-base text-light-red dark:text-primary-red">
                Profite de cette période spéciale !
              </p>
              <GiSparkles className="text-2xl text-gold" />
            </div>
          </div>
        ) : (
          <div className="my-10">
            <p className="text-xl md:text-lg sm:text-base mb-8 text-light-red dark:text-primary-red">Temps restant jusqu'à ton anniversaire :</p>
            <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5 md:gap-4 sm:gap-2.5 max-w-[600px] mx-auto">
              {[
                { value: timeLeft.days, label: 'Jours' },
                { value: timeLeft.hours, label: 'Heures' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Secondes' }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-2 border-[rgba(220,38,38,0.5)] rounded-2xl p-5 transition-transform hover:scale-110 hover:border-primary-red">
                  <div className="text-4xl md:text-3xl sm:text-2xl font-bold text-primary-red drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] mb-2.5">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-light-red dark:text-primary-red uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showCountdown && (
          <div className="mt-10">
            <div className="w-12 h-12 border-4 border-[rgba(220,38,38,0.3)] border-t-primary-red rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
