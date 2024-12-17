import { HelpContent } from '../../../types/help';

export const settings: HelpContent = {
  id: 'settings',
  title: 'Settings & Configuration',
  content: '',
  path: '/settings',
  category: 'system',
  keywords: ['settings', 'configuration', 'preferences', 'profile'],
  lastUpdated: new Date().toISOString(),
  translations: {
    en: {
      title: 'Settings & Configuration',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Overview</h3>
            <p>The Settings section allows you to customize your experience and manage system preferences. Here you can:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Update your profile information</li>
              <li>Configure system preferences</li>
              <li>Manage notifications</li>
              <li>Set language preferences</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Profile Settings</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Update personal information</li>
              <li>Change password</li>
              <li>Set communication preferences</li>
              <li>Configure timezone settings</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">System Preferences</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Choose display language</li>
              <li>Set default views</li>
              <li>Configure email notifications</li>
              <li>Customize dashboard layout</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Update login credentials</li>
              <li>Enable two-factor authentication</li>
              <li>View login history</li>
              <li>Manage connected devices</li>
            </ul>
          </section>
        </div>
      `
    },
    fr: {
      title: 'Paramètres et Configuration',
      content: `
        <div class="space-y-6">
          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aperçu</h3>
            <p>La section Paramètres vous permet de personnaliser votre expérience et gérer les préférences du système. Ici, vous pouvez :</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Mettre à jour vos informations de profil</li>
              <li>Configurer les préférences système</li>
              <li>Gérer les notifications</li>
              <li>Définir les préférences de langue</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Paramètres du Profil</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Mettre à jour les informations personnelles</li>
              <li>Changer le mot de passe</li>
              <li>Définir les préférences de communication</li>
              <li>Configurer le fuseau horaire</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Préférences Système</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Choisir la langue d'affichage</li>
              <li>Définir les vues par défaut</li>
              <li>Configurer les notifications par email</li>
              <li>Personnaliser la disposition du tableau de bord</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Paramètres de Sécurité</h3>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Mettre à jour les identifiants de connexion</li>
              <li>Activer l'authentification à deux facteurs</li>
              <li>Voir l'historique des connexions</li>
              <li>Gérer les appareils connectés</li>
            </ul>
          </section>
        </div>
      `
    }
  }
};