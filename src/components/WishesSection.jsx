import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './WishesSection.css'

const WishesSection = () => {
  const { isDark } = useTheme()
  const [wishes, setWishes] = useState([])
  const [newWish, setNewWish] = useState('')

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
    setWishes(wishes.filter(wish => wish.id !== id))
  }

  return (
    <section id="wishes" className="section wishes-section">
      <div className="container">
        <h2 className="section-title">Souhaits pour la Nouvelle Année</h2>
        <p className="section-description">
          Exprime tes souhaits et tes rêves pour cette nouvelle année
        </p>

        <div className="wish-input-section">
          <textarea
            className="wish-input"
            placeholder="Écris tes souhaits pour cette nouvelle année..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            rows="4"
          />
          <button className="wish-add-btn" onClick={addWish}>
            ✨ Ajouter un souhait
          </button>
        </div>

        <div className="wishes-grid">
          {wishes.map((wish, index) => (
            <div key={wish.id} className="wish-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="wish-content">
                <p className="wish-text">{wish.text}</p>
                <span className="wish-date">{wish.date}</span>
              </div>
              <button className="remove-btn" onClick={() => removeWish(wish.id)}>×</button>
            </div>
          ))}
        </div>

        {wishes.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🌟</span>
            <p>Ajoute tes premiers souhaits pour commencer !</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default WishesSection
