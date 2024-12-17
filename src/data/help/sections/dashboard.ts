import { HelpContent } from '../../../types/help';

export const dashboard: HelpContent = {
  id: 'dashboard',
  title: 'Dashboard Overview',
  content: '',
  path: '/',
  category: 'core',
  keywords: ['dashboard', 'metrics', 'overview', 'statistics', 'activities'],
  lastUpdated: new Date().toISOString(),
  translations: {
    en: {
      title: 'Dashboard Overview',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Overview</h3>
            <p>The Dashboard provides a comprehensive overview of your recruitment activities and key metrics. Here you can:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Monitor recruitment performance metrics</li>
              <li>Track recent activities and updates</li>
              <li>View upcoming interviews and tasks</li>
              <li>Access quick insights about candidates and jobs</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Key Metrics</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Active Jobs</strong> - Currently open positions</li>
              <li><strong>Total Candidates</strong> - Number of candidates in your pipeline</li>
              <li><strong>Time to Hire</strong> - Average duration of the hiring process</li>
              <li><strong>Conversion Rate</strong> - Success rate through recruitment stages</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Activity Feed</h3>
            <p>The activity feed shows recent actions and updates, including:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>New candidate applications</li>
              <li>Interview schedules and updates</li>
              <li>Stage transitions</li>
              <li>Job posting changes</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Add new candidates directly from the dashboard</li>
              <li>Create new job postings</li>
              <li>Schedule interviews</li>
              <li>Access recent candidates and jobs</li>
            </ul>
          </section>
        </div>
      `
    },
    fr: {
      title: 'Aperçu du Tableau de Bord',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aperçu</h3>
            <p>Le Tableau de Bord offre une vue d'ensemble complète de vos activités de recrutement et des métriques clés. Ici, vous pouvez :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Surveiller les métriques de performance du recrutement</li>
              <li>Suivre les activités et mises à jour récentes</li>
              <li>Voir les entretiens et tâches à venir</li>
              <li>Accéder aux aperçus rapides des candidats et des postes</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Métriques Clés</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Postes Actifs</strong> - Positions actuellement ouvertes</li>
              <li><strong>Total des Candidats</strong> - Nombre de candidats dans votre pipeline</li>
              <li><strong>Délai de Recrutement</strong> - Durée moyenne du processus de recrutement</li>
              <li><strong>Taux de Conversion</strong> - Taux de réussite à travers les étapes</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Flux d'Activité</h3>
            <p>Le flux d'activité montre les actions et mises à jour récentes, notamment :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Nouvelles candidatures</li>
              <li>Planification et mises à jour des entretiens</li>
              <li>Transitions d'étapes</li>
              <li>Modifications des offres d'emploi</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Actions Rapides</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Ajouter de nouveaux candidats directement depuis le tableau de bord</li>
              <li>Créer de nouvelles offres d'emploi</li>
              <li>Planifier des entretiens</li>
              <li>Accéder aux candidats et postes récents</li>
            </ul>
          </section>
        </div>
      `
    }
  }
};