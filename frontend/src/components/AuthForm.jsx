import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  // const BASE_URL = "https://18491e151454.ngrok-free.app";
  

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const isSignUpValid =
    email && isEmailValid(email) && password && confirmPassword && passwordsMatch;

  const isLoginValid =
    loginType === 'email'
      ? email && isEmailValid(email) && password
      : loginType === 'account'
      ? accountNumber && password
      : false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === 'signup') {
        if (!passwordsMatch) {
          toast.error('Passwords do not match');
          return;
        }

        const payload = {
          email,
          password,
          confirmPassword
        };

        const res = await axios.post(`https://18491e151454.ngrok-free.app/signup`, payload, { withCredentials: true });
        toast.success("Signup successful! Please login.");
        toggleType();
        return;
      }

      if (type === 'login') {
        if (!isLoginValid) return;

        const payload =
          loginType === "email"
            ? {
                loginType: "email",
                email,
                password
              }
            : {
                loginType: "account",
                accountNumber,
                password
              };

        const res = await axios.post(`https://18491e151454.ngrok-free.app/login`, payload, { withCredentials: true });

        toast.success("Login successful!");
        localStorage.setItem("isAuthenticated", "true");

        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold mb-2">
        {type === 'signup' ? 'Sign up' : 'Login'}
      </h1>
      <p className="text-gray-700 mb-6">
        {type === 'signup' ? 'Create your account' : 'Access your account'}
      </p>

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

      {(type === 'signup' || loginType === 'email') && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 border border-black rounded w-full focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
          />
        </>
      )}

      {type === 'login' && loginType === 'account' && (
        <>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="mb-4 p-3 border border-black rounded w-full focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 transition"
          />
        </>
      )}

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
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
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

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-800 transition"
        disabled={type === 'signup' ? !isSignUpValid : !isLoginValid}
      >
        {type === 'signup' ? 'Sign up' : 'Login'}
      </button>

      <p className="text-center mt-4 text-gray-600">
        {type === 'signup' ? (
          <>
            Already have an account?{' '}
            <span className="text-black cursor-pointer font-semibold" onClick={toggleType}>
              Login
            </span>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <span className="text-black cursor-pointer font-semibold" onClick={toggleType}>
              Sign up
            </span>
          </>
        )}
      </p>
    </form>
  );
}
