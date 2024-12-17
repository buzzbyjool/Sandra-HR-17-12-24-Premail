import { HelpContent } from '../../../types/help';

export const candidates: HelpContent = {
  id: 'candidates',
  title: 'Candidate Management',
  content: '',
  path: '/candidates',
  category: 'core',
  keywords: ['candidates', 'recruitment', 'profiles', 'applications'],
  lastUpdated: new Date().toISOString(),
  translations: {
    en: {
      title: 'Candidate Management',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Overview</h3>
            <p>The Candidates section helps you manage your talent pool effectively. Here you can:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>View and manage all candidate profiles</li>
              <li>Track application status and progress</li>
              <li>Access detailed candidate information</li>
              <li>Manage candidate documents and notes</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Candidate Profiles</h3>
            <p>Each candidate profile includes:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Personal and contact information</li>
              <li>Professional experience and skills</li>
              <li>Education and certifications</li>
              <li>Application history and status</li>
              <li>Interview feedback and notes</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Quick candidate search and filtering</li>
              <li>Document management (CV, cover letters)</li>
              <li>Interview scheduling and tracking</li>
              <li>Candidate rating and evaluation</li>
              <li>Communication history</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Best Practices</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Keep candidate information up to date</li>
              <li>Add detailed notes after each interaction</li>
              <li>Regularly review and update candidate status</li>
              <li>Maintain organized documentation</li>
            </ul>
          </section>
        </div>
      `
    },
    fr: {
      title: 'Gestion des Candidats',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aperçu</h3>
            <p>La section Candidats vous aide à gérer efficacement votre vivier de talents. Ici, vous pouvez :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Visualiser et gérer tous les profils de candidats</li>
              <li>Suivre le statut et la progression des candidatures</li>
              <li>Accéder aux informations détaillées des candidats</li>
              <li>Gérer les documents et notes des candidats</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Profils des Candidats</h3>
            <p>Chaque profil de candidat comprend :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Informations personnelles et de contact</li>
              <li>Expérience professionnelle et compétences</li>
              <li>Formation et certifications</li>
              <li>Historique et statut des candidatures</li>
              <li>Retours d'entretien et notes</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Fonctionnalités Principales</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Recherche et filtrage rapides des candidats</li>
              <li>Gestion des documents (CV, lettres de motivation)</li>
              <li>Planification et suivi des entretiens</li>
              <li>Évaluation et notation des candidats</li>
              <li>Historique des communications</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Bonnes Pratiques</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Maintenir les informations des candidats à jour</li>
              <li>Ajouter des notes détaillées après chaque interaction</li>
              <li>Revoir et mettre à jour régulièrement le statut des candidats</li>
              <li>Maintenir une documentation organisée</li>
            </ul>
          </section>
        </div>
      `
    }
  }
};