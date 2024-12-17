import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';
import { PanelRightClose, PanelRightOpen, Users } from 'lucide-react';
import { useSearchStore } from '../../stores/searchStore';
import CandidateSearch from './CandidateSearch';
import { useCandidates } from '../../hooks/useCandidates';
import AnimatedButton from '../AnimatedButton';
import AddCandidateModal from '../AddCandidateModal';
import CandidateSlider from './CandidateSlider';
import { toast } from 'react-hot-toast';

interface CandidateListPanelProps {
  onSelectCandidate: (id: string) => void;
  selectedCandidateId: string | null;
  onDeleteCandidate?: (id: string) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function CandidateListPanel({ 
  onSelectCandidate, 
  selectedCandidateId,
  onDeleteCandidate 
}: CandidateListPanelProps) {
  const { t } = useTranslation();
  const { showPreviewPanel, togglePreviewPanel, candidatesPerPage, setCandidatesPerPage } = useUIStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const { query, setQuery, filters, setFilters, sort, setSort } = useSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { documents: candidates, remove } = useCandidates();

  // Filter candidates based on search query and filters
  const filteredCandidates = candidates.filter(candidate => {
    // Search query filter
    if (query) {
      const searchTerm = query.toLowerCase();
      const matchesName = `${candidate.name} ${candidate.surname}`.toLowerCase().includes(searchTerm);
      const matchesPosition = candidate.position.toLowerCase().includes(searchTerm);
      const matchesEmail = candidate.email.toLowerCase().includes(searchTerm);
      const matchesSkills = candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm));
      
      if (!matchesName && !matchesPosition && !matchesEmail && !matchesSkills) {
        return false;
      }
    }

    // Location filter
    if (filters.location.length > 0 && !filters.location.includes(candidate.location || '')) {
      return false;
    }

    // Skills filter
    if (filters.skills.length > 0 && !filters.skills.some(skill => 
      candidate.skills.some(candidateSkill => 
        candidateSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )) {
      return false;
    }

    // Salary range filter
    if (filters.salaryRange.min && (!candidate.iaSalaryEstimation || candidate.iaSalaryEstimation < filters.salaryRange.min)) {
      return false;
    }
    if (filters.salaryRange.max && (!candidate.iaSalaryEstimation || candidate.iaSalaryEstimation > filters.salaryRange.max)) {
      return false;
    }

    return true;
  });

  // Sort filtered candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    
    switch (sort.field) {
      case 'name':
        return direction * `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`);
      case 'rating':
        return direction * (a.rating - b.rating);
      case 'createdAt':
        return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return 0;
    }
  });

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success('Candidate permanently deleted');
      if (selectedCandidateId === id) {
        onSelectCandidate(candidates[0]?.id || '');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('sidebar.candidates')}</h1>
            <div className="mt-1 text-gray-500 flex items-center gap-2">
              <Users className="text-indigo-500" size={18} />
              {t('candidate.subtitle')}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePreviewPanel}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 border border-gray-200 hover:border-indigo-200"
              aria-label={showPreviewPanel ? 'Hide preview panel' : 'Show preview panel'}
            >
              {showPreviewPanel ? (
                <PanelRightClose className="w-5 h-5 transition-transform duration-200" />
              ) : (
                <PanelRightOpen className="w-5 h-5 transition-transform duration-200" />
              )}
            </button>
            <AnimatedButton
              onClick={() => setIsAddModalOpen(true)}
              label={t('pipeline.add')}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <CandidateSearch
            onSearch={(query) => {
              setQuery(query);
              setCurrentPage(1); // Reset to first page when searching
            }}
            onSort={(field, direction) => setSort(field, direction)}
            onFilter={setFilters}
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={candidatesPerPage}
              onChange={(e) => setCandidatesPerPage(Number(e.target.value))}
              className="text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        jobId={null}
      />

      <div className="flex-1 overflow-hidden">
        <CandidateSlider
          candidates={sortedCandidates.slice(
            (currentPage - 1) * candidatesPerPage,
            currentPage * candidatesPerPage
          )}
          onSelectCandidate={onSelectCandidate}
          selectedCandidateId={selectedCandidateId}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}