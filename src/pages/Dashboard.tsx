import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Users, Briefcase, CheckCircle, Clock, TrendingUp, ChevronDown, MoreVertical } from 'lucide-react';
import GreetingPanel from '../components/dashboard/GreetingPanel';
import { useTranslation } from 'react-i18next';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useUserActivity } from '../hooks/useUserActivity';

function formatTimeAgo(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { activities, loading: activitiesLoading } = useUserActivity();
  const [showAllActivities, setShowAllActivities] = useState(false);

  const stageData = metrics ? [
    { name: 'Screening', count: metrics.activeStageMetrics?.screening || 0 },
    { name: 'Interview', count: metrics.activeStageMetrics?.interview || 0 },
    { name: 'Submitted', count: metrics.activeStageMetrics?.submitted || 0 },
    { name: 'HR', count: metrics.activeStageMetrics?.hr || 0 },
    { name: 'Manager', count: metrics.activeStageMetrics?.manager || 0 }
  ] : [];

  const stats = metrics?.activeJobs !== undefined ? [
    { icon: Briefcase, title: t('dashboard.positions'), value: metrics?.activeJobs > 0 ? `${metrics.activeJobs} open` : '0 open' },
    { icon: Users, title: t('dashboard.candidates'), value: metrics?.activeCandidates || 0 },
    { icon: Clock, title: 'Avg. Time to Hire', value: `${metrics?.averageTimeToHire || 0} days` },
    { icon: CheckCircle, title: 'Hired', value: metrics?.stageMetrics?.hired || 0 }
  ] : [
    { icon: Briefcase, title: t('dashboard.positions'), value: '0 open' },
    { icon: Users, title: t('dashboard.candidates'), value: '-' },
    { icon: Clock, title: 'Avg. Time to Hire', value: '-' },
    { icon: CheckCircle, title: 'Hired', value: '0' }
  ];

  const displayedActivities = showAllActivities ? activities : activities.slice(0, 3);

  return (
    <div className="space-y-6">
      <GreetingPanel />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <div className="text-2xl font-bold text-gray-900">
                  {metricsLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
              <stat.icon className="text-indigo-500" size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.candidatesByStage.title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{t('dashboard.candidatesByStage.subtitle')}</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EEF2FF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#E0E7FF" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="borderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dx={-10}
                  domain={[0, 'auto']}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                  formatter={(value) => [`${value} candidates`, 'Count']}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorGradient)"
                  stroke="url(#borderGradient)"
                  strokeWidth={2}
                  name="Candidates"
                  radius={[4, 4, 0, 0]}
                  animationBegin={200}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {stageData.map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-2 rounded-lg bg-indigo-50/50 border border-indigo-100"
              >
                <p className="text-sm font-medium text-indigo-600">{stage.count}</p>
                <p className="text-xs text-gray-600 truncate">{t(`dashboard.candidatesByStage.stages.${stage.name.toLowerCase()}`)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('dashboard.activities.title')}</h2>
            <button
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              {showAllActivities ? t('dashboard.activities.showLess') : t('dashboard.activities.viewAll')}
              <ChevronDown
                size={16}
                className={`transform transition-transform ${showAllActivities ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          <div className="space-y-4">
            {activitiesLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-100 rounded-lg" />
                </div>
              ))
            ) : displayedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {t(activity.description, activity.metadata)}
                  </p>
                  <p className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                </div>
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}