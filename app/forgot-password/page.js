"use client";
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/Firebasepage';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.');
    } catch (err) {
      setError('حدث خطأ أثناء محاولة استعادة كلمة المرور. تأكد من البريد الإلكتروني.');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center text-gray-800">
          استعادة كلمة المرور
        </h1>
        <form onSubmit={handlePasswordReset} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && (
            <p className="text-green-600 text-sm mb-2">{message}</p>
          )}
          {error && (
            <p className="text-red-600 text-sm mb-2">{error}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            إرسال رابط الاستعادة
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
