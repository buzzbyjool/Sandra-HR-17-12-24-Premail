import React from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Calendar, Video, Phone, MapPin, Users, X } from 'lucide-react';
import JobBadge from '../JobBadge';
import CandidateQuickView from '../candidates/CandidateQuickView';
import { useCandidateMeetings } from '../../hooks/useCandidateMeetings';
import { Meeting } from '../../types/meeting';
import { format } from 'date-fns';
import { Candidate } from '../../types/candidate';
import { Dialog } from '@headlessui/react';
import { Tooltip } from '../Tooltip';

interface CandidateCardProps {
  candidate: Candidate;
  getCandidateJobs: (candidateId: string) => any[];
  showAllJobs: boolean;
}

export const CandidateCard = React.memo(({ 
  candidate,
  getCandidateJobs,
  showAllJobs
}: CandidateCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: candidate.id!,
  });

  const [showQuickView, setShowQuickView] = React.useState(false);
  const [showMeetings, setShowMeetings] = React.useState(false);
  const { meetings } = useCandidateMeetings(candidate.id!);
  const upcomingMeetings = meetings.filter(m => new Date(m.date) > new Date());

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
  };

  const getMeetingIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'video':
        return Video;
      case 'phone':
        return Phone;
      case 'on-site':
        return MapPin;
      default:
        return Calendar;
    }
  };

  const jobs = getCandidateJobs(candidate.id!);
  const primaryJob = jobs[0];
  const displayedJobs = jobs.slice(0, 3);
  const remainingJobs = jobs.length - 3;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none relative w-full transition-all duration-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        showAllJobs ? 'scale-100' : 'scale-95'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`bg-white rounded-lg p-4 pt-6 shadow-sm border border-gray-200/50 cursor-grab 
        active:cursor-grabbing hover:shadow-md transition-all duration-200 group
        ${showAllJobs ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}>
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={false}
        />
        <div className="absolute top-0 left-0 right-0 h-2 flex gap-1 px-4">
          {displayedJobs.map((job, index) => (
            <motion.div
              key={`${candidate.id}-job-${job.id}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group/indicator cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                className="h-2 rounded-b-full transition-all group-hover/indicator:h-3"
                style={{ 
                  backgroundColor: job.theme?.bgColor || '#E5E7EB',
                  borderColor: job.theme?.borderColor,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  width: index === 0 ? '2rem' : '1.5rem'
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap
                px-2 py-1 text-xs font-medium rounded-md opacity-0 translate-y-1
                group-hover/indicator:opacity-100 group-hover/indicator:translate-y-0
                transition-all duration-200 pointer-events-none z-10
                bg-white shadow-lg border border-gray-100"
                style={{
                  color: job.theme?.color,
                  borderColor: job.theme?.borderColor
                }}
              >
                {job.title}
              </div>
            </motion.div>
          ))}
          {remainingJobs > 0 && (
            <div className="h-2 px-1.5 rounded-b-full bg-gray-100 text-[10px] font-medium text-gray-500
              flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
            >
              +{remainingJobs}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div>
            <div className="font-medium text-gray-900">
              {candidate.name} {candidate.surname}
              {upcomingMeetings.length > 0 && (
                <Tooltip content={`${upcomingMeetings.length} upcoming meeting${upcomingMeetings.length > 1 ? 's' : ''}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMeetings(true);
                    }}
                    className="inline-flex items-center ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 
                      rounded-full text-xs hover:bg-indigo-100 transition-colors"
                  >
                    <Calendar size={12} className="mr-1" />
                    {upcomingMeetings.length}
                  </button>
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {candidate.position}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {displayedJobs.map((job, index) => (
                <div
                  key={`${candidate.id}-job-badge-${job.id}-${index}`}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                    transition-colors duration-200"
                  style={{
                    color: job.theme?.color,
                    backgroundColor: job.theme?.bgColor,
                    borderColor: job.theme?.borderColor
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: job.theme?.color }}
                  />
                  {job.title}
                </div>
              ))}
              {remainingJobs > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickView(true);
                  }}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  +{remainingJobs} more
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickView(true);
          }}
          className="absolute top-3 right-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg 
            opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
        >
          <MoreVertical size={16} />
        </button>
      </div>
      <CandidateQuickView
        candidate={candidate} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
      
      <Dialog
        open={showMeetings}
        onClose={() => setShowMeetings(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Scheduled Meetings</h2>
              <button
                onClick={() => setShowMeetings(false)}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {meetings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No meetings scheduled
                </div>
              ) : (
                meetings.map((meeting) => {
                  const Icon = getMeetingIcon(meeting.type);
                  const isUpcoming = new Date(meeting.date) > new Date();
                  return (
                    <div
                      key={meeting.id}
                      className={`p-4 rounded-lg border ${
                        isUpcoming ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isUpcoming ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              {meeting.type === 'on-site' ? 'On-site Interview' :
                               meeting.type === 'video' ? 'Video Conference' : 'Phone Call'}
                            </h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              isUpcoming 
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {isUpcoming ? 'Upcoming' : 'Completed'}
                            </span>
                          </div>
                          <div className="mt-1 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>
                                {format(new Date(meeting.date), 'PPP')} at {meeting.time}
                              </span>
                            </div>
                            {meeting.type === 'on-site' && meeting.location && (
                              <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>{meeting.location}</span>
                              </div>
                            )}
                            {meeting.type === 'video' && meeting.platform && (
                              <div className="flex items-center gap-2">
                                <Video size={14} />
                                <span>{meeting.platform}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Users size={14} />
                              <span>{meeting.participants.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  setShowMeetings(false);
                  setShowQuickView(true);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                View Candidate Details
              </button>
              <button
                onClick={() => {
                  // Open meeting scheduler
                  setShowMeetings(false);
                  setShowQuickView(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                  rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Schedule Meeting
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </motion.div>
  );
});

CandidateCard.displayName = 'CandidateCard';