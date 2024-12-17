import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Calendar, Building2, MapPin, DollarSign, GraduationCap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ArchiveSearchProps {
  type: 'jobs' | 'candidates';
  onSearch: (filters: any) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
}

export default function ArchiveSearch({ type, onSearch, onSort }: ArchiveSearchProps) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    company: '',
    location: '',
    salaryRange: { min: '', max: '' },
    skills: '',
    experienceLevel: '',
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onSearch({ ...filters, [key]: value, searchTerm });
  };

  const sortOptions = type === 'jobs' ? [
    { value: 'date-desc', label: 'Newest first', icon: Calendar },
    { value: 'date-asc', label: 'Oldest first', icon: Calendar },
    { value: 'company-asc', label: 'Company (A-Z)', icon: Building2 },
    { value: 'company-desc', label: 'Company (Z-A)', icon: Building2 },
    { value: 'salary-desc', label: 'Salary (High-Low)', icon: DollarSign },
    { value: 'salary-asc', label: 'Salary (Low-High)', icon: DollarSign },
    { value: 'location', label: 'Location', icon: MapPin }
  ] : [
    { value: 'date-desc', label: 'Newest first', icon: Calendar },
    { value: 'date-asc', label: 'Oldest first', icon: Calendar },
    { value: 'name-asc', label: 'Name (A-Z)', icon: Building2 },
    { value: 'name-desc', label: 'Name (Z-A)', icon: Building2 },
    { value: 'experience-desc', label: 'Most experienced', icon: GraduationCap },
    { value: 'experience-asc', label: 'Least experienced', icon: GraduationCap },
    { value: 'match-desc', label: 'Best match', icon: Star }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch({ ...filters, searchTerm: e.target.value });
            }}
            placeholder={`Search archived ${type}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
              focus:ring-indigo-500 focus:border-transparent bg-white"
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
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', { 
                        ...filters.dateRange, 
                        start: e.target.value 
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', { 
                        ...filters.dateRange, 
                        end: e.target.value 
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Type-specific filters */}
                {type === 'jobs' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.salaryRange.min}
                          onChange={(e) => handleFilterChange('salaryRange', {
                            ...filters.salaryRange,
                            min: e.target.value
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                            focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.salaryRange.max}
                          onChange={(e) => handleFilterChange('salaryRange', {
                            ...filters.salaryRange,
                            max: e.target.value
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                            focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                      <input
                        type="text"
                        placeholder="Enter skills (comma separated)"
                        value={filters.skills}
                        onChange={(e) => handleFilterChange('skills', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                          focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={filters.experienceLevel}
                        onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                          focus:border-transparent"
                      >
                        <option value="">Any</option>
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          const [field, direction] = option.value.split('-');
                          onSort(field, direction as 'asc' | 'desc');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                          bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Icon size={16} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}