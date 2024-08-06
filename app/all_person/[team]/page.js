"use client";
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/Firebasepage';
import Breadcrumb from '../../Breadcrumb/page';
import { useRouter } from 'next/navigation';


const Person = ({ params }) => {
    const { team } = params; 
    const [persons, setPersons] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const personRef = ref(database, 'person');
    onValue(personRef, (snapshot) => {
      const data = snapshot.val();
      const personsList = [];
      for (let id in data) {
        personsList.push({id, ...data[id]});
      }
      setPersons(personsList);
    });
  }, [team]);
  const filteredPersons = persons.filter((per) => per.groub == team);
  var name;
  team == 1 ? name="زهرات" :(team == 2 ? name="مرشدات" : name="عشيرة" );


  const handleViewClick = (id) => {
    router.push(`/all_person/${team}/Info/${id}`);
  };
  return (
    <div>
    <Breadcrumb name={name} />
      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto rounded-t-lg">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">الاسم </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">رقم الهاتف </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">الملف الشخصى</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPersons.map((person, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{person.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{person.phone}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 'text-white bg-[#1b87ba] cursor-pointer" onClick={() => handleViewClick(person.id)}><button >عرض</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Person;
