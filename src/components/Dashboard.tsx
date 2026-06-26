import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  totalTasks: number;
  completedTasks: number;
  streak: number;
  dailyProgress: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  totalTasks, 
  completedTasks, 
  streak, 
  dailyProgress 
}) => {
  const stats = [
    {
      label: "Objectives",
      value: totalTasks - completedTasks,
      icon: Target,
      color: "text-white"
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-white"
    },
    {
      label: "Streak",
      value: `${streak}d`,
      icon: Zap,
      color: "text-white"
    },
    {
      label: "Efficiency",
      value: `${Math.round(dailyProgress)}%`,
      icon: TrendingUp,
      color: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass premium-shadow p-6 rounded-2xl flex flex-col gap-3 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <stat.icon size={40} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono font-bold">
            {stat.label}
          </span>
          <div className="text-3xl font-syne font-extrabold tracking-tighter">
            {stat.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
