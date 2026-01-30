import { useState, useEffect } from 'react'
import { FaGift, FaHeart, FaStar } from 'react-icons/fa'
import { GiPartyPopper, GiCakeSlice } from 'react-icons/gi'

const SurpriseMessage = () => {
  const [showSurprise, setShowSurprise] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = [
    {
      icon: <FaGift className="text-6xl" />,
      text: "Tu es un cadeau pour tous ceux qui te connaissent !",
      color: "text-primary-red"
    },
    {
      icon: <FaHeart className="text-6xl" />,
      text: "Que l'amour t'accompagne chaque jour de cette nouvelle année !",
      color: "text-primary-red"
    },
    {
      icon: <FaStar className="text-6xl" />,
      text: "Tu brilles comme une étoile, continue de briller !",
      color: "text-gold"
    },
    {
      icon: <GiCakeSlice className="text-6xl" />,
      text: "Que cette année soit aussi douce que ce gâteau !",
      color: "text-primary-red"
    },
    {
      icon: <GiPartyPopper className="text-6xl" />,
      text: "Célébrons cette nouvelle année avec joie et bonheur !",
      color: "text-gold"
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSurprise(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showSurprise) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [showSurprise, messages.length])

  if (!showSurprise) return null

  return (
    <div className="fixed bottom-32 right-6 z-50 animate-slide-up">
      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-4 border-primary-red max-w-sm animate-bounce-slow">
        <div className="text-center">
          <div className={`mb-4 animate-spin-slow ${messages[messageIndex].color}`}>
            {messages[messageIndex].icon}
          </div>
          <p className="text-lg font-bold text-primary-black dark:text-white animate-fade-in-out">
            {messages[messageIndex].text}
          </p>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes fade-in-out {
          0%, 100% {
            opacity: 0;
          }
          20%, 80% {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default SurpriseMessage
