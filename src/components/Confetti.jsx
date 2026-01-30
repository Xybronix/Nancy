import { useEffect, useState } from 'react'
import './Confetti.css'

const Confetti = () => {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    const colors = ['#dc2626', '#000000', '#fbbf24', '#ffffff']
    const newConfetti = []

    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 2,
        animationDelay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5
      })
    }

    setConfetti(newConfetti)
  }, [])

  return (
    <div className="confetti-container">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.animationDelay}s`
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
