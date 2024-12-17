import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Sidebar
      sidebar: {
        dashboard: 'Dashboard',
        pipeline: 'Pipeline',
        candidates: 'Candidates',
        jobs: 'Jobs',
        settings: 'Settings',
        archive: 'Archives'
      },

      // Search
      search: {
        placeholder: 'Search by name, job, or organization...'
      },

      // Dashboard
      dashboard: {
        title: 'Dashboard',
        greeting: {
          morning: 'Good morning',
          afternoon: 'Good afternoon',
          evening: 'Good evening',
          night: 'Good night'
        },
        actions: {
          morning: 'Start your day by reviewing your tasks',
          afternoon: 'Check your project progress',
          evening: 'Plan tomorrow\'s activities',
          night: 'Review today\'s achievements',
          monday: 'Coordinate with your team for the week ahead',
          friday: 'Prepare your weekly report',
          weekend: 'Plan your priorities for next week'
        },
        activities: {
          today: "Today's Activities",
          yesterday: "Yesterday's Activities",
          title: "Recent Activities",
          viewAll: "View All",
          showLess: "Show Less",
          types: {
            job_created: "Created new job position: {{jobTitle}}",
            candidate_created: "Added new candidate: {{candidateName}}",
            stage_changed: "Moved {{candidateName}} to {{newStage}} stage",
            interview_scheduled: "Scheduled interview with {{candidateName}} for {{jobTitle}}",
            feedback_added: "Added feedback for {{candidateName}}",
            offer_generated: "Generated offer for {{candidateName}}",
            candidate_restored: "Restored candidate from archived state",
            job_deleted: "Job permanently deleted",
            job_archived: "Job archived: {{reason}}",
            unknown: "Unknown activity"
          }
        },
        interviews: 'Interviews',
        candidates: 'Candidates in process',
        positions: 'Positions',
        hired: 'Hired',
        metrics: 'Metrics',
        status: {
          pending: 'Pending',
          completed: 'Completed'
        },
        candidatesByStage: {
          title: 'Candidates by Stage',
          subtitle: 'Current recruitment pipeline status',
          stages: {
            screening: 'Screening',
            interview: 'Interview',
            submitted: 'Submitted',
            hr: 'HR',
            manager: 'Manager'
          }
        }
      },

      // Jobs
      jobs: {
        title: 'Jobs',
        subtitle: 'Manage your job openings',
        add: 'Add Job',
        edit: 'Edit Job',
        details: 'Job Details',
        requirements: 'Requirements',
        department: 'Department',
        location: 'Location',
        type: 'Type',
        description: 'Description',
        view_pipeline: 'View Pipeline',
        delete_confirm_title: 'Delete Job',
        delete_confirm_message: 'Are you sure you want to delete {{jobTitle}}? This will remove all candidate associations.',
        delete_success: 'Successfully deleted {{title}} and {{count}} candidate associations',
        delete_error: 'Failed to delete job',
        candidate_added: 'Candidate added successfully',
        candidate_add_error: 'Failed to add candidate',
        add_candidate: 'Add candidate to this job',
        view_details: 'View job details',
        mark_status: 'Mark as filled/closed',
        delete: 'Delete job'
      },

      // Pipeline
      pipeline: {
        title: 'Pipeline',
        subtitle: 'Track and manage your recruitment flow',
        add: 'Add Candidate',
        stages: {
          new: 'New',
          screening: 'Screening',
          interview: 'Interview',
          submitted: 'Submitted',
          hr: 'HR Interview',
          manager: 'Manager Interview'
        }
      },

      // Profile
      profile: {
        title: 'Profile',
        view: 'View Profile',
        personal_info: 'Personal Information',
        company_info: 'Company Information',
        email: 'Email Address',
        name: 'Full Name',
        name_updated: 'Name updated successfully',
        update_failed: 'Update failed',
        change_password: 'Change Password',
        current_password: 'Current Password',
        new_password: 'New Password',
        confirm_password: 'Confirm Password',
        passwords_not_match: 'Passwords do not match',
        password_updated: 'Password updated successfully',
        wrong_password: 'Current password is incorrect',
        update_password: 'Update Password'
      },

      // Company
      company: {
        title: 'Company',
        setup_title: 'Set Up Your Company',
        team: 'Team',
        unknown_company: 'Unknown Company',
        role: 'Role',
        setup_description: 'Create a company profile to start managing your recruitment process.',
        name: 'Company Name',
        domain: 'Company Domain',
        name_placeholder: 'Enter your company name',
        domain_help: 'Used for email verification and team invites',
        create: 'Create Company',
        create_error: 'Failed to create company',
        no_company: 'You haven\'t set up a company yet',
        contact_admin: 'Please contact an administrator to be added to a company'
      },

      // Common
      common: {
        loading: 'Loading...',
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        add: 'Add',
        adding: 'Adding...',
        update: 'Update',
        updating: 'Updating...',
        creating: 'Creating...',
        delete: 'Delete',
        deleting: 'Deleting...',
        edit: 'Edit',
        clear: 'Clear',
        create: 'Create'
      },

      // Status
      status: {
        pending: 'Pending',
        completed: 'Completed',
        active: 'Active',
        inactive: 'Inactive'
      },

      // Auth
      auth: {
        signout: 'Sign Out',
        forgot_password: 'Forgot your password?',
        reset_password: 'Reset Password',
        reset_password_sent: 'Password reset email sent',
        reset_password_error: 'Failed to send password reset email'
      },

      // Errors
      errors: {
        add_candidate: 'Failed to add candidate',
        update_candidate: 'Failed to update candidate',
        delete_candidate: 'Failed to delete candidate'
      },

      // Settings
      settings: {
        language: {
          title: 'Language Settings',
          subtitle: 'Choose your preferred language'
        }
      },

      // Candidates
      candidate: {
        subtitle: 'Manage your candidate pool',
        firstName: 'First Name',
        basicInfo: 'Basic Information',
        surname: 'Last Name',
        email: 'Email',
        delete_confirm: 'Are you sure you want to permanently delete {{name}}? This action cannot be undone and all data will be lost.',
        yearsOfExperience: 'Years of Experience',
        phone: 'Phone',
        position: 'Position',
        address: 'Address',
        nationality: 'Nationality',
        skills: 'Skills',
        assessment: 'Assessment',
        workPermits: 'Work Permits',
        euResident: 'EU Resident',
        euWorkPermit: 'EU Work Permit',
        experience: 'Experience',
        education: 'Education',
        aiSalaryEstimation: 'AI Salary Estimation',
        recruiterFeedback: 'Recruiter Feedback',
        additionalInfo: 'Additional Personal Information',
        cvPreview: 'CV Preview'
      }
    }
  },
  fr: {
    translation: {
      // Sidebar
      sidebar: {
        dashboard: 'Tableau de bord',
        pipeline: 'Processus',
        candidates: 'Candidatures',
        jobs: 'Offres',
        settings: 'Paramètres',
        archive: 'Archives'
      },

      // Search
      search: {
        placeholder: 'Rechercher par nom, poste ou organisation...'
      },

      // Dashboard
      dashboard: {
        title: 'Tableau de bord',
        greeting: {
          morning: 'Bonjour',
          afternoon: 'Bon après-midi',
          evening: 'Bonsoir',
          night: 'Bonne nuit'
        },
        actions: {
          morning: 'Commencez votre journée en examinant vos tâches',
          afternoon: 'Vérifiez l\'avancement de votre projet',
          evening: 'Planifiez les activités de demain',
          night: 'Examinez les réalisations d\'aujourd\'hui',
          monday: 'Coordonnez-vous avec votre équipe pour la semaine à venir',
          friday: 'Préparez votre rapport hebdomadaire',
          weekend: 'Planifiez vos priorités pour la semaine prochaine'
        },
        activities: {
          today: "Activités d'aujourd'hui",
          yesterday: "Activités d'hier",
          title: "Activités récentes",
          viewAll: "Voir tout",
          showLess: "Voir moins",
          types: {
            job_created: "Nouveau poste créé : {{jobTitle}}",
            candidate_created: "Nouveau candidat ajouté : {{candidateName}}",
            stage_changed: "{{candidateName}} déplacé vers l'étape {{newStage}}",
            interview_scheduled: "Entretien programmé avec {{candidateName}} pour {{jobTitle}}",
            feedback_added: "Retour ajouté pour {{candidateName}}",
            offer_generated: "Offre générée pour {{candidateName}}",
            candidate_restored: "Candidat restauré depuis les archives",
            job_deleted: "Poste définitivement supprimé",
            job_archived: "Poste archivé : {{reason}}",
            unknown: "Activité inconnue"
          }
        },
        interviews: 'Entretiens',
        candidates: 'Candidats en cours',
        positions: 'Postes',
        hired: 'Recrutés',
        metrics: 'Métriques',
        status: {
          pending: 'En attente',
          completed: 'Terminé'
        },
        candidatesByStage: {
          title: 'Candidats par Étape',
          subtitle: 'État actuel du pipeline de recrutement',
          stages: {
            screening: 'Présélection',
            interview: 'Entretien',
            submitted: 'Soumis',
            hr: 'RH',
            manager: 'Manager'
          }
        }
      },

      // Jobs
      jobs: {
        title: 'Emplois',
        subtitle: 'Gérer vos offres d\'emploi',
        add: 'Ajouter un emploi',
        edit: 'Modifier l\'emploi',
        details: 'Détails du poste',
        requirements: 'Prérequis',
        department: 'Département',
        location: 'Localisation',
        type: 'Type',
        description: 'Description',
        view_pipeline: 'Voir le pipeline',
        delete_confirm_title: 'Supprimer l\'emploi',
        delete_confirm_message: 'Êtes-vous sûr de vouloir supprimer {{jobTitle}} ? Cela supprimera toutes les associations de candidats.',
        delete_success: 'Suppression réussie de {{title}} et {{count}} associations de candidats',
        delete_error: 'Échec de la suppression de l\'emploi',
        candidate_added: 'Candidat ajouté avec succès',
        candidate_add_error: 'Échec de l\'ajout du candidat',
        add_candidate: 'Ajouter un candidat à ce poste',
        view_details: 'Voir les détails du poste',
        mark_status: 'Marquer comme pourvu/fermé',
        delete: 'Supprimer le poste'
      },

      // Pipeline
      pipeline: {
        title: 'Pipeline',
        subtitle: 'Suivre et gérer votre processus de recrutement',
        add: 'Ajouter un candidat',
        subtitle: 'Gérer votre processus de recrutement',
        stages: {
          new: 'Nouveau',
          screening: 'Présélection',
          interview: 'Entretien',
          submitted: 'Soumis',
          hr: 'Entretien RH',
          manager: 'Entretien Manager'
        }
      },

      // Profile
      profile: {
        title: 'Profil',
        view: 'Voir le profil',
        personal_info: 'Informations personnelles',
        company_info: 'Informations de l\'entreprise',
        email: 'Adresse email',
        name: 'Nom complet',
        name_updated: 'Nom mis à jour avec succès',
        update_failed: 'Échec de la mise à jour',
        change_password: 'Changer le mot de passe',
        current_password: 'Mot de passe actuel',
        new_password: 'Nouveau mot de passe',
        confirm_password: 'Confirmer le mot de passe',
        passwords_not_match: 'Les mots de passe ne correspondent pas',
        password_updated: 'Mot de passe mis à jour avec succès',
        wrong_password: 'Le mot de passe actuel est incorrect',
        update_password: 'Mettre à jour le mot de passe'
      },

      // Company
      company: {
        title: 'Entreprise',
        setup_title: 'Configurer votre entreprise',
        team: 'Équipe',
        role: 'Rôle',
        setup_description: 'Créez un profil d\'entreprise pour commencer à gérer votre processus de recrutement.',
        name: 'Nom de l\'entreprise',
        domain: 'Domaine de l\'entreprise',
        name_placeholder: 'Entrez le nom de votre entreprise',
        domain_help: 'Utilisé pour la vérification des emails et les invitations d\'équipe',
        create: 'Créer l\'entreprise',
        create_error: 'Échec de la création de l\'entreprise',
        no_company: 'Vous n\'avez pas encore configuré d\'entreprise',
        contact_admin: 'Veuillez contacter un administrateur pour être ajouté à une entreprise'
      },

      candidate: {
        subtitle: 'Gérer votre vivier de talents',
        // ... rest of candidate translations
      },

      jobs: {
        subtitle: 'Gérer vos offres d\'emploi',
        // ... rest of jobs translations
      },

      // Common
      common: {
        loading: 'Chargement...',
        save: 'Enregistrer',
        saving: 'Enregistrement...',
        cancel: 'Annuler',
        add: 'Ajouter',
        adding: 'Ajout...',
        update: 'Mettre à jour',
        updating: 'Mise à jour...',
        creating: 'Création...',
        delete: 'Supprimer',
        deleting: 'Suppression...',
        edit: 'Modifier',
        clear: 'Effacer',
        create: 'Créer'
      },

      // Status
      status: {
        pending: 'En attente',
        completed: 'Terminé',
        active: 'Actif',
        inactive: 'Inactif'
      },

      // Auth
      auth: {
        signout: 'Déconnexion',
        forgot_password: 'Mot de passe oublié ?',
        reset_password: 'Réinitialiser le mot de passe',
        reset_password_sent: 'Email de réinitialisation envoyé',
        reset_password_error: 'Échec de l\'envoi de l\'email de réinitialisation'
      },

      // Errors
      errors: {
        add_candidate: 'Échec de l\'ajout du candidat',
        update_candidate: 'Échec de la mise à jour du candidat',
        delete_candidate: 'Échec de la suppression du candidat'
      },

      // Settings
      settings: {
        language: {
          title: 'Paramètres de langue',
          subtitle: 'Choisissez votre langue préférée'
        }
      },

      // Candidates
      candidate: {
        subtitle: 'Gérer votre vivier de talents',
        firstName: 'Prénom',
        basicInfo: 'Informations de base',
        surname: 'Nom',
        email: 'Email',
        delete_confirm: 'Êtes-vous sûr de vouloir supprimer définitivement {{name}} ? Cette action ne peut pas être annulée et toutes les données seront perdues.',
        yearsOfExperience: 'Années d\'expérience',
        phone: 'Téléphone',
        position: 'Poste',
        address: 'Adresse',
        nationality: 'Nationalité',
        skills: 'Compétences',
        assessment: 'Évaluation',
        workPermits: 'Permis de travail',
        euResident: 'Résident UE',
        euWorkPermit: 'Permis de travail UE',
        experience: 'Expérience',
        education: 'Formation',
        aiSalaryEstimation: 'Estimation IA du salaire',
        recruiterFeedback: 'Retour du recruteur',
        additionalInfo: 'Informations personnelles supplémentaires',
        cvPreview: 'Aperçu du CV'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;