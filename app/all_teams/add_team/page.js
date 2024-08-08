"use client";
import React, { useState } from 'react';
import { ref as databaseRef, set, get } from 'firebase/database';
import { database } from '../../firebase/Firebasepage';
import Breadcrumb from '../../Breadcrumb/page';
import Loading from '../../loading';
import Swal from 'sweetalert2';

const AddPerson = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const teamRef = databaseRef(database, 'team');

      // الحصول على البيانات الحالية في "person"
      const snapshot = await get(teamRef);

      let newId = 1; // القيمة الافتراضية في حالة عدم وجود بيانات سابقة

      if (snapshot.exists()) {
        const teams = snapshot.val();
        const ids = Object.keys(teams).map(id => parseInt(id, 10));
        if (ids.length > 0) {
          newId = Math.max(...ids) + 1; // زيادة أكبر قيمة موجودة حالياً
        }
      }

      // إضافة العنصر الجديد مع "id" و "name"
      await set(databaseRef(database, `team/${newId}`), {
        id: newId,
        name,
      });

      setLoading(false);
      Swal.fire({
        text: 'تم حفظ البيانات بنجاح',
        icon: 'success',
        confirmButtonText: 'حسنًا'
      });

      setName('');
    } catch (error) {
      setLoading(false);
      Swal.fire({
        text: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.',
        icon: 'error',
        confirmButtonText: 'حسنًا'
      });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <section className="bg-gray-100">
          <Breadcrumb name="اضافة رهط" />
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
              <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor='name'>اسم الرهط</label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                      type="text"
                      id="name"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
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

export default AddPerson;
