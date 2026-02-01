import { useTheme } from '../contexts/ThemeContext'
import { FaBirthdayCake, FaHeart } from 'react-icons/fa'

const Footer = () => {
  const { isDark } = useTheme()

  return (
    <footer className="bg-gradient-to-b from-[#1a0000] to-black dark:from-white dark:to-light-red pt-16 pb-8 px-5 border-t-[3px] border-primary-red">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 mb-10">
          <div>
            <h3 className="text-2xl mb-5 text-primary-red flex items-center gap-2.5">
              <FaBirthdayCake className="w-6 h-6" />
              Joyeux Anniversaire !
            </h3>
            <p className="text-white dark:text-black leading-relaxed mb-2.5">Tchounga Sani Nancy Ranaise</p>
            <p className="text-xl font-bold text-gold dark:text-primary-red">31 Janvier</p>
          </div>
          <div>
            <h3 className="text-2xl mb-5 text-primary-red">Navigation</h3>
            <nav className="flex flex-col gap-4">
              {['home', 'poem', 'photos', 'videos', 'wishes', 'friends', 'contact', 'credits'].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-white dark:text-black no-underline transition-all duration-300 py-1.5 hover:text-primary-red hover:translate-x-1"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {id === 'home' ? 'Accueil' : id === 'poem' ? 'Poème' : id === 'photos' ? 'Photos' : id === 'videos' ? 'Vidéos' : id === 'wishes' ? 'Souhaits' : id === 'friends' ? 'Amies' : id === 'contact' ? 'Contact' : 'Auteurs'}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="text-2xl mb-5 text-primary-red">Message</h3>
            <p className="text-white dark:text-black leading-relaxed">
              Que cette nouvelle année soit remplie de bonheur, de succès et de moments inoubliables !
            </p>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-[rgba(220,38,38,0.3)] text-white dark:text-black">
          <p>
            &copy; {new Date().getFullYear()} Fait avec{' '}
            <FaHeart className="inline-block align-middle mx-1 text-primary-red w-5 h-5" /> pour Nancy
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
