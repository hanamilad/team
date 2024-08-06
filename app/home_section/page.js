import Link from 'next/link'
import React from 'react'
import { getAuth, signOut } from 'firebase/auth';


 const Section = () => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج: ', error);
    }
  };
  return (
    <div>

<section>
  <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
      <div className="mx-auto max-w-lg text-center lg:mx-0 ltr:lg:text-left rtl:lg:text-right">
        <h2 className="text-3xl font-bold sm:text-4xl">كشافة القديس بولس الرسول كنيسة العذراء مريم وابى سيفين</h2>

        <p className="mt-4 text-gray-600">
يهدف هذا البرنامج الى التسهيل على القائد فى تجميع بيانات الافراد فى الفريق 
ويتميز فى سهولة الاستخدام 
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Link
          className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="/add_person"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-user-plus"></i>
          </span>

          <h2 className="mt-2 font-bold">اضافة</h2>
        </Link>
        <Link
          className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="/all_person"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-users"></i>
            </span>
          <h2 className="mt-2 font-bold">الاسماء</h2>
        </Link>
        {/* <a
          className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href=""
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-user-plus"></i>
          </span>

          <h2 className="mt-2 font-bold">القادة</h2>
        </a>
        <a
          className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href=""
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-file"></i>
          </span>

          <h2 className="mt-2 font-bold">الملف</h2>
        </a>
        <a
          className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href=""
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-user-plus"></i>
          </span>

          <h2 className="mt-2 font-bold">اضافة</h2>
        </a> */}
        <a
          className="block bg-red-950 text-white text-center rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href=""
          onClick={(e) => {
        e.preventDefault(); 
        handleSignOut();
      }}
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-right-from-bracket text-black"></i>
          </span>

          <h2 className="mt-2 font-bold">تسجيل الخروج</h2>
        </a>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}
export default Section