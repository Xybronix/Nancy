import { useState } from 'react'
import { FaDownload, FaUpload, FaTrash, FaInfoCircle, FaFileArchive } from 'react-icons/fa'
import { exportDataAsJSON, exportDataAsZIP, importDataFromJSON, loadAllData, saveAllData } from '../utils/dataManager'
import { SITE_CONFIG } from '../config/siteConfig'

const AdminPanel = () => {
  const [showPanel, setShowPanel] = useState(false)
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')

  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportDataAsZIP()
      setImportSuccess('✅ Export réussi ! ZIP téléchargé avec toutes les images/vidéos. Extrayez-le dans public/data/ avant de déployer.')
      setTimeout(() => setImportSuccess(''), 5000)
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      setImportError('Erreur lors de l\'export. Essayez d\'exporter en JSON simple.')
      setTimeout(() => setImportError(''), 5000)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = () => {
    exportDataAsJSON()
    setImportSuccess('JSON exporté (sans fichiers). Utilisez "Exporter ZIP" pour inclure les images/vidéos.')
    setTimeout(() => setImportSuccess(''), 3000)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportError('')
    setImportSuccess('')

    importDataFromJSON(file)
      .then((data) => {
        setImportSuccess('Données importées avec succès ! Rechargez la page pour voir les changements.')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch((error) => {
        setImportError(error.message)
      })

    // Reset input
    e.target.value = ''
  }

  const handleClearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
      saveAllData({
        photos: [],
        videos: [],
        wishes: [],
        friends: [],
        contacts: [],
        heroPhoto: null,
      })
      setImportSuccess('Toutes les données ont été effacées. Rechargez la page.')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  const data = loadAllData()
  const totalItems = 
    data.photos.length + 
    data.videos.length + 
    data.wishes.length + 
    data.friends.length + 
    data.contacts.length + 
    (data.heroPhoto ? 1 : 0)

  return (
    <>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-24 right-6 z-50 bg-primary-red text-white p-3 rounded-full shadow-lg hover:bg-secondary-red transition-all duration-300 flex items-center justify-center"
        aria-label="Panneau d'administration"
      >
        <FaInfoCircle className="w-5 h-5" />
      </button>

      {showPanel && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-80 max-h-96 overflow-y-auto border-2 border-primary-red">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-primary-red">Panneau Admin</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Mode édition activé</strong>
              <br />
              Total: {totalItems} éléments
            </p>
          </div>

          {importError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400 text-sm">
              {importError}
            </div>
          )}

          {importSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded text-green-600 dark:text-green-400 text-sm">
              {importSuccess}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 bg-primary-red text-white px-4 py-2 rounded hover:bg-secondary-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFileArchive /> {isExporting ? 'Export en cours...' : 'Exporter ZIP (avec fichiers)'}
            </button>
            
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <FaDownload /> Exporter JSON (simple)
            </button>

            <label className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer">
              <FaUpload /> Importer des données
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearAll}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              <FaTrash /> Effacer tout
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Instructions:</strong>
              <br />1. Cliquez sur "Exporter ZIP" pour télécharger toutes les données avec les fichiers
              <br />2. Extrayez le ZIP dans <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">public/data/</code>
              <br />3. Mettez <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">VITE_ENABLE_EDITING=false</code> dans <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env</code>
              <br />4. Déployez ! Les fichiers seront préservés.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminPanel
