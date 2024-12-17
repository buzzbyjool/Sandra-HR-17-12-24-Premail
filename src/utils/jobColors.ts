import { Job } from '../types/job';

// Color palette with accessible combinations
export const jobColors = [
  {
    color: '#4F46E5', // Indigo
    bgColor: 'rgba(79, 70, 229, 0.04)',
    borderColor: 'rgba(79, 70, 229, 0.15)',
    hoverBgColor: 'rgba(79, 70, 229, 0.08)'
  },
  {
    color: '#0891B2', // Cyan
    bgColor: 'rgba(8, 145, 178, 0.04)',
    borderColor: 'rgba(8, 145, 178, 0.15)',
    hoverBgColor: 'rgba(8, 145, 178, 0.08)'
  },
  {
    color: '#059669', // Emerald
    bgColor: 'rgba(5, 150, 105, 0.04)',
    borderColor: 'rgba(5, 150, 105, 0.15)',
    hoverBgColor: 'rgba(5, 150, 105, 0.08)'
  },
  {
    color: '#D97706', // Amber
    bgColor: 'rgba(217, 119, 6, 0.04)',
    borderColor: 'rgba(217, 119, 6, 0.15)',
    hoverBgColor: 'rgba(217, 119, 6, 0.08)'
  },
  {
    color: '#DC2626', // Red
    bgColor: 'rgba(220, 38, 38, 0.04)',
    borderColor: 'rgba(220, 38, 38, 0.15)',
    hoverBgColor: 'rgba(220, 38, 38, 0.08)'
  },
  {
    color: '#7C3AED', // Violet
    bgColor: 'rgba(124, 58, 237, 0.04)',
    borderColor: 'rgba(124, 58, 237, 0.15)',
    hoverBgColor: 'rgba(124, 58, 237, 0.08)'
  },
  {
    color: '#2563EB', // Blue
    bgColor: 'rgba(37, 99, 235, 0.04)',
    borderColor: 'rgba(37, 99, 235, 0.15)',
    hoverBgColor: 'rgba(37, 99, 235, 0.08)'
  },
  {
    color: '#9333EA', // Purple
    bgColor: 'rgba(147, 51, 234, 0.04)',
    borderColor: 'rgba(147, 51, 234, 0.15)',
    hoverBgColor: 'rgba(147, 51, 234, 0.08)'
  }
];

export function assignJobColor(index: number) {
  return jobColors[index % jobColors.length];
}

export function getJobTheme(job: Job, index: number) {
  return {
    ...assignJobColor(index),
    title: job.title,
    department: job.department
  };
}