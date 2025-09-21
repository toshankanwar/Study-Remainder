import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer, icon }: AuthCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
      <div className="text-center mb-8">
        {icon && (
          <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            {icon}
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      </div>
      
      {children}
      
      {footer && (
        <div className="mt-6 text-center">
          {footer}
        </div>
      )}
    </div>
  );
}
