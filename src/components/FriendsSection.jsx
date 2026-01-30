import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaUsers } from 'react-icons/fa'
import './FriendsSection.css'

const FriendsSection = () => {
  const { isDark } = useTheme()
  const [friends, setFriends] = useState([])

  const handleFriendPhotoAdd = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFriends = Array.from(e.target.files).map(file => {
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = (event) => {
            resolve({
              id: Date.now() + Math.random(),
              photo: event.target.result,
              name: file.name.replace(/\.[^/.]+$/, '') || 'Ami(e)'
            })
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(newFriends).then(loadedFriends => {
        setFriends([...friends, ...loadedFriends])
      })
    }
  }

  const removeFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id))
  }

  return (
    <section id="friends" className="section friends-section">
      <div className="container">
        <h2 className="section-title">Nos Amies</h2>
        <p className="section-description">
          Les personnes qui ont pensé à créer ce site pour toi
        </p>

        <div className="friends-upload-section">
          <label className="friends-upload-btn">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFriendPhotoAdd}
              style={{ display: 'none' }}
            />
            <FaUsers /> Ajouter des photos d'amies
          </label>
        </div>

        <div className="friends-grid">
          {friends.map((friend, index) => (
            <div key={friend.id} className="friend-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="friend-photo-container">
                <img src={friend.photo} alt={friend.name} className="friend-photo" />
                <button className="remove-btn" onClick={() => removeFriend(friend.id)}>×</button>
              </div>
              <div className="friend-name">{friend.name}</div>
            </div>
          ))}
          
          <label className="friend-add-card">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFriendPhotoAdd}
              style={{ display: 'none' }}
            />
            <div className="add-icon">+</div>
            <p>Ajouter</p>
          </label>
        </div>

        {friends.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon"><FaUsers /></span>
            <p>Ajoute les photos de tes amies qui ont pensé à ce cadeau !</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FriendsSection
