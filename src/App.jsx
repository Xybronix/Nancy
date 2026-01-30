import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import LoadingScreen from './components/LoadingScreen'
import Header from './components/Header'
import Hero from './components/Hero'
import PhotoGallery from './components/PhotoGallery'
import VideoSection from './components/VideoSection'
import WishesSection from './components/WishesSection'
import FriendsSection from './components/FriendsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import Confetti from './components/Confetti'
import ScrollToTop from './components/ScrollToTop'
import AdminPanel from './components/AdminPanel'
import PoemSection from './components/PoemSection'
import SurpriseMessage from './components/SurpriseMessage'
import FloatingHearts from './components/FloatingHearts'
import BackgroundMusic from './components/BackgroundMusic'
import CreditsSection from './components/CreditsSection'
import { loadFromJSONFile, loadAllData } from './utils/dataManager'
import { SITE_CONFIG } from './config/siteConfig'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Charger les données depuis le fichier JSON si en mode production
    if (!SITE_CONFIG.ENABLE_EDITING) {
      loadFromJSONFile(SITE_CONFIG.DATA_FILE).then((data) => {
        if (data) {
          console.log('Données chargées depuis le fichier JSON')
        } else {
          // Si pas de fichier JSON, charger depuis localStorage
          const localData = loadAllData()
          if (Object.values(localData).some(v => v && (Array.isArray(v) ? v.length > 0 : true))) {
            console.log('Données chargées depuis localStorage')
          }
        }
      })
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {showConfetti && <Confetti />}
            <FloatingHearts />
            <Header />
            <Hero />
            <PoemSection />
            <PhotoGallery />
            <VideoSection />
            <WishesSection />
            <FriendsSection />
            <ContactSection />
            <CreditsSection />
            <Footer />
            <ScrollToTop />
            <SurpriseMessage />
            <BackgroundMusic />
            {SITE_CONFIG.ENABLE_EDITING && <AdminPanel />}
          </>
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
