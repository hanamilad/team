"use client";
import React, { useState } from 'react';
import { ref as databaseRef, set, get, update } from 'firebase/database';
import { database, auth } from '../../firebase/Firebasepage';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = databaseRef(database, `users/${user.uid}`);
      await set(userRef, {
        userId: user.uid,
        email:email,
        username: name,
        role: role,
        semi_role:mini_role
      });

      await updateProfile(user, { displayName: name });

      setLoading(false);
      Swal.fire({
        text: 'تم حفظ البيانات بنجاح',
        icon: 'success',
        confirmButtonText: 'حسنًا'
      });

      setName('');
      setEmail('');
      setPassword('');
      setRole('flower');
      setmini_role('1')
    } catch (error) {
      setLoading(false);
      Swal.fire({
        text: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.',
        icon: 'error',
        confirmButtonText: 'حسنًا'
      });
      console.error('Error adding user:', error);
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
                  {role !== 'admin' ? 
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
                      :
                       null
                  }

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
