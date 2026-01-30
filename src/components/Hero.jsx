import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './Hero.css'

const Hero = () => {
  const { isDark } = useTheme()
  const [photo, setPhoto] = useState(null)

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhoto(event.target.result)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="floating-elements">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="floating-element" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}>🎉</div>
          ))}
        </div>
      </div>
      <div className="hero-content container">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="title-line">Joyeux</span>
            <span className="title-line highlight">Anniversaire</span>
            <span className="title-line">Nancy !</span>
          </h1>
          <p className="hero-subtitle">Tchounga Sani Nancy Ranaise</p>
          <p className="hero-date">31 Janvier</p>
          <p className="hero-message">
            Que cette nouvelle année de ta vie soit remplie de joie, de bonheur et de réussite ! 
            Nous te souhaitons tout le meilleur pour cette nouvelle étape. 🎂✨
          </p>
        </div>
        <div className="hero-photo">
          <div className="photo-container">
            {photo ? (
              <img src={photo} alt="Nancy" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                <span className="photo-icon">📸</span>
                <p>Ajoute ta photo</p>
              </div>
            )}
            <label className="photo-upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              {photo ? 'Changer la photo' : 'Ajouter une photo'}
            </label>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  )
}

export default Hero
