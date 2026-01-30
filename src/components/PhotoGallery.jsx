import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { SITE_CONFIG } from '../config/siteConfig'

const PhotoGallery = () => {
  const { isDark } = useTheme()
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('birthday-photos')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('birthday-photos', JSON.stringify(photos))
  }, [photos])

  const handlePhotoAdd = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map(file => {
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = (event) => {
            resolve({
              id: Date.now() + Math.random(),
              url: event.target.result,
              name: file.name
            })
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(newPhotos).then(loadedPhotos => {
        setPhotos([...photos, ...loadedPhotos])
      })
    }
  }

  const removePhoto = (id) => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
    setPhotos(photos.filter(photo => photo.id !== id))
  }

  return (
    <section id="photos" className="py-20 px-5 min-h-screen bg-gradient-to-b from-black to-[#1a0000] dark:from-light-red dark:to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-center mb-12 relative inline-block w-full text-white dark:text-black after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary-red after:to-black dark:after:from-primary-red dark:after:to-white after:rounded">
          Galerie Photo
        </h2>
        <p className="text-xl md:text-lg sm:text-base text-center mb-12 text-light-red dark:text-black">
          Ajoute tes plus beaux souvenirs et moments précieux
        </p>
        
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5 mt-10">
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="relative aspect-square rounded-2xl overflow-hidden border-[3px] border-primary-red transition-transform hover:scale-105 hover:z-10 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              {SITE_CONFIG.ENABLE_EDITING && (
                <button 
                  className="absolute top-2.5 right-2.5 w-9 h-9 bg-[rgba(220,38,38,0.9)] text-white border-none rounded-full text-2xl cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-red"
                  onClick={() => removePhoto(photo.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          {SITE_CONFIG.ENABLE_EDITING && (
            <label className="aspect-square border-[3px] border-dashed border-primary-red rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-[rgba(220,38,38,0.05)] text-primary-red hover:bg-[rgba(220,38,38,0.1)] hover:border-secondary-red hover:scale-105">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoAdd}
                className="hidden"
              />
              <div className="text-6xl font-bold mb-2.5">+</div>
              <p className="font-bold uppercase tracking-wider">Ajouter des photos</p>
            </label>
          )}
        </div>
      </div>
    </section>
  )
}

export default PhotoGallery
