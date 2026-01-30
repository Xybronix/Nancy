import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaStar, FaMagic } from 'react-icons/fa'

const WishesSection = () => {
  const { isDark } = useTheme()
  const [wishes, setWishes] = useState(() => {
    const saved = localStorage.getItem('birthday-wishes')
    return saved ? JSON.parse(saved) : []
  })
  const [newWish, setNewWish] = useState('')

  useEffect(() => {
    localStorage.setItem('birthday-wishes', JSON.stringify(wishes))
  }, [wishes])

  const addWish = () => {
    if (newWish.trim()) {
      setWishes([...wishes, {
        id: Date.now(),
        text: newWish.trim(),
        date: new Date().toLocaleDateString('fr-FR')
      }])
      setNewWish('')
    }
  }

  const removeWish = (id) => {
    // Les souhaits peuvent toujours être supprimés même en mode production
    setWishes(wishes.filter(wish => wish.id !== id))
  }

  return (
    <section id="wishes" className="py-20 px-5 min-h-screen bg-gradient-to-b from-black to-[#1a0000] dark:from-light-red dark:to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-center mb-12 relative inline-block w-full text-white dark:text-black after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary-red after:to-black dark:after:from-primary-red dark:after:to-white after:rounded">
          Souhaits pour la Nouvelle Année
        </h2>
        <p className="text-xl md:text-lg sm:text-base text-center mb-12 text-light-red dark:text-black">
          Exprime tes souhaits et tes rêves pour cette nouvelle année
        </p>

        <div className="max-w-[700px] mx-auto mb-12 flex flex-col gap-5">
          <textarea
            className="w-full px-5 py-5 border-2 border-primary-red rounded-2xl bg-white/10 dark:bg-white/90 text-white dark:text-black text-lg font-sans resize-y outline-none transition-all focus:border-secondary-red focus:bg-white/15 dark:focus:bg-white focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] placeholder:text-white/60 dark:placeholder:text-black/50"
            placeholder="Écris tes souhaits pour cette nouvelle année..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            rows="4"
          />
          <button
            className="inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-primary-red text-white border-none rounded-full cursor-pointer font-bold text-lg transition-all uppercase tracking-wider self-center hover:bg-secondary-red hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(220,38,38,0.4)]"
            onClick={addWish}
          >
            <FaMagic className="w-5 h-5" /> Ajouter un souhait
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-1 gap-6 mt-10">
          {wishes.map((wish, index) => (
            <div
              key={wish.id}
              className="relative bg-[rgba(220,38,38,0.1)] dark:bg-[rgba(220,38,38,0.05)] backdrop-blur-md border-2 border-primary-red rounded-2xl p-6 animate-fade-in transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(220,38,38,0.3)] group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <p className="text-lg leading-relaxed text-white dark:text-black mb-4">{wish.text}</p>
                <span className="text-sm text-gold dark:text-primary-red italic">{wish.date}</span>
              </div>
              <button
                className="absolute top-2.5 right-2.5 w-8 h-8 bg-[rgba(220,38,38,0.9)] text-white border-none rounded-full text-xl cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-red"
                onClick={() => removeWish(wish.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {wishes.length === 0 && (
          <div className="text-center py-16 px-5 text-white/60 dark:text-black/50">
            <span className="flex items-center justify-center mb-5 text-primary-red">
              <FaStar className="w-16 h-16" />
            </span>
            <p className="text-xl">Ajoute tes premiers souhaits pour commencer !</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default WishesSection
