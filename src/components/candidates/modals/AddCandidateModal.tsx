import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useCandidates } from '../../../hooks/useCandidates';
import { useCandidateJobs } from '../../../hooks/useCandidateJobs';
import { sendAnalysisWebhook } from '../../../services/webhookService';
import FileUpload from '../../FileUpload';
import { useDataContext } from '../../../hooks/useDataContext';
import { useAuth } from '../../../contexts/AuthContext';
import confetti from 'canvas-confetti';
import BasicInfoForm from '../forms/BasicInfoForm';
import ExperienceForm from '../forms/ExperienceForm';
import EducationForm from '../forms/EducationForm';
import LanguageForm from '../forms/LanguageForm';
import AssessmentForm from '../forms/AssessmentForm';
import { CandidateFormData } from '../../../types/candidate';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string | null;
}

const defaultFormData: CandidateFormData = {
  name: '',
  surname: '',
  yearsOfExperience: '',
  email: '',
  phone: '',
  position: '',
  company: '',
  skills: '',
  location: '',
  address: '',
  nationality: '',
  residentInEU: false,
  workPermitEU: false,
  iaSalaryEstimation: '',
  sandraFeedback: '',
  notes: '',
  experience: [],
  education: [],
  languages: [],
  rating: 0,
  cvUrl: ''
};

export default function AddCandidateModal({ isOpen, onClose, jobId }: AddCandidateModalProps) {
  const { t, i18n } = useTranslation();
  const { add } = useCandidates();
  const { add: addCandidateJob } = useCandidateJobs();
  const { currentUser } = useAuth();
  const { getContextIds } = useDataContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CandidateFormData>(defaultFormData);

  const resetFormData = () => {
    setFormData(defaultFormData);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { companyId } = getContextIds();

    if (!companyId) {
      setError('Company context required');
      setLoading(false);
      return;
    }
    
    if (!formData.name || !formData.email || !formData.position) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const candidateData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        stage: 'new',
        status: 'In Progress',
        source: analyzing ? 'IA Web' : 'Manual Web' as const,
        companyId,
        rating: formData.rating
      };

      const candidateId = await add(candidateData);
      
      // If a job was selected, create the relationship
      if (jobId) {
        await addCandidateJob({
          candidateId,
          jobId,
          companyId,
          status: 'in_progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      onClose();
      resetFormData();
    } catch (err) {
      const error = err as Error;
      console.error('Error adding candidate:', error);
      setError(error.message || t('errors.add_candidate'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || analyzing || !formData.cvUrl) return;
    
    try {
      setAnalyzing(true);
      setWebhookError(null);
      const toastId = toast.loading('Starting CV analysis...');
      
      const { companyId, teamIds, userId } = getContextIds();
      if (!companyId || !userId) {
        throw new Error('Missing required context');
      }

      await sendAnalysisWebhook({
        fileUrl: formData.cvUrl,
        userId,
        teamId: teamIds[0] || null,
        companyId,
        userName: currentUser?.displayName || '',
        userEmail: currentUser?.email || '',
        metadata: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          cvUrl: formData.cvUrl,
          preferredLanguage: i18n.language as 'en' | 'fr'
        }
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success('Analysis started successfully', { id: toastId });
      resetFormData();
      onClose();
    } catch (err) {
      console.error('Error analyzing CV:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze CV';
      setWebhookError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  {t('pipeline.add')}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <FileUpload
                    onFileSelect={setSelectedFile}
                    selectedFile={selectedFile}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, cvUrl: url }))}
                    onClear={() => {
                      setSelectedFile(null);
                      setFormData(prev => ({ ...prev, cvUrl: '' }));
                    }}
                  />

                  <button
                    type="button"
                    disabled={!selectedFile || analyzing}
                    onClick={handleAnalyze}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed group hover:from-indigo-500 hover:to-blue-400 transition-all duration-200"
                  >
                    <Bot size={20} className="group-hover:animate-pulse" />
                    {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFullForm(!showFullForm)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={20} />
                    {showFullForm ? 'Hide Manual Form' : 'Show Manual Form'}
                  </button>
                </div>

                <AnimatePresence>
                  {showFullForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-8 overflow-hidden"
                    >
                      <BasicInfoForm formData={formData} onChange={setFormData} />
                      <ExperienceForm formData={formData} onChange={setFormData} />
                      <EducationForm formData={formData} onChange={setFormData} />
                      <LanguageForm formData={formData} onChange={setFormData} />
                      <AssessmentForm formData={formData} onChange={setFormData} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? t('common.adding') : t('common.add')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}