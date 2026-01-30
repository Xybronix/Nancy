import { useEffect, useState } from 'react'

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
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[10000] overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute -top-2.5 rounded-full animate-[confetti-fall_linear_forwards]"
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
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Confetti
