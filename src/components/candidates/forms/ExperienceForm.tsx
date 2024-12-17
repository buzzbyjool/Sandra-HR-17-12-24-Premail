import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ExperienceFormProps {
  formData: any;
  onChange: (data: any) => void;
}

export default function ExperienceForm({ formData, onChange }: ExperienceFormProps) {
  const { t } = useTranslation();
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    period: '',
    description: ''
  });

  const addExperience = () => {
    if (currentExperience.title && currentExperience.company) {
      onChange({
        ...formData,
        experience: [...(formData.experience || []), currentExperience]
      });
      setCurrentExperience({
        title: '',
        company: '',
        period: '',
        description: ''
      });
    }
  };

  const removeExperience = (index: number) => {
    onChange({
      ...formData,
      experience: formData.experience.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{t('candidate.experience')}</h3>
      
      {formData.experience?.map((exp: any, index: number) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
          <button
            type="button"
            onClick={() => removeExperience(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          >
            <X size={16} />
          </button>
          <p className="font-medium">{exp.title}</p>
          <p className="text-sm text-gray-500">{exp.company} • {exp.period}</p>
          {exp.description && <p className="mt-2 text-gray-600">{exp.description}</p>}
        </div>
      ))}

      <div className="space-y-3">
        <input
          type="text"
          value={currentExperience.title}
          onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Job Title"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          value={currentExperience.company}
          onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
          placeholder="Company"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          value={currentExperience.period}
          onChange={(e) => setCurrentExperience(prev => ({ ...prev, period: e.target.value }))}
          placeholder="Period (e.g., 2020 - 2023)"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <textarea
          value={currentExperience.description}
          onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description"
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={addExperience}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          <Plus size={16} className="inline mr-2" />
          Add Experience
        </button>
      </div>
    </div>
  );
}