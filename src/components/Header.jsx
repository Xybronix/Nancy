import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaBirthdayCake, FaSun, FaMoon } from 'react-icons/fa'
import './Header.css'

const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon"><FaBirthdayCake /></span>
          <span className="logo-text">Nancy</span>
        </div>
        <nav className="nav">
          <a href="#home" className="nav-link">Accueil</a>
          <a href="#photos" className="nav-link">Photos</a>
          <a href="#videos" className="nav-link">Vidéos</a>
          <a href="#wishes" className="nav-link">Souhaits</a>
          <a href="#friends" className="nav-link">Amies</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  )
}

export default Header
