import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Activity, CheckCircle, Sun, Sunrise, Sunset, Moon, ChevronRight } from 'lucide-react';
import { useUserActivity } from '../../hooks/useUserActivity';
import { useUpcomingMeetings } from '../../hooks/useUpcomingMeetings';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const getTimeBasedInfo = (t: (key: string) => string) => {
  const hour = new Date().getHours();
  
  // Time-based background images from Unsplash
  const backgrounds = {
    morning: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2400&q=80', // Sunrise
    afternoon: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=2400&q=80', // Sunny sky
    evening: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?auto=format&fit=crop&w=2400&q=80', // Sunset
    night: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2400&q=80', // Starry sky
  };

  const timeBasedData = {
    5: { greeting: t('dashboard.greeting.morning'), background: backgrounds.morning, action: t('dashboard.actions.morning'), icon: Sunrise },
    12: { greeting: t('dashboard.greeting.afternoon'), background: backgrounds.afternoon, action: t('dashboard.actions.afternoon'), icon: Sun },
    17: { greeting: t('dashboard.greeting.evening'), background: backgrounds.evening, action: t('dashboard.actions.evening'), icon: Sunset },
    22: { greeting: t('dashboard.greeting.night'), background: backgrounds.night, action: t('dashboard.actions.night'), icon: Moon },
  };

  // Find the appropriate time period
  const timeKeys = Object.keys(timeBasedData).map(Number);
  const currentPeriod = timeKeys.reduce((acc, time) => (hour >= time ? time : acc), timeKeys[0]);

  return timeBasedData[currentPeriod as keyof typeof timeBasedData];
};

const getDayBasedAction = (t: (key: string) => string) => {
  const day = new Date().getDay();
  
  const dayActions = {
    1: t('dashboard.actions.monday'),
    5: t('dashboard.actions.friday'),
    0: t('dashboard.actions.weekend'),
    6: t('dashboard.actions.weekend'),
  };

  return dayActions[day as keyof typeof dayActions];
};

export default function GreetingPanel() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activities } = useUserActivity();
  const { meetings } = useUpcomingMeetings();
  const timeInfo = useMemo(() => getTimeBasedInfo(t), [t]);
  const dayAction = useMemo(() => getDayBasedAction(t), [t]);

  // Calculate message counts
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayMessages = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    return activityDate >= today;
  }).length;

  const yesterdayMessages = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    return activityDate >= yesterday && activityDate < today;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl shadow-lg"
      style={{ height: '240px' }}
    >
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${timeInfo.background})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#373F98]/90 to-[#0BDFE7]/80" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 flex items-center gap-3"
          >
            <motion.div
              whileHover={{ 
                scale: 1.2,
                rotate: [0, -10, 10, -10, 10, 0],
                transition: {
                  duration: 0.6,
                  rotate: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1,
                    ease: "easeInOut"
                  }
                }
              }}
              animate={{
                rotate: 0,
                scale: [1, 1.1, 1],
                transition: {
                  scale: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }
                }
              }}
              className="text-white/90"
            >
              <timeInfo.icon className="w-8 h-8" />
            </motion.div>
            {timeInfo.greeting}, {currentUser?.displayName?.split(' ')[0]}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="w-5 h-5" />
              <span>{timeInfo.action}</span>
            </div>
            {dayAction && (
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>{dayAction}</span>
              </div>
            )}
          </motion.div>
        </div>

        {meetings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-white/90 mt-3"
          >
            <Calendar className="w-5 h-5" />
            <span>Next meeting: {format(new Date(meetings[0].date), 'MMM d')} at {meetings[0].time}</span>
            <button
              onClick={() => navigate('/calendar')}
              className="flex items-center gap-1 text-white/70 hover:text-white/90 transition-colors ml-2"
            >
              View Calendar
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-6"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-white/80" />
            <div className="flex flex-col">
              <span className="text-white/90 font-medium">{todayMessages}</span>
              <span className="text-white/60 text-sm">{t('dashboard.activities.today')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-white/80" />
            <div className="flex flex-col">
              <span className="text-white/90 font-medium">{yesterdayMessages}</span>
              <span className="text-white/60 text-sm">{t('dashboard.activities.yesterday')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}