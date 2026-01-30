import { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const createHeart = () => {
      const newHeart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2
      }
      setHearts(prev => [...prev, newHeart])
      
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id))
      }, (newHeart.duration + newHeart.delay) * 1000)
    }

    const interval = setInterval(createHeart, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 text-primary-red animate-heart-float"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`
          }}
        >
          <FaHeart className="text-2xl opacity-70" />
        </div>
      ))}
      <style>{`
        @keyframes heart-float {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }
        .animate-heart-float {
          animation: heart-float linear forwards;
        }
      `}</style>
    </div>
  )
}

export default FloatingHearts
