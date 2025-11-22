import { useState } from 'react';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  const [type, setType] = useState('login');

  const toggleType = () => {
    setType(type === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-400 via-indigo-400 to-pink-300

 overflow-hidden">



      {/* Centered form box */}
      <div className="relative z-10 bg-white/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <AuthForm type={type} toggleType={toggleType} />
      </div>
    </div>
  );
}
