import { useState, useEffect, useMemo } from 'react'
import { FaBirthdayCake } from 'react-icons/fa'
import { GiPartyPopper } from 'react-icons/gi'

const LoadingScreen = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const birthdayDate = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    let date = new Date(currentYear, 0, 31) // 31 Janvier (mois 0 = janvier)
    
    // Si la date est passée cette année, on prend l'année prochaine
    if (now > date) {
      date = new Date(currentYear + 1, 0, 31)
    }
    
    return date
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

  const isBirthdayToday = timeLeft.days === 0 && timeLeft.hours === 0 && 
                          timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-[#1a0000] to-primary-red dark:from-light-red dark:via-white dark:to-primary-red flex items-center justify-center z-[9999] overflow-hidden">
      <div className="absolute inset-0 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,transparent_70%)] animate-spin-slow"></div>
      
      <div className="relative z-10 text-center text-white dark:text-black p-5">
        <div className="w-[120px] h-[120px] md:w-20 md:h-20 sm:w-[60px] sm:h-[60px] animate-float mb-5 flex items-center justify-center text-primary-red mx-auto">
          <FaBirthdayCake className="w-full h-full max-w-[120px] max-h-[120px] md:max-w-20 md:max-h-20 sm:max-w-[60px] sm:max-h-[60px]" />
        </div>
        
        <h1 className="text-5xl md:text-3xl sm:text-2xl font-bold mb-2.5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] animate-pulse-slow">Joyeux Anniversaire !</h1>
        <h2 className="text-2xl md:text-xl sm:text-base mb-10 text-light-red drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)]">Tchounga Sani Nancy Ranaise</h2>
        
        {isBirthdayToday ? (
          <div className="my-10 p-8 bg-[rgba(220,38,38,0.2)] backdrop-blur-md rounded-2xl border-2 border-[rgba(220,38,38,0.5)]">
            <p className="text-3xl md:text-2xl sm:text-xl font-bold mb-5 animate-pulse-slow flex items-center justify-center gap-2.5 flex-wrap">
              <GiPartyPopper className="text-3xl md:text-2xl sm:text-xl text-gold" />
              Le jour de ton anniversaire est arrivé !
              <GiPartyPopper className="text-3xl md:text-2xl sm:text-xl text-gold" />
            </p>
            <p className="text-2xl md:text-xl sm:text-lg mb-2.5 text-light-red dark:text-black">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-3xl md:text-2xl sm:text-xl font-bold text-primary-red drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              {new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
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
        
        <div className="mt-10">
          <div className="w-12 h-12 border-4 border-[rgba(220,38,38,0.3)] border-t-primary-red rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
