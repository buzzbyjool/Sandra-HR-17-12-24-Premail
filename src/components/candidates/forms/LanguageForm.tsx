import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageFormProps {
  formData: any;
  onChange: (data: any) => void;
}

export default function LanguageForm({ formData, onChange }: LanguageFormProps) {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState({
    language: '',
    proficiency: 'Basic'
  });

  const addLanguage = () => {
    if (currentLanguage.language && currentLanguage.proficiency) {
      onChange({
        ...formData,
        languages: [...(formData.languages || []), currentLanguage]
      });
      setCurrentLanguage({
        language: '',
        proficiency: 'Basic'
      });
    }
  };

  const removeLanguage = (index: number) => {
    onChange({
      ...formData,
      languages: formData.languages.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Languages</h3>
      
      {formData.languages?.map((lang: any, index: number) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
          <button
            type="button"
            onClick={() => removeLanguage(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          >
            <X size={16} />
          </button>
          <p className="font-medium">{lang.language}</p>
          <p className="text-sm text-gray-500">{lang.proficiency}</p>
        </div>
      ))}

      <div className="space-y-3">
        <input
          type="text"
          value={currentLanguage.language}
          onChange={(e) => setCurrentLanguage(prev => ({ ...prev, language: e.target.value }))}
          placeholder="Language"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={currentLanguage.proficiency}
          onChange={(e) => setCurrentLanguage(prev => ({ ...prev, proficiency: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="Basic">Basic</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Fluent">Fluent</option>
          <option value="Native">Native</option>
        </select>
        <button
          type="button"
          onClick={addLanguage}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          <Plus size={16} className="inline mr-2" />
          Add Language
        </button>
      </div>
    </div>
  );
}