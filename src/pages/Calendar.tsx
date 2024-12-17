import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Video, Phone, MapPin, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useUpcomingMeetings } from '../hooks/useUpcomingMeetings';
import { useCandidates } from '../hooks/useCandidates';
import { Meeting } from '../types/meeting';

export default function Calendar() {
  const { t } = useTranslation();
  const { meetings, loading } = useUpcomingMeetings();
  const { documents: candidates } = useCandidates();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getMeetingIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'video':
        return Video;
      case 'phone':
        return Phone;
      case 'on-site':
        return MapPin;
      default:
        return CalendarIcon;
    }
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => 
      isSameDay(new Date(meeting.date), date)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-4 text-sm font-medium text-gray-900 text-center"
          >
            {day}
          </div>
        ))}
        {days.map((date, dayIdx) => {
          const dayMeetings = getMeetingsForDate(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          
          return (
            <motion.div
              key={date.toString()}
              initial={false}
              animate={{
                backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
              }}
              className={`min-h-[120px] p-4 relative ${
                !isSameMonth(date, currentDate) ? 'bg-gray-50' : ''
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <span className={`text-sm ${
                !isSameMonth(date, currentDate) ? 'text-gray-400' : 'text-gray-900'
              }`}>
                {format(date, 'd')}
              </span>
              
              <div className="mt-2 space-y-1">
                {dayMeetings.map((meeting) => {
                  const Icon = getMeetingIcon(meeting.type);
                  const candidate = candidates.find(c => c.id === meeting.candidateId);
                  
                  return (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-2 text-xs rounded-lg bg-indigo-50 text-indigo-700"
                    >
                      <div className="flex items-center gap-1">
                        <Icon size={12} />
                        <span className="font-medium truncate">
                          {candidate ? `${candidate.name} ${candidate.surname}` : 'Unknown'}
                        </span>
                      </div>
                      <div className="mt-1 text-indigo-600">
                        {meeting.time}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-medium mb-4">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          <div className="space-y-4">
            {getMeetingsForDate(selectedDate).map((meeting) => {
              const Icon = getMeetingIcon(meeting.type);
              const candidate = candidates.find(c => c.id === meeting.candidateId);
              
              return (
                <div
                  key={meeting.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Icon className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {candidate ? `${candidate.name} ${candidate.surname}` : 'Unknown Candidate'}
                      </h4>
                      <div className="mt-1 space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{meeting.time} ({meeting.duration} minutes)</span>
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
            })}
            {getMeetingsForDate(selectedDate).length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No meetings scheduled for this day
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}