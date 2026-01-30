import { useState, useEffect, useMemo } from 'react'
import './LoadingScreen.css'

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
    <div className="loading-screen">
      <div className="loading-content">
        <div className="birthday-icon">🎂</div>
        <h1 className="loading-title">Joyeux Anniversaire !</h1>
        <h2 className="loading-subtitle">Tchounga Sani Nancy Ranaise</h2>
        
        {isBirthdayToday ? (
          <div className="birthday-message">
            <p className="celebration-text">🎉 Le jour de ton anniversaire est arrivé ! 🎉</p>
            <p className="celebration-date">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="celebration-time">
              {new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        ) : (
          <div className="countdown">
            <p className="countdown-label">Temps restant jusqu'à ton anniversaire :</p>
            <div className="countdown-grid">
              <div className="countdown-item">
                <div className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="countdown-label-small">Jours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="countdown-label-small">Heures</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="countdown-label-small">Minutes</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="countdown-label-small">Secondes</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
