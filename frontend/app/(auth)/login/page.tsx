import Link from 'next/link';
import { LogIn } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your study reminder account"
      icon={<LogIn className="h-8 w-8 text-primary-600" />}
      footer={
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up here
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
