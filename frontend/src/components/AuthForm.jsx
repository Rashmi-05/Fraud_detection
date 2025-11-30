import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AuthForm({ type, toggleType }) {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const isSignUpValid =
    email && isEmailValid(email) && password && confirmPassword && passwordsMatch;
  const isLoginValid =
    loginType === 'email'
      ? email && isEmailValid(email) && password
      : loginType === 'account'
        ? accountNumber
        : false;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === 'signup') {
      if (!passwordsMatch) {
        toast.error('Passwords do not match');
        return;
      }
      // Simulate signup success
      toast.success('Signup successful! Please login.');
      toggleType(); // Switch to login page
      return;
    }

    if (type === 'login') {
      if (!isLoginValid) return;

      // Simulate login success
      // In real app, call API to authenticate
      toast.success('Login successful!');
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard'); // Redirect to dashboard
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold mb-2">{type === 'signup' ? 'Sign up' : 'Login'}</h1>
      <p className="text-gray-700 mb-6">{type === 'signup' ? 'Create your account' : 'Access your account'}</p>

      {/* Login method tabs */}
      {type === 'login' && (
        <div className="flex mb-4 border-b border-gray-500">
          <button
            type="button"
            onClick={() => setLoginType('email')}
            className={`flex-1 py-2 text-center transition cursor-pointer border-b-2 ${
              loginType === 'email'
                ? 'border-gray-900 font-semibold text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType('account')}
            className={`flex-1 py-2 text-center transition cursor-pointer border-b-2 ${
              loginType === 'account'
                ? 'border-gray-900 font-semibold text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Account Number
          </button>
        </div>
      )}

      {/* Email login/signup */}
      {(type === 'signup' || loginType === 'email') && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 border border-black rounded w-full focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-black rounded focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 flex items-center justify-center"
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </span>
          </div>
          {type === 'signup' && (
            <>
              <div className="relative mb-1">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 border rounded focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-black'
                  }`}
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 flex items-center justify-center"
                >
                  {showConfirm ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </span>
              </div>
              {confirmPassword.length > 0 && (
                <p
                  className={`text-sm mt-1 ${
                    passwordsMatch ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </>
          )}
        </>
      )}

      {/* Account login */}
      {loginType === 'account' && type === 'login' && (
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="mb-4 p-3 border border-black rounded w-full focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
        />
      )}

      <button
        type="submit"
        disabled={type === 'signup' ? !isSignUpValid : !isLoginValid}
        className={`w-full py-3 rounded text-white transition cursor-pointer ${
          type === 'signup'
            ? !isSignUpValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
            : !isLoginValid
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        }`}
      >
        {type === 'signup' ? 'Sign up' : 'Login'}
      </button>

      <p className="mt-4 text-sm text-center text-gray-700">
        {type === 'signup' ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={toggleType}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={toggleType}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Sign up
            </button>
          </>
        )}
      </p>
    </form>
  );
}
