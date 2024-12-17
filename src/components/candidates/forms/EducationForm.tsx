import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EducationFormProps {
  formData: any;
  onChange: (data: any) => void;
}

export default function EducationForm({ formData, onChange }: EducationFormProps) {
  const { t } = useTranslation();
  const [currentEducation, setCurrentEducation] = useState({
    degree: '',
    institution: '',
    graduationYear: '',
    fieldOfStudy: ''
  });

  const addEducation = () => {
    if (currentEducation.degree && currentEducation.institution) {
      onChange({
        ...formData,
        education: [...(formData.education || []), currentEducation]
      });
      setCurrentEducation({
        degree: '',
        institution: '',
        graduationYear: '',
        fieldOfStudy: ''
      });
    }
  };

  const removeEducation = (index: number) => {
    onChange({
      ...formData,
      education: formData.education.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{t('candidate.education')}</h3>
      
      {formData.education?.map((edu: any, index: number) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
          <button
            type="button"
            onClick={() => removeEducation(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          >
            <X size={16} />
          </button>
          <p className="font-medium">{edu.degree}</p>
          <p className="text-sm text-gray-500">
            {edu.institution} • {edu.graduationYear}
          </p>
          <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
        </div>
      ))}

      <div className="space-y-3">
        <input
          type="text"
          value={currentEducation.degree}
          onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
          placeholder="Degree"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          value={currentEducation.institution}
          onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
          placeholder="Institution"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          value={currentEducation.graduationYear}
          onChange={(e) => setCurrentEducation(prev => ({ ...prev, graduationYear: e.target.value }))}
          placeholder="Graduation Year"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          value={currentEducation.fieldOfStudy}
          onChange={(e) => setCurrentEducation(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
          placeholder="Field of Study"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={addEducation}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          <Plus size={16} className="inline mr-2" />
          Add Education
        </button>
      </div>
    </div>
  );
}