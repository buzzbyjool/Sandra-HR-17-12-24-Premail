import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AssessmentFormProps {
  formData: any;
  onChange: (data: any) => void;
}

export default function AssessmentForm({ formData, onChange }: AssessmentFormProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{t('candidate.assessment')}</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center gap-1">
          {[...Array(10)].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange({ ...formData, rating: index + 1 })}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={`${
                  index < formData.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {formData.rating}/10
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('candidate.aiSalaryEstimation')}
        </label>
        <input
          type="number"
          value={formData.iaSalaryEstimation}
          onChange={(e) => onChange({ ...formData, iaSalaryEstimation: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter estimated salary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('candidate.recruiterFeedback')}
        </label>
        <textarea
          value={formData.sandraFeedback}
          onChange={(e) => onChange({ ...formData, sandraFeedback: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Enter recruiter feedback..."
        />
      </div>
    </div>
  );
}