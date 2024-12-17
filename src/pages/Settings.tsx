import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSettings from '../components/settings/LanguageSettings';

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('sidebar.settings')}</h1>
      
      <LanguageSettings />
    </div>
  );
}