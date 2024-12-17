@@ .. @@
 import { useParams, useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { Mail, Phone, MapPin, Building2, Calendar, Star, Link as LinkIcon, Pencil, X, Save, Trash2, Archive } from 'lucide-react';
+import MeetingScheduler from './meetings/MeetingScheduler';
 import { useCandidates } from '../hooks/useCandidates';
 import { useTranslation } from 'react-i18next';
 import CandidateJobList from '../components/CandidateJobList';
@@ .. @@
           <div className="flex items-center justify-between">
             <h1 className="text-2xl font-bold text-gray-800">{candidate.name} {candidate.surname}</h1>
           </div>
+          
+          <div className="mt-6">
+            <MeetingScheduler candidateId={candidate.id!} />
+          </div>
 
           <div className="mt-8">
             <h2 className="text-lg font-semibold mb-4">{t('candidate.basicInfo')}</h2>