import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Calendar, Video, Phone, MapPin, Users, Clock, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isWithinInterval, startOfDay, addDays } from 'date-fns';
import { Meeting } from '../../types/meeting';
import { useCandidates } from '../../hooks/useCandidates';

interface UpcomingMeetingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: Meeting[];
}

export default function UpcomingMeetingsPopup({ isOpen, onClose, meetings }: UpcomingMeetingsPopupProps) {
  const navigate = useNavigate();
  const { documents: candidates } = useCandidates();
  const today = startOfDay(new Date());
  const nextWeek = addDays(today, 7);

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

  const getMeetingUrgencyColor = (date: string) => {
    const meetingDate = new Date(date);
    if (isWithinInterval(meetingDate, { start: today, end: addDays(today, 1) })) {
      return 'bg-red-50 text-red-700 border-red-100';
    }
    if (isWithinInterval(meetingDate, { start: today, end: nextWeek })) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }
    return 'bg-gray-50 text-gray-700 border-gray-100';
  };

  const sortedMeetings = [...meetings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-start justify-center min-h-screen pt-16">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            {sortedMeetings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No upcoming meetings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedMeetings.map((meeting) => {
                  const Icon = getMeetingIcon(meeting.type);
                  const candidate = candidates.find(c => c.id === meeting.candidateId);
                  const urgencyColor = getMeetingUrgencyColor(meeting.date);

                  return (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${urgencyColor} transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white/50">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {candidate ? `${candidate.name} ${candidate.surname}` : 'Unknown Candidate'}
                            </h3>
                            <div className="mt-1 space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(meeting.date), 'PPP')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{meeting.time} ({meeting.duration} minutes)</span>
                              </div>
                              {meeting.type === 'on-site' && meeting.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{meeting.location}</span>
                                </div>
                              )}
                              {meeting.type === 'video' && meeting.platform && (
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  <span>{meeting.platform}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{meeting.participants.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                onClose();
                navigate('/calendar');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm 
                font-medium text-indigo-600 bg-white rounded-lg border border-indigo-200 
                hover:bg-indigo-50 transition-colors"
            >
              View All Meetings
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}