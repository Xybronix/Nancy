import { FaHeart, FaCode, FaUsers } from 'react-icons/fa'

const CreditsSection = () => {
  return (
    <section id="credits" className="py-16 px-5 bg-gradient-to-b from-[#1a0000] to-black dark:from-white dark:to-light-red border-t-2 border-primary-red">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <FaCode className="text-5xl text-primary-red mx-auto mb-4 animate-pulse-slow" />
          <h2 className="text-4xl md:text-3xl font-bold text-white dark:text-black mb-4">
            Créé avec Amour
          </h2>
          {/*<p className="text-xl md:text-lg text-light-red dark:text-primary-red mb-8">
            Ce site a été spécialement conçu pour célébrer ton anniversaire
          </p>*/}
        </div>

        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl p-8 md:p-6 border-2 border-primary-red">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaUsers className="text-3xl text-primary-red" />
            <h3 className="text-2xl font-bold text-white dark:text-black">
              Fait et pensé par
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-white dark:text-black">
              <FaHeart className="text-primary-red text-xl" />
              <p className="text-xl font-semibold">Brayan Weko</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-white dark:text-black">
              <FaHeart className="text-primary-red text-xl" />
              <p className="text-xl font-semibold">Alexandra</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-primary-red/30">
            <p className="text-lg text-white/80 dark:text-black/80 italic">
              "Un cadeau spécial pour une personne spéciale"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreditsSection
