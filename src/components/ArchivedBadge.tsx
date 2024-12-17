import React from 'react';
import { Archive, RotateCcw } from 'lucide-react';
import { ArchiveReason } from '../types/archive';
import { toast } from 'react-hot-toast';

interface ArchivedBadgeProps {
  reason: ArchiveReason;
  className?: string;
  onStatusChange?: () => void;
  canToggle?: boolean;
  loading?: boolean;
}

const reasonColors: Record<ArchiveReason, { bg: string; text: string }> = {
  hired: { bg: 'bg-green-100', text: 'text-green-800' },
  position_filled: { bg: 'bg-blue-100', text: 'text-blue-800' },
  position_cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  rejected: { bg: 'bg-orange-100', text: 'text-orange-800' },
  withdrawn: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  other: { bg: 'bg-gray-100', text: 'text-gray-800' }
};

export default function ArchivedBadge({ 
  reason, 
  className = '', 
  onStatusChange,
  canToggle = false,
  loading = false
}: ArchivedBadgeProps) {
  const colors = reasonColors[reason];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium relative group
      ${colors.bg} ${colors.text} ${className} ${canToggle ? 'pr-9' : ''}`}>
      <Archive size={14} />
      <span>
        {reason === 'position_filled' ? 'Filled' :
         reason === 'position_cancelled' ? 'Cancelled' :
         reason === 'rejected' ? 'Rejected' :
         reason === 'withdrawn' ? 'Withdrawn' :
         reason.charAt(0).toUpperCase() + reason.slice(1)}
      </span>
      {canToggle && (
        <button
          onClick={onStatusChange}
          disabled={loading}
          className={`absolute right-1.5 p-1.5 rounded-full transition-all duration-200
            ${loading ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 hover:bg-white/80 hover:scale-110'}`}
          title="Change status"
        >
          <RotateCcw 
            size={14} 
            className={`${loading ? 'animate-spin' : 'transform group-hover:rotate-180 transition-transform duration-300'} text-current`} 
          />
        </button>
      )}
    </div>
  );
}