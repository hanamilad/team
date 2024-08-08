"use client";
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../Breadcrumb/page';
import { useRouter } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/Firebasepage';


const Grop_type = ({params}) => {
  const router = useRouter();
  const { Grop_type } = params; 
  const [persons, setPersons] = useState([]);
  useEffect(() => {
      const teamRef = ref(database, 'team');
      onValue(teamRef, (snapshot) => {
          const data = snapshot.val();
          const teamList = [];
          for (let id in data) {
              teamList.push({ id, ...data[id] });
          }
          setPersons(teamList);
      });
  }, []);
  



  const handleView = (team) => {
    router.push(`/all_person/${Grop_type}/team/${team}`);
  };

  return (
    <div>
    <Breadcrumb name={Grop_type == 1 ? "زهرات" : (Grop_type == 2 ? "مرشدات" : "عشيرة") } />
    <section>
  <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
    {(Grop_type == 1 || Grop_type == 2) && (
  <>
    <div
      onClick={() => handleView(1)}
      className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
    >
      <span className="inline-block rounded-lg bg-gray-50 p-3">
        <i className="fa-solid fa-users"></i>
      </span>

      <h2 className="mt-2 font-bold">
        {Grop_type == 1 ? "زهرات ا" : "مرشدات ا"}
      </h2>
    </div>
    
    <div
      onClick={() => handleView(2)}
      className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
    >
      <span className="inline-block rounded-lg bg-gray-50 p-3">
        <i className="fa-solid fa-users"></i>
      </span>

      <h2 className="mt-2 font-bold">
        {Grop_type == 1 ? "زهرات ب" : "مرشدات ب"}
      </h2>
    </div>
    
    <div
      onClick={() => handleView(3)}
      className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
    >
      <span className="inline-block rounded-lg bg-gray-50 p-3">
        <i className="fa-solid fa-users"></i>
      </span>

      <h2 className="mt-2 font-bold">
        {Grop_type == 1 ? "زهرات ج" : "مرشدات ج"}
      </h2>
    </div>
  </>
)}
{Grop_type == 3 &&

  persons.map((ele) => {
    return (
      <div
        key={ele.id}
        onClick={() => handleView(ele.id)}
        className="block text-center rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
      >
        <span className="inline-block rounded-lg bg-gray-50 p-3">
          <i className="fa-solid fa-users"></i>
        </span>

        <h2 className="mt-2 font-bold">
          {ele.name}
        </h2>
      </div>
    );
  })}


      </div>
    </div>
    </section>
    </div>
  );
};

export default Grop_type;
