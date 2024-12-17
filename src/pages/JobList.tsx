import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, Building2, Calendar, Briefcase } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';
import AddJobModal from '../components/AddJobModal';
import JobSearchFilters from '../components/jobs/JobSearchFilters';
import ActiveJobsList from '../components/jobs/ActiveJobsList';
import { useJobs } from '../hooks/useJobs';

interface FilterState {
  companies: string[];
  departments: string[];
  locations: string[];
  types: string[];
  experience: string | null;
  education: string | null;
}

export default function JobList() {
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const { documents: jobs } = useJobs('Active');
  const [sortField, setSortField] = useState<'title' | 'company' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    departments: [],
    locations: [],
    types: [],
    experience: null,
    education: null
  });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFiltersChange = React.useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{t('jobs.title')}</h1>
          <div className="mt-1 text-gray-500 flex items-center gap-2">
            <Briefcase className="text-indigo-500" size={18} />
            {t('jobs.subtitle')}
          </div>
        </div>
        <AnimatedButton
          onClick={() => setIsCreating(true)}
          label={t('jobs.add')}
        />
      </div>

      <JobSearchFilters 
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />
      
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">
          {jobs.length} active job opening{jobs.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => handleSort('title')}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            Name
            <ArrowUpDown size={16} />
          </button>
          <button
            onClick={() => handleSort('company')}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <Building2 size={16} className="inline" />
            Company
            <ArrowUpDown size={16} />
          </button>
          <button
            onClick={() => handleSort('createdAt')}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <Calendar size={16} className="inline" />
            Date
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      <ActiveJobsList 
        sortField={sortField} 
        sortDirection={sortDirection}
        filters={filters}
      />

      <AddJobModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </div>
  );
}