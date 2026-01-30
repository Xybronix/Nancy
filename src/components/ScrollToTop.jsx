import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          className="fixed bottom-8 right-8 md:bottom-6 md:right-6 w-12 h-12 md:w-11 md:h-11 bg-primary-red text-white border-none rounded-full cursor-pointer flex items-center justify-center z-[1000] shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all duration-300 hover:bg-secondary-red hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(220,38,38,0.6)] animate-fade-in"
          onClick={scrollToTop}
          aria-label="Retour en haut"
        >
          <FaArrowUp className="w-6 h-6 md:w-5 md:h-5" />
        </button>
      )}
    </>
  )
}

export default ScrollToTop
