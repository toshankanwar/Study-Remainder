import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { studyAPI } from '../lib/api';
import StudyScheduleForm from '../components/StudyScheduleForm';
import StudyScheduleList from '../components/StudyScheduleList';
import { Calendar, Clock, BookOpen, Plus, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSchedules();
    }
  }, [isAuthenticated]);

  const fetchSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const response = await studyAPI.getAll();
      if (response.data.success) {
        setSchedules(response.data.data.schedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load study schedules');
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleScheduleCreated = (newSchedule) => {
    setSchedules([newSchedule, ...schedules]);
    setShowForm(false);
    toast.success('Study schedule created successfully!');
  };

  const handleScheduleUpdated = (updatedSchedule) => {
    setSchedules(schedules.map(schedule => 
      schedule._id === updatedSchedule._id ? updatedSchedule : schedule
    ));
    setEditingSchedule(null);
    setShowForm(false);
    toast.success('Study schedule updated successfully!');
  };

  const handleScheduleDeleted = (deletedId) => {
    setSchedules(schedules.filter(schedule => schedule._id !== deletedId));
    toast.success('Study schedule deleted successfully!');
  };

  const handleScheduleToggled = (toggledSchedule) => {
    setSchedules(schedules.map(schedule => 
      schedule._id === toggledSchedule._id ? toggledSchedule : schedule
    ));
    toast.success(`Schedule ${toggledSchedule.isActive ? 'activated' : 'deactivated'} successfully!`);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const activeSchedules = schedules.filter(s => s.isActive);
  const totalSchedules = schedules.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Study Reminder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Manage your study schedules and stay on track with your learning goals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Schedules</p>
                <p className="text-3xl font-bold text-gray-900">{totalSchedules}</p>
              </div>
              <Calendar className="h-12 w-12 text-indigo-600 bg-indigo-100 rounded-lg p-3" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Schedules</p>
                <p className="text-3xl font-bold text-green-600">{activeSchedules.length}</p>
              </div>
              <Clock className="h-12 w-12 text-green-600 bg-green-100 rounded-lg p-3" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-blue-600">
                  {schedules.filter(s => s.isActive && s.days.length > 0).length}
                </p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-600 bg-blue-100 rounded-lg p-3" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingSchedule(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
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
                schedule={editingSchedule}
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
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
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
