import { useState } from 'react';
import { studyAPI } from '../lib/api';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  FileText,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudyScheduleList({ 
  schedules, 
  loading, 
  onEdit, 
  onDelete, 
  onToggle 
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleDelete = async (schedule) => {
    if (!window.confirm(`Are you sure you want to delete "${schedule.studyTopic}"?`)) {
      return;
    }

    try {
      setDeletingId(schedule._id);
      await studyAPI.delete(schedule._id);
      onDelete(schedule._id);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (schedule) => {
    try {
      setTogglingId(schedule._id);
      const response = await studyAPI.toggle(schedule._id);
      if (response.data.success) {
        onToggle(response.data.data.schedule);
      }
    } catch (error) {
      console.error('Error toggling schedule:', error);
      toast.error('Failed to toggle schedule status');
    } finally {
      setTogglingId(null);
    }
  };

  const formatDays = (days) => {
    if (!days || days.length === 0) return 'No days selected';
    
    const dayNames = {
      monday: 'Mon',
      tuesday: 'Tue', 
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };
    
    return days.map(day => dayNames[day]).join(', ');
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-20 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="p-12 text-center">
        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Schedules</h3>
        <p className="text-gray-500 mb-4">
          Create your first study schedule to get started with reminders.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {schedules.map((schedule) => (
        <div key={schedule._id} className="p-6 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {schedule.studyTopic}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    schedule.isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {schedule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Time:</span>
                  <span className="ml-1">{formatTime(schedule.studyTime)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Days:</span>
                  <span className="ml-1">{formatDays(schedule.days)}</span>
                </div>
              </div>

              {/* Description */}
              {schedule.description && (
                <div className="flex items-start text-sm text-gray-600 mb-4">
                  <FileText className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="ml-1 text-gray-500 mt-1 leading-relaxed">
                      {schedule.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Last reminder info */}
              {schedule.reminderSent && (
                <div className="flex items-center text-xs text-gray-500">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Last reminder sent: {new Date(schedule.reminderSent).toLocaleString()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleToggle(schedule)}
                disabled={togglingId === schedule._id}
                className={`p-2 rounded-lg transition-colors ${
                  schedule.isActive
                    ? 'text-green-600 hover:bg-green-100'
                    : 'text-gray-400 hover:bg-gray-100'
                } ${togglingId === schedule._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={schedule.isActive ? 'Deactivate schedule' : 'Activate schedule'}
              >
                {togglingId === schedule._id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : schedule.isActive ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => onEdit(schedule)}
                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                title="Edit schedule"
              >
                <Edit3 className="h-5 w-5" />
              </button>

              <button
                onClick={() => handleDelete(schedule)}
                disabled={deletingId === schedule._id}
                className={`p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors ${
                  deletingId === schedule._id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Delete schedule"
              >
                {deletingId === schedule._id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
