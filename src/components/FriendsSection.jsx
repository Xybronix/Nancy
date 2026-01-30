import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaUsers } from 'react-icons/fa'
import { SITE_CONFIG } from '../config/siteConfig'

const FriendsSection = () => {
  const { isDark } = useTheme()
  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem('birthday-friends')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('birthday-friends', JSON.stringify(friends))
  }, [friends])

  const handleFriendPhotoAdd = (e) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
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
    if (!SITE_CONFIG.ENABLE_EDITING) return
    setFriends(friends.filter(friend => friend.id !== id))
  }

  return (
    <section id="friends" className="py-20 px-5 min-h-screen bg-gradient-to-b from-[#1a0000] to-black dark:from-white dark:to-light-red">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-center mb-12 relative inline-block w-full text-white dark:text-black after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary-red after:to-black dark:after:from-primary-red dark:after:to-white after:rounded">
          Nos Amies
        </h2>
        <p className="text-xl md:text-lg sm:text-base text-center mb-12 text-light-red dark:text-black">
          Les personnes qui ont pensé à créer ce site pour toi
        </p>

        {SITE_CONFIG.ENABLE_EDITING && (
          <div className="text-center mb-12">
            <label className="inline-flex items-center gap-2.5 px-10 py-4 bg-primary-red text-white border-none rounded-full cursor-pointer font-bold text-lg transition-all hover:bg-secondary-red hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(220,38,38,0.4)] uppercase tracking-wider">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFriendPhotoAdd}
                className="hidden"
              />
              <FaUsers className="w-5 h-5" /> Ajouter des photos d'amies
            </label>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-8 md:gap-5 mt-10">
          {friends.map((friend, index) => (
            <div
              key={friend.id}
              className="text-center animate-fade-in transition-transform hover:-translate-y-2.5"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-[200px] h-[200px] md:w-[150px] md:h-[150px] mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-red transition-all group hover:border-secondary-red hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)]">
                <img src={friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                {SITE_CONFIG.ENABLE_EDITING && (
                  <button
                    className="absolute top-1 right-1 w-8 h-8 bg-[rgba(220,38,38,0.9)] text-white border-none rounded-full text-xl cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-red"
                    onClick={() => removeFriend(friend.id)}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="text-lg font-bold text-white dark:text-black capitalize">{friend.name}</div>
            </div>
          ))}
          
          {SITE_CONFIG.ENABLE_EDITING && (
            <label className="w-[200px] h-[200px] md:w-[150px] md:h-[150px] mx-auto border-[3px] border-dashed border-primary-red rounded-full flex flex-col items-center justify-center cursor-pointer transition-all bg-[rgba(220,38,38,0.05)] text-primary-red hover:bg-[rgba(220,38,38,0.1)] hover:border-secondary-red hover:scale-110">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFriendPhotoAdd}
                className="hidden"
              />
              <div className="text-5xl md:text-4xl font-bold mb-2.5">+</div>
              <p className="font-bold uppercase tracking-wider">Ajouter</p>
            </label>
          )}
        </div>

        {friends.length === 0 && (
          <div className="text-center py-16 px-5 text-white/60 dark:text-black/50">
            <span className="flex items-center justify-center mb-5 text-primary-red">
              <FaUsers className="w-16 h-16" />
            </span>
            <p className="text-xl">Ajoute les photos de tes amies qui ont pensé à ce cadeau !</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FriendsSection
