import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './PhotoGallery.css'

const PhotoGallery = () => {
  const { isDark } = useTheme()
  const [photos, setPhotos] = useState([])

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
    setPhotos(photos.filter(photo => photo.id !== id))
  }

  return (
    <section id="photos" className="section photo-gallery">
      <div className="container">
        <h2 className="section-title">Galerie Photo</h2>
        <p className="section-description">
          Ajoute tes plus beaux souvenirs et moments précieux
        </p>
        
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <div key={photo.id} className="gallery-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <img src={photo.url} alt={photo.name} className="gallery-image" />
              <button className="remove-btn" onClick={() => removePhoto(photo.id)}>×</button>
            </div>
          ))}
          
          <label className="gallery-add-item">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoAdd}
              style={{ display: 'none' }}
            />
            <div className="add-icon">+</div>
            <p>Ajouter des photos</p>
          </label>
        </div>
      </div>
    </section>
  )
}

export default PhotoGallery
