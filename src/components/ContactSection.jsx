import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { FaEnvelope, FaPhone } from 'react-icons/fa'
import { SITE_CONFIG } from '../config/siteConfig'

const ContactSection = () => {
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('birthday-contacts')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('birthday-contacts', JSON.stringify(contacts))
  }, [contacts])

  const addContact = () => {
    if (!SITE_CONFIG.ENABLE_EDITING) return
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
    if (!SITE_CONFIG.ENABLE_EDITING) return
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  return (
    <section id="contact" className="py-20 px-5 min-h-screen bg-gradient-to-b from-black to-[#1a0000] dark:from-light-red dark:to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-center mb-12 relative inline-block w-full text-white dark:text-black after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary-red after:to-black dark:after:from-primary-red dark:after:to-white after:rounded">
          Coordonnées
        </h2>
        <p className="text-xl md:text-lg sm:text-base text-center mb-12 text-light-red dark:text-black">
          Ajoute ton adresse email et/ou numéro de téléphone
        </p>

        {SITE_CONFIG.ENABLE_EDITING && (
          <div className="max-w-[600px] mx-auto mb-12 flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <label htmlFor="email" className="text-lg font-bold text-white dark:text-black">Email</label>
              <input
                type="email"
                id="email"
                placeholder="ton.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-5 py-4 border-2 border-primary-red rounded-2xl bg-white/10 dark:bg-white/90 text-white dark:text-black text-base outline-none transition-all focus:border-secondary-red focus:bg-white/15 dark:focus:bg-white focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] placeholder:text-white/60 dark:placeholder:text-black/50"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <label htmlFor="phone" className="text-lg font-bold text-white dark:text-black">Téléphone</label>
              <input
                type="tel"
                id="phone"
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-5 py-4 border-2 border-primary-red rounded-2xl bg-white/10 dark:bg-white/90 text-white dark:text-black text-base outline-none transition-all focus:border-secondary-red focus:bg-white/15 dark:focus:bg-white focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] placeholder:text-white/60 dark:placeholder:text-black/50"
              />
            </div>
            <button
              className="inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-primary-red text-white border-none rounded-full cursor-pointer font-bold text-lg transition-all uppercase tracking-wider self-center hover:bg-secondary-red hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(220,38,38,0.4)]"
              onClick={addContact}
            >
              <FaEnvelope className="w-5 h-5" /> Ajouter les coordonnées
            </button>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] md:grid-cols-1 gap-6 mt-10">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="relative bg-[rgba(220,38,38,0.1)] dark:bg-[rgba(220,38,38,0.05)] backdrop-blur-md border-2 border-primary-red rounded-2xl p-6 animate-fade-in transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(220,38,38,0.3)] group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col gap-4">
                {contact.email && (
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center text-primary-red">
                      <FaEnvelope className="w-6 h-6" />
                    </span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary-red no-underline text-lg font-medium transition-colors hover:text-secondary-red hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center text-primary-red">
                      <FaPhone className="w-6 h-6" />
                    </span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-primary-red no-underline text-lg font-medium transition-colors hover:text-secondary-red hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                <span className="text-sm text-gold dark:text-primary-red italic mt-2.5">{contact.date}</span>
              </div>
              {SITE_CONFIG.ENABLE_EDITING && (
                <button
                  className="absolute top-2.5 right-2.5 w-8 h-8 bg-[rgba(220,38,38,0.9)] text-white border-none rounded-full text-xl cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-red"
                  onClick={() => removeContact(contact.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="text-center py-16 px-5 text-white/60 dark:text-black/50">
            <span className="flex items-center justify-center mb-5 text-primary-red">
              <FaEnvelope className="w-16 h-16" />
            </span>
            <p className="text-xl">Ajoute tes coordonnées pour rester en contact !</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ContactSection
