import { HelpContent } from '../../../types/help';

export const archive: HelpContent = {
  id: 'archive',
  title: 'Archives Management',
  content: '',
  path: '/archive',
  category: 'core',
  keywords: ['archive', 'history', 'inactive', 'closed', 'storage'],
  lastUpdated: new Date().toISOString(),
  translations: {
    en: {
      title: 'Archives Management',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Overview</h3>
            <p>The Archives section helps you manage and access historical recruitment data. Here you can:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>View archived jobs and candidates</li>
              <li>Access historical recruitment data</li>
              <li>Restore archived items when needed</li>
              <li>Maintain a clean and organized recruitment database</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Archive Categories</h3>
            <p>The archives are organized into two main categories:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Archived Jobs</strong> - Closed or filled positions</li>
              <li><strong>Archived Candidates</strong> - Past applicants and inactive profiles</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Advanced search and filtering options</li>
              <li>Detailed archive history and metadata</li>
              <li>Bulk archive and restore capabilities</li>
              <li>Archive reason tracking</li>
              <li>Data retention management</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Archive Actions</h3>
            <p>Common archive management tasks include:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Viewing archive details and history</li>
              <li>Restoring archived items to active status</li>
              <li>Permanent deletion of outdated records</li>
              <li>Exporting archive data for reporting</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Best Practices</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Regularly review and clean up archives</li>
              <li>Always include clear reasons when archiving</li>
              <li>Export important data before permanent deletion</li>
              <li>Maintain consistent archiving policies</li>
              <li>Document archive decisions and reasons</li>
            </ul>
          </section>
        </div>
      `
    },
    fr: {
      title: 'Gestion des Archives',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aperçu</h3>
            <p>La section Archives vous aide à gérer et accéder aux données historiques de recrutement. Ici, vous pouvez :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Consulter les offres et candidats archivés</li>
              <li>Accéder aux données historiques de recrutement</li>
              <li>Restaurer les éléments archivés si nécessaire</li>
              <li>Maintenir une base de données de recrutement propre et organisée</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Catégories d'Archives</h3>
            <p>Les archives sont organisées en deux catégories principales :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Offres Archivées</strong> - Postes fermés ou pourvus</li>
              <li><strong>Candidats Archivés</strong> - Anciens candidats et profils inactifs</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Fonctionnalités Principales</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Options avancées de recherche et de filtrage</li>
              <li>Historique détaillé et métadonnées d'archive</li>
              <li>Capacités d'archivage et de restauration en masse</li>
              <li>Suivi des motifs d'archivage</li>
              <li>Gestion de la rétention des données</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Actions d'Archive</h3>
            <p>Les tâches courantes de gestion des archives incluent :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Consultation des détails et de l'historique des archives</li>
              <li>Restauration d'éléments archivés vers un statut actif</li>
              <li>Suppression permanente des enregistrements obsolètes</li>
              <li>Exportation des données d'archive pour les rapports</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Bonnes Pratiques</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Examiner et nettoyer régulièrement les archives</li>
              <li>Toujours inclure des motifs clairs lors de l'archivage</li>
              <li>Exporter les données importantes avant la suppression permanente</li>
              <li>Maintenir des politiques d'archivage cohérentes</li>
              <li>Documenter les décisions et raisons d'archivage</li>
            </ul>
          </section>
        </div>
      `
    }
  }
};