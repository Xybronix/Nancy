import { useTheme } from '../contexts/ThemeContext'
import './Footer.css'

const Footer = () => {
  const { isDark } = useTheme()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🎂 Joyeux Anniversaire !</h3>
            <p>Tchounga Sani Nancy Ranaise</p>
            <p className="footer-date">31 Janvier</p>
          </div>
          <div className="footer-section">
            <h3>Navigation</h3>
            <nav className="footer-nav">
              <a href="#home">Accueil</a>
              <a href="#photos">Photos</a>
              <a href="#videos">Vidéos</a>
              <a href="#wishes">Souhaits</a>
              <a href="#friends">Amies</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div className="footer-section">
            <h3>Message</h3>
            <p>Que cette nouvelle année soit remplie de bonheur, de succès et de moments inoubliables !</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Fait avec ❤️ pour Nancy</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
