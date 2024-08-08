"use client";
import React from 'react';
import Breadcrumb from '../Breadcrumb/page';
import { useRouter } from 'next/navigation';


const AllPerson = () => {
  const router = useRouter();



  const handleView = (Grop_type) => {
    router.push(`/all_person/${Grop_type}`);
  };

  return (
    <div>
    <Breadcrumb name="الفرق" />
    <section>
  <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
        <div
        onClick={()=>handleView(1)}
          className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-users"></i>     
          </span>

          <h2 className="mt-2 font-bold">زهرات</h2>
        </div>
        <div
          onClick={()=>handleView(2)}
          className="block text-center rounded-xl border border-gray-100 cursor-pointer p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-users"></i>
          </span>

          <h2 className="mt-2 font-bold">مرشدات</h2>
        </div>
        <div
           onClick={()=>handleView(3)}
          className="block text-center rounded-xl border border-gray-100 cursor-pointer p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i class="fa-solid fa-users"></i>       
             </span>

          <h2 className="mt-2 font-bold">عشيرة</h2>
        </div>
      </div>
    </div>
    </section>
    </div>
  );
};

export default AllPerson;
