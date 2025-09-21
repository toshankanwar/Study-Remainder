'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { studyAPI, StudySchedule } from '@/lib/api';
import Header from '@/components/dashboard/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import StudyScheduleForm from '@/components/dashboard/StudyScheduleForm';
import StudyScheduleList from '@/components/dashboard/StudyScheduleList';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<StudySchedule | null>(null);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const response = await studyAPI.getAll();
      if (response.data.success) {
        setSchedules(response.data.data!.schedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load study schedules');
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleScheduleCreated = (newSchedule: StudySchedule) => {
    setSchedules([newSchedule, ...schedules]);
    setShowForm(false);
    toast.success('Study schedule created successfully!');
  };

  const handleScheduleUpdated = (updatedSchedule: StudySchedule) => {
    setSchedules(schedules.map(schedule => 
      schedule._id === updatedSchedule._id ? updatedSchedule : schedule
    ));
    setEditingSchedule(null);
    setShowForm(false);
    toast.success('Study schedule updated successfully!');
  };

  const handleScheduleDeleted = (deletedId: string) => {
    setSchedules(schedules.filter(schedule => schedule._id !== deletedId));
    toast.success('Study schedule deleted successfully!');
  };

  const handleScheduleToggled = (toggledSchedule: StudySchedule) => {
    setSchedules(schedules.map(schedule => 
      schedule._id === toggledSchedule._id ? toggledSchedule : schedule
    ));
    toast.success(`Schedule ${toggledSchedule.isActive ? 'activated' : 'deactivated'} successfully!`);
  };

  const handleEdit = (schedule: StudySchedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Manage your study schedules and stay on track with your learning goals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards schedules={schedules} />
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingSchedule(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Schedule
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <StudyScheduleForm
                schedule={editingSchedule || undefined}
                onScheduleCreated={handleScheduleCreated}
                onScheduleUpdated={handleScheduleUpdated}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Schedules List */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Study Schedules</h3>
          </div>
          <StudyScheduleList
            schedules={schedules}
            loading={loadingSchedules}
            onEdit={handleEdit}
            onDelete={handleScheduleDeleted}
            onToggle={handleScheduleToggled}
          />
        </div>
      </div>
    </div>
  );
}
