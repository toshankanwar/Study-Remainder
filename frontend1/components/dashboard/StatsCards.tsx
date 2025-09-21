import { Calendar, Clock, BookOpen } from 'lucide-react';
import { StudySchedule } from '@/lib/api';

interface StatsCardsProps {
  schedules: StudySchedule[];
}

export default function StatsCards({ schedules }: StatsCardsProps) {
  const totalSchedules = schedules.length;
  const activeSchedules = schedules.filter(s => s.isActive).length;
  const weeklySchedules = schedules.filter(s => s.isActive && s.days.length > 0).length;

  const stats = [
    {
      title: 'Total Schedules',
      value: totalSchedules,
      icon: Calendar,
      color: 'text-primary-600 bg-primary-100',
    },
    {
      title: 'Active Schedules',
      value: activeSchedules,
      icon: Clock,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'This Week',
      value: weeklySchedules,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <stat.icon className={`h-12 w-12 ${stat.color} rounded-lg p-3`} />
          </div>
        </div>
      ))}
    </div>
  );
}
