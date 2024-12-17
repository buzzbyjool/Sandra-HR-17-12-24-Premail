import { useState, useCallback } from 'react';
import { useDataContext } from './useDataContext';
import { ArchiveReason } from '../types/archive';
import { ArchiveService } from '../services/archiveService';
import { ActivityLogger } from '../services/activityLogger';
import { toast } from 'react-hot-toast';

export function useArchive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getContextIds } = useDataContext();
  const archiveService = ArchiveService.getInstance();
  const activityLogger = ActivityLogger.getInstance();

  const permanentlyDelete = async (id: string, type: 'job' | 'candidate') => {
    const { userId, companyId } = getContextIds();
    if (!userId || !companyId) {
      throw new Error('Company context required');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await archiveService.permanentlyDelete(id, type, userId, companyId);
      
      if (!result.success) {
        throw new Error(result.error || `Failed to delete ${type}`);
      }

      await activityLogger.logActivity({
        userId,
        companyId,
        type: `${type}_deleted`,
        description: type === 'job' ? 
          `Job ${result.metadata?.jobTitle} at ${result.metadata?.jobCompany} permanently deleted` :
          'Candidate permanently deleted',
        metadata: {
          id,
          timestamp: new Date().toISOString()
        }
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${type}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const archiveJob = async (jobId: string, reason: ArchiveReason, notes?: string) => {
    const { userId, companyId } = getContextIds();
    if (!userId || !companyId) {
      throw new Error('Company context required');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await archiveService.archiveJob(jobId, userId, companyId, reason, notes);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to archive job');
      }

      await activityLogger.logActivity({
        userId,
        companyId,
        type: 'job_archived',
        description: `Job ${result.metadata?.jobTitle} at ${result.metadata?.jobCompany} archived: ${reason}`,
        metadata: {
          jobId,
          jobTitle: result.metadata?.jobTitle,
          jobCompany: result.metadata?.jobCompany,
          reason,
          notes,
          timestamp: new Date().toISOString()
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error archiving job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive job';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const archiveCandidate = async (candidateId: string, reason: ArchiveReason, notes?: string) => {
    const { userId, companyId } = getContextIds();
    if (!userId || !companyId) {
      throw new Error('Company context required');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await archiveService.archiveCandidate(candidateId, userId, companyId, reason, notes);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to archive candidate');
      }

      await activityLogger.logActivity({
        userId,
        companyId,
        type: 'candidate_archived',
        description: `${result.metadata?.candidateName} archived: ${reason}`,
        metadata: {
          candidateId,
          candidateName: result.metadata?.candidateName,
          reason,
          notes,
          timestamp: new Date().toISOString()
        }
      });

      return result;
    } catch (error) {
      console.error('Error archiving candidate:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive candidate';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const restoreCandidate = async (candidateId: string) => {
    const { userId, companyId } = getContextIds();
    if (!userId || !companyId) {
      throw new Error('Company context required');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await archiveService.restoreCandidate(candidateId, userId, companyId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to restore candidate');
      }

      await activityLogger.logActivity({
        userId,
        companyId,
        type: 'candidate_restored',
        description: `${result.metadata?.candidateName} restored successfully`,
        metadata: {
          candidateId,
          candidateName: result.metadata?.candidateName,
          timestamp: new Date().toISOString()
        }
      });

      return result;
    } catch (error) {
      console.error('Error restoring candidate:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore candidate';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    archiveJob,
    archiveCandidate,
    restoreCandidate,
    permanentlyDelete
  };
}