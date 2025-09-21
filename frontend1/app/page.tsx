'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, Mail } from 'lucide-react';
import Loading from './dashboard/loading';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
              <span className="text-xl font-semibold text-gray-900">Study Reminder</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Never Miss Your
            <span className="text-primary-600"> Study Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Set up personalized study schedules and get email reminders 10 minutes before your study sessions. 
            Stay organized and achieve your learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Start Free Today
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Already have an account?
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">
              Set up study schedules for any topic, time, and days of the week that work for you.
            </p>
          </div>
          <div className="text-center p-6">
            <Mail className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Reminders</h3>
            <p className="text-gray-600">
              Receive beautiful email reminders 10 minutes before your scheduled study time.
            </p>
          </div>
          <div className="text-center p-6">
            <Clock className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Consistent</h3>
            <p className="text-gray-600">
              Build consistent study habits with automated reminders and progress tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
