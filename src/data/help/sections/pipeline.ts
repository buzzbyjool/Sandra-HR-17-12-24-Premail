import { HelpContent } from '../../../types/help';

export const pipeline: HelpContent = {
  id: 'pipeline',
  title: 'Pipeline Management',
  content: '',
  path: '/pipeline',
  category: 'core',
  keywords: ['pipeline', 'kanban', 'workflow', 'candidates', 'stages'],
  lastUpdated: new Date().toISOString(),
  translations: {
    en: {
      title: 'Pipeline Management',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Overview</h3>
            <p>The Pipeline is your central hub for managing candidate progression through your recruitment process. It provides a visual Kanban-style board where you can:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Track candidates across different stages</li>
              <li>Move candidates between stages using drag-and-drop</li>
              <li>Filter candidates by job position</li>
              <li>Add new candidates to specific stages</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Pipeline Stages</h3>
            <p>The pipeline is divided into six stages:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>New</strong> - Recently added candidates</li>
              <li><strong>Screening</strong> - Initial review and evaluation</li>
              <li><strong>Interview</strong> - Scheduled for or completed first interview</li>
              <li><strong>Submitted</strong> - Presented to hiring manager</li>
              <li><strong>HR Interview</strong> - Final HR round</li>
              <li><strong>Manager Interview</strong> - Final decision stage</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Drag and drop candidates between stages</li>
              <li>Filter view by specific job positions</li>
              <li>Quick access to candidate details</li>
              <li>Visual progress tracking</li>
              <li>Stage-specific candidate counts</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Tips</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Use the job filter to focus on specific positions</li>
              <li>Click on a candidate card to view full details</li>
              <li>Keep stages updated to maintain accurate pipeline metrics</li>
              <li>Add notes when moving candidates between stages</li>
            </ul>
          </section>
        </div>
      `
    },
    fr: {
      title: 'Gestion du Pipeline',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aperçu</h3>
            <p>Le Pipeline est votre centre de gestion pour suivre la progression des candidats dans votre processus de recrutement. Il offre un tableau de style Kanban où vous pouvez :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Suivre les candidats à travers différentes étapes</li>
              <li>Déplacer les candidats entre les étapes par glisser-déposer</li>
              <li>Filtrer les candidats par poste</li>
              <li>Ajouter de nouveaux candidats à des étapes spécifiques</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Étapes du Pipeline</h3>
            <p>Le pipeline est divisé en six étapes :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Nouveau</strong> - Candidats récemment ajoutés</li>
              <li><strong>Présélection</strong> - Évaluation initiale</li>
              <li><strong>Entretien</strong> - Programmé pour ou ayant terminé le premier entretien</li>
              <li><strong>Soumis</strong> - Présenté au responsable du recrutement</li>
              <li><strong>Entretien RH</strong> - Dernière étape RH</li>
              <li><strong>Entretien Manager</strong> - Étape de décision finale</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Fonctionnalités Principales</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Glisser-déposer les candidats entre les étapes</li>
              <li>Filtrer la vue par postes spécifiques</li>
              <li>Accès rapide aux détails des candidats</li>
              <li>Suivi visuel de la progression</li>
              <li>Nombre de candidats par étape</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Conseils</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Utilisez le filtre de poste pour vous concentrer sur des positions spécifiques</li>
              <li>Cliquez sur une carte de candidat pour voir les détails complets</li>
              <li>Maintenez les étapes à jour pour des métriques précises</li>
              <li>Ajoutez des notes lors du déplacement des candidats entre les étapes</li>
            </ul>
          </section>
        </div>
      `
    }
  }
};