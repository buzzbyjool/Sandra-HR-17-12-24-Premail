import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Video, Phone, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCandidateMeetings } from '../../hooks/useCandidateMeetings'; 
import { Meeting, MeetingType } from '../../types/meeting';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { ActivityLogger } from '../../services/activityLogger';
import { useTranslation } from 'react-i18next';
import { useDataContext } from '../../hooks/useDataContext';

interface MeetingSchedulerProps {
  candidateId: string;
}

export default function MeetingScheduler({ candidateId }: MeetingSchedulerProps) {
  const { currentUser } = useAuth();
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useCandidateMeetings(candidateId);
  const { getContextIds } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activityLogger = ActivityLogger.getInstance();
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'video' as MeetingType,
    date: '',
    time: '',
    duration: 30,
    location: '',
    platform: '',
    participants: [''],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const { companyId } = getContextIds();
    if (!companyId) {
      toast.error('Company context required');
      return;
    }

    try {
      setLoading(true);
      const meetingData = {
        ...formData,
        candidateId,
        status: 'scheduled' as const,
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || 'Unknown',
        participants: formData.participants.filter(Boolean)
      };

      if (editingMeeting) {
        await updateMeeting(editingMeeting.id!, meetingData);
        toast.success('Meeting updated successfully');
        await activityLogger.logActivity({
          userId: currentUser.uid,
          type: 'interview_scheduled',
          description: `Updated meeting with ${meetingData.participants.join(', ')}`,
          metadata: {
            meetingId: editingMeeting.id,
            meetingType: meetingData.type, 
            candidateId,
            companyId
          }
        });
      } else {
        const meetingId = await addMeeting(meetingData);
        toast.success('Meeting scheduled successfully');
        
        await activityLogger.logActivity({
          userId: currentUser.uid,
          companyId: companyId!,
          type: 'interview_scheduled',
          description: `Scheduled ${meetingData.type} meeting with ${meetingData.participants.join(', ')}`,
          metadata: {
            meetingType: meetingData.type,
            candidateId,
            meetingId,
            companyId
          }
        });
        
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast.error(editingMeeting ? 'Failed to update meeting' : 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      type: meeting.type,
      date: meeting.date,
      time: meeting.time,
      duration: meeting.duration,
      location: meeting.location || '',
      platform: meeting.platform || '',
      participants: meeting.participants,
      notes: meeting.notes || ''
    });
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (meetingId: string) => {
    try {
      setLoading(true);
      await deleteMeeting(meetingId);
      setOpenMenuId(null);
      toast.success('Meeting cancelled successfully');
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      toast.error('Failed to cancel meeting');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'video',
      date: '',
      time: '',
      duration: 30,
      location: '',
      platform: '',
      participants: [''],
      notes: ''
    });
    setEditingMeeting(null);
  };

  const getMeetingIcon = (type: MeetingType) => {
    switch (type) {
      case 'video':
        return Video;
      case 'phone':
        return Phone;
      case 'on-site':
        return MapPin;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Meetings</h3>
          <p className="text-sm text-gray-500 mt-1">
            {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} scheduled
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }} 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 
            rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 
            shadow-sm hover:shadow group"
        >
          <Calendar size={16} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
          <span className="font-medium">Schedule Meeting</span>
        </button>
      </div>

      <div className="space-y-4 mt-4">
        {meetings.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Calendar className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-500">No meetings scheduled yet</p>
          </div>
        ) : meetings.map((meeting) => {
          const Icon = getMeetingIcon(meeting.type);
          return (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 
                border border-gray-200/60 hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Icon className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {meeting.type === 'on-site' ? 'On-site Interview' :
                       meeting.type === 'video' ? 'Video Conference' : 'Phone Call'}
                    </h4>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{new Date(meeting.date).toLocaleDateString()}</span>
                        <Clock size={14} />
                        <span>{meeting.time}</span>
                        <span>({meeting.duration} minutes)</span>
                      </div>
                      {meeting.type === 'on-site' && meeting.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span>{meeting.location}</span>
                        </div>
                      )}
                      {meeting.type === 'video' && meeting.platform && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Video size={14} />
                          <span>{meeting.platform}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={14} />
                        <span>{meeting.participants.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === meeting.id ? null : meeting.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenuId === meeting.id && (
                    <div className="absolute right-0 mt-1 py-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button
                        onClick={() => handleEdit(meeting)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(meeting.id!)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {meeting.notes && (
                <div className="mt-3 pl-10">
                  <p className="text-sm text-gray-600">{meeting.notes}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as MeetingType })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="video">Video Conference</option>
                  <option value="phone">Phone Call</option>
                  <option value="on-site">On-site Interview</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {formData.type === 'on-site' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter meeting location"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="e.g., Zoom, Google Meet"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participants
                </label>
                <div className="space-y-2">
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={participant}
                        onChange={(e) => {
                          const newParticipants = [...formData.participants];
                          newParticipants[index] = e.target.value;
                          setFormData({ ...formData, participants: newParticipants });
                        }}
                        placeholder="Enter participant name or email"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {index === formData.participants.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            participants: [...formData.participants, '']
                          })}
                          className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          Add
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const newParticipants = formData.participants.filter((_, i) => i !== index);
                            setFormData({ ...formData, participants: newParticipants });
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes/Agenda
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Add meeting agenda or notes..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingMeeting ? 'Save Changes' : 'Schedule Meeting')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
}