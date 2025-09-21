import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create Account"
      subtitle="Join us to start your study journey"
      icon={<UserPlus className="h-8 w-8 text-primary-600" />}
      footer={
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
