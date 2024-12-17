import { HelpContent } from '../../../types/help';

export const jobs: HelpContent = {
  id: 'jobs',
  title: 'Job Management',
  content: '',
  path: '/jobs',
  category: 'core',
  keywords: ['jobs', 'positions', 'vacancies', 'recruitment'],
  lastUpdated: new Date().toISOString(),
  translations: {
    en: {
      title: 'Job Management',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Overview</h3>
            <p>The Jobs section allows you to manage all your open positions and recruitment needs. Here you can:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Create and manage job postings</li>
              <li>Track applications for each position</li>
              <li>Monitor hiring progress</li>
              <li>Manage job requirements and descriptions</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Creating Jobs</h3>
            <p>When creating a new job posting, include:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Clear job title and department</li>
              <li>Detailed job description</li>
              <li>Required qualifications and skills</li>
              <li>Location and work type</li>
              <li>Salary range and benefits (optional)</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Managing Applications</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>View all applications for each position</li>
              <li>Track candidate progress</li>
              <li>Schedule interviews</li>
              <li>Collect team feedback</li>
              <li>Make hiring decisions</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Best Practices</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Keep job descriptions clear and concise</li>
              <li>Regularly update job status</li>
              <li>Archive filled or cancelled positions</li>
              <li>Maintain consistent evaluation criteria</li>
            </ul>
          </section>
        </div>
      `
    },
    fr: {
      title: 'Gestion des Offres d\'Emploi',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aperçu</h3>
            <p>La section Offres d'emploi vous permet de gérer tous vos postes ouverts et besoins en recrutement. Ici, vous pouvez :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Créer et gérer les offres d'emploi</li>
              <li>Suivre les candidatures pour chaque poste</li>
              <li>Surveiller la progression du recrutement</li>
              <li>Gérer les exigences et descriptions de poste</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Création d'Offres</h3>
            <p>Lors de la création d'une nouvelle offre, incluez :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Titre du poste et département clairs</li>
              <li>Description détaillée du poste</li>
              <li>Qualifications et compétences requises</li>
              <li>Lieu et type de travail</li>
              <li>Fourchette de salaire et avantages (optionnel)</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Gestion des Candidatures</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Voir toutes les candidatures pour chaque poste</li>
              <li>Suivre la progression des candidats</li>
              <li>Planifier les entretiens</li>
              <li>Recueillir les retours de l'équipe</li>
              <li>Prendre les décisions d'embauche</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Bonnes Pratiques</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Maintenir des descriptions de poste claires et concises</li>
              <li>Mettre à jour régulièrement le statut des offres</li>
              <li>Archiver les postes pourvus ou annulés</li>
              <li>Maintenir des critères d'évaluation cohérents</li>
            </ul>
          </section>
        </div>
      `
    }
  }
};