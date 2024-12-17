import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Bot, Inbox, Search, UserCheck, Send, Users, Award, GitBranch } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { useCandidateJobs } from '../hooks/useCandidateJobs';
import { useCandidates } from '../hooks/useCandidates';
import DragPreview from '../components/dnd/DragPreview';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { DroppableContainer } from '../components/dnd/DroppableContainer';
import { CandidateCard } from '../components/dnd/CandidateCard';
import JobMenu from '../components/JobMenu';
import AddJobModal from '../components/AddJobModal';
import AddCandidateModal from '../components/AddCandidateModal';
import AnimatedButton from '../components/AnimatedButton';

const stages = [
  { 
    id: 'new',
    title: 'pipeline.stages.new',
    icon: Inbox,
    color: '#F9FAFB',
    borderColor: '#E5E7EB',
    textColor: '#374151'
  },
  { 
    id: 'screening',
    title: 'pipeline.stages.screening',
    icon: Search,
    color: '#F9FAFB',
    borderColor: '#E5E7EB', 
    textColor: '#374151'
  },
  { 
    id: 'interview',
    title: 'pipeline.stages.interview',
    icon: UserCheck,
    color: '#F9FAFB',
    borderColor: '#E5E7EB',
    textColor: '#374151'
  },
  { 
    id: 'submitted',
    title: 'pipeline.stages.submitted',
    icon: Send,
    color: '#F9FAFB',
    borderColor: '#E5E7EB',
    textColor: '#374151'
  },
  { 
    id: 'hr',
    title: 'pipeline.stages.hr',
    icon: Users,
    color: '#F9FAFB',
    borderColor: '#E5E7EB',
    textColor: '#374151'
  },
  { 
    id: 'manager',
    title: 'pipeline.stages.manager',
    icon: Award,
    color: '#F9FAFB',
    borderColor: '#E5E7EB',
    textColor: '#374151'
  }
];

export default function Pipeline() {
  const { t } = useTranslation();
  const { documents: candidates } = useCandidates();
  const { documents: jobs } = useJobs('Active'); // Only get active jobs
  const { documents: candidateJobs } = useCandidateJobs();
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);

  const { activeId, handleDragStart, handleDragEnd, handleDragCancel } = useDragAndDrop({
    onDragStart: (id) => {
      const candidate = candidates.find(c => c.id === id);
      setDraggedCandidate(candidate || null);
    },
    onDragEnd: () => setDraggedCandidate(null),
    onDragCancel: () => setDraggedCandidate(null)
  });

  // Configure sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // Filter candidates to only show those with job assignments
  const candidatesWithJobs = useMemo(() => candidates.filter(candidate => {
    const candidateJobAssignments = candidateJobs.filter(cj => 
      cj.candidateId === candidate.id && 
      (selectedJobId ? cj.jobId === selectedJobId : true)
    );
    return candidateJobAssignments.length > 0;
  }), [candidates, candidateJobs, selectedJobId]);

  // Get candidate's job associations
  const getCandidateJobs = useCallback((candidateId: string) => {
    return candidateJobs
      .filter(cj => cj.candidateId === candidateId)
      .map(cj => jobs.find(j => j.id === cj.jobId))
      .filter(Boolean);
  }, [candidateJobs, jobs]);

  // Memoize filtered candidates by stage
  const candidatesByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.id] = candidatesWithJobs.filter(c => c.stage === stage.id);
      return acc;
    }, {} as Record<string, typeof candidatesWithJobs>);
  }, [candidatesWithJobs]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{t('pipeline.title')}</h1>
          <div className="mt-1 text-gray-500 flex items-center gap-2">
            <GitBranch
              className="text-indigo-500"
              size={18}
              style={{
                transform: 'rotate(180deg)'
              }}
            >
            </GitBranch>
            {t('pipeline.subtitle')}
          </div>
        </div>
        <div className="flex gap-4">
          <AnimatedButton
            onClick={() => setIsAddingJob(true)}
            label={t('jobs.add')}
          />
          <AnimatedButton
            onClick={() => setIsAddModalOpen(true)}
            label={t('pipeline.add')}
          />
        </div>
      </div>

      <JobMenu 
        onSelectJob={setSelectedJobId} 
        selectedJobId={selectedJobId} 
        className="sticky top-[4.5rem] z-20 bg-white/80 backdrop-blur-sm p-4 -mx-4 shadow-sm border-b border-gray-200"
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stages.map((stage) => (
            <div key={stage.id} className="space-y-4">
              <div className={`flex items-center justify-between px-2 transition-opacity duration-200 ${
                selectedJobId ? 'opacity-100' : 'opacity-75'
              }`}>
                <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-gray-700">
                  <stage.icon size={16} className="text-gray-500" />
                  <span>{t(stage.title)}</span>
                </h3>
                <span className="text-sm font-medium px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: stage.color,
                    color: '#374151'
                  }}>
                  ({candidatesByStage[stage.id].length})
                </span>
              </div>

              <DroppableContainer 
                id={stage.id}
                color={stage.color}
                borderColor={stage.borderColor}>
                {candidatesByStage[stage.id].map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    getCandidateJobs={getCandidateJobs}
                    showAllJobs={false}
                  />
                ))}
              </DroppableContainer>
            </div>
          ))}
        </div>

        <DragPreview candidate={draggedCandidate} />
      </DndContext>

      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        jobId={selectedJobId}
      />

      <AddJobModal
        isOpen={isAddingJob}
        onClose={() => setIsAddingJob(false)}
      />
    </div>
  );
}