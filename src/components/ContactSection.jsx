import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './ContactSection.css'

const ContactSection = () => {
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contacts, setContacts] = useState([])

  const addContact = () => {
    if (email.trim() || phone.trim()) {
      setContacts([...contacts, {
        id: Date.now(),
        email: email.trim(),
        phone: phone.trim(),
        date: new Date().toLocaleDateString('fr-FR')
      }])
      setEmail('')
      setPhone('')
    }
  }

  const removeContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title">Coordonnées</h2>
        <p className="section-description">
          Ajoute ton adresse email et/ou numéro de téléphone
        </p>

        <div className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="ton.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              placeholder="+33 6 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className="contact-add-btn" onClick={addContact}>
            📧 Ajouter les coordonnées
          </button>
        </div>

        <div className="contacts-list">
          {contacts.map((contact, index) => (
            <div key={contact.id} className="contact-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="contact-info">
                {contact.email && (
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <a href={`mailto:${contact.email}`} className="contact-link">
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <a href={`tel:${contact.phone}`} className="contact-link">
                      {contact.phone}
                    </a>
                  </div>
                )}
                <span className="contact-date">{contact.date}</span>
              </div>
              <button className="remove-btn" onClick={() => removeContact(contact.id)}>×</button>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📧</span>
            <p>Ajoute tes coordonnées pour rester en contact !</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ContactSection
