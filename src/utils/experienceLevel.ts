export type ExperienceLevel = 'junior' | 'medior' | 'senior';

export function getExperienceLevel(years?: number): ExperienceLevel {
  if (years === undefined) return 'junior';
  if (years <= 3) return 'junior';
  if (years <= 6) return 'medior';
  return 'senior';
}

export const experienceLevelColors = {
  junior: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100'
  },
  medior: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100'
  },
  senior: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100'
  }
};