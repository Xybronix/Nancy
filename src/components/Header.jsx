import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaBirthdayCake, FaSun, FaMoon } from 'react-icons/fa'

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
    <header className={`fixed top-0 left-0 w-full py-5 z-[1000] transition-all duration-300 ${
      scrolled 
        ? 'bg-black/95 dark:bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(220,38,38,0.3)] py-4' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
        <div className="flex items-center gap-2.5 text-2xl md:text-xl font-bold text-primary-red">
          <span className="text-3xl md:text-2xl animate-pulse-slow text-primary-red">
            <FaBirthdayCake className="w-8 h-8 md:w-6 md:h-6" />
          </span>
          <span className="bg-gradient-to-r from-primary-red to-black dark:from-primary-red dark:to-white bg-clip-text text-transparent">
            Nancy
          </span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          {['home', 'poem', 'photos', 'videos', 'wishes', 'friends', 'contact', 'credits'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-white dark:text-black font-medium transition-all duration-300 relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-red after:transition-all hover:text-primary-red hover:after:w-full"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {id === 'home' ? 'Accueil' : id === 'poem' ? 'Poème' : id === 'photos' ? 'Photos' : id === 'videos' ? 'Vidéos' : id === 'wishes' ? 'Souhaits' : id === 'friends' ? 'Amies' : id === 'contact' ? 'Contact' : 'Crédits'}
            </a>
          ))}
        </nav>
        <button
          className="w-11 h-11 rounded-full bg-[rgba(220,38,38,0.2)] border-2 border-primary-red text-white dark:text-black flex items-center justify-center transition-all duration-300 hover:bg-primary-red hover:scale-110"
          onClick={toggleTheme}
          aria-label="Changer de thème"
        >
          {isDark ? <FaSun className="w-6 h-6" /> : <FaMoon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  )
}

export default Header
