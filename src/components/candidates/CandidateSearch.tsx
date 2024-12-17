import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Calendar, Building2, MapPin, DollarSign, GraduationCap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CandidateSearchProps {
  onSearch: (query: string) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onFilter: (filters: FilterState) => void;
}

interface FilterState {
  location: string[];
  experience: string | null;
  skills: string[];
  availability: string | null;
  salaryRange: {
    min: number | null;
    max: number | null;
  };
  employmentType: string[];
}

const experienceLevels = [
  '0-2 years',
  '2-5 years',
  '5-10 years',
  '10+ years'
];

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote'
];

export default function CandidateSearch({ onSearch, onSort, onFilter }: CandidateSearchProps) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    experience: null,
    skills: [],
    availability: null,
    salaryRange: {
      min: null,
      max: null
    },
    employmentType: []
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: [],
      experience: null,
      skills: [],
      availability: null,
      salaryRange: {
        min: null,
        max: null
      },
      employmentType: []
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border transition-colors ${
            showFilters 
              ? 'border-indigo-200 bg-indigo-50 text-indigo-600' 
              : 'border-gray-200 hover:bg-gray-50 text-gray-500'
          }`}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter locations..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onChange={(e) => handleFilterChange('location', e.target.value.split(',').map(l => l.trim()))}
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <select
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Any experience</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="Enter skills (comma separated)"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onChange={(e) => handleFilterChange('skills', e.target.value.split(',').map(s => s.trim()))}
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onChange={(e) => handleFilterChange('salaryRange', {
                        ...filters.salaryRange,
                        min: e.target.value ? parseInt(e.target.value) : null
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onChange={(e) => handleFilterChange('salaryRange', {
                        ...filters.salaryRange,
                        max: e.target.value ? parseInt(e.target.value) : null
                      })}
                    />
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <div className="space-y-2">
                    {employmentTypes.map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.employmentType.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...filters.employmentType, type]
                              : filters.employmentType.filter(t => t !== type);
                            handleFilterChange('employmentType', newTypes);
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mt-6 border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Name (A-Z)', value: 'name-asc', icon: Building2 },
                    { label: 'Name (Z-A)', value: 'name-desc', icon: Building2 },
                    { label: 'Newest first', value: 'date-desc', icon: Calendar },
                    { label: 'Oldest first', value: 'date-asc', icon: Calendar },
                    { label: 'Highest rated', value: 'rating-desc', icon: Star }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const [field, direction] = option.value.split('-');
                        onSort(field, direction as 'asc' | 'desc');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                        bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <option.icon size={16} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}