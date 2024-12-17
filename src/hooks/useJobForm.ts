import { useState } from 'react';
import { useJobs } from './useJobs';
import { useDataContext } from './useDataContext';

export interface JobFormData {
  title: string;
  reference?: string;
  company: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
}

export function useJobForm() {
  const { add, error: jobError } = useJobs();
  const { getContextIds } = useDataContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const defaultFormData: JobFormData = {
    title: '',
    reference: '',
    company: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
  };
  
  const [formData, setFormData] = useState<JobFormData>(defaultFormData);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const { companyId, teamIds } = getContextIds();

    if (!companyId) {
      setError('Company context required to create job');
      setLoading(false);
      return;
    }

    try {
      const jobData = {
        ...formData,
        companyId,
        teamId: teamIds[0] || null,
        status: 'Active',
        requirements: formData.requirements.split('\n').filter(Boolean),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const jobId = await add(jobData);
      return jobId;
    } catch (err) {
      const error = err as Error;
      console.error('Error creating job:', error);
      setError(error.message || 'Failed to create job. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setError(null);
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    handleSubmit,
    resetForm,
  };
}