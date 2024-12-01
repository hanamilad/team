"use client";
import React, { useState } from 'react';
import {auth } from '../../firebase/Firebasepage';
import {fetchSignInMethodsForEmail } from 'firebase/auth';
import Breadcrumb from '../../Breadcrumb/page';
import Loading from '../../loading';
import Swal from 'sweetalert2';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('flower'); // افتراضيًا مستخدم عادي
  const [loading, setLoading] = useState(false);
  const [mini_role, setmini_role] = useState('1');

  // دالة لإعادة تعيين الحقول
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('flower');
    setmini_role('1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تحقق مما إذا كان البريد الإلكتروني مسجلاً مسبقًا
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        // البريد الإلكتروني موجود بالفعل
        Swal.fire({
          text: "البريد الإلكتروني مستخدم بالفعل. الرجاء اختيار بريد إلكتروني آخر.",
          icon: "error",
          confirmButtonText: "حسنًا",
        });
        setLoading(false);
        return;
      }
      
      // إرسال البيانات إلى الخادم (API)
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, mini_role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire({
          text: data.message || "تم حفظ البيانات بنجاح",  
          icon: "success",
          confirmButtonText: "حسنًا",
        });
        resetForm();
      } else {
        Swal.fire({
          text: data.message || "حدث خطأ غير متوقع",  
          icon: "error",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        text: "حدث خطأ أثناء الاتصال بالخادم.",
        icon: "error",
        confirmButtonText: "حسنًا",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <section className="bg-gray-100">
          <Breadcrumb name="اضافة مستخدم" />
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
              <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor='name'>اسم المستخدم</label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      type="text"
                      id="name"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor='email'>البريد الإلكتروني</label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      type="email"
                      id="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor='password'>كلمة المرور</label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      type="password"
                      id="password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor='role'>نوع المستخدم</label>
                    <select
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="flower">زهرات</option>
                      <option value="murshidats">مرشدات</option>
                      <option value="Clan">عشيرة</option>
                      <option value="admin">ادمن</option>
                    </select>
                  </div>
                  {role !== 'admin' && role !== 'Clan' && (
                    <div>
                      <label htmlFor="mini_role">نوع المستخدم</label>
                      <select
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        id="mini_role"
                        value={mini_role}
                        onChange={(e) => setmini_role(e.target.value)}
                      >
                        <option value="1">ا</option>
                        <option value="2">ب</option>
                        <option value="3">ج</option>
                      </select>
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                    >
                      حفظ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AddUser;
