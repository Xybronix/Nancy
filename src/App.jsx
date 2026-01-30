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
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <div className="App">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {showConfetti && <Confetti />}
            <Header />
            <Hero />
            <PhotoGallery />
            <VideoSection />
            <WishesSection />
            <FriendsSection />
            <ContactSection />
            <Footer />
          </>
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
