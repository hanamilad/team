"use client";
import React, { useState, useEffect } from 'react';
import { ref, onValue,remove, update } from 'firebase/database';
import { database } from '../../../../firebase/Firebasepage';
import Breadcrumb from '../../../../Breadcrumb/page';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import './style.css';


const Person = ({ params }) => {
  const { team } = params;
  const { Grop_type } = params;
  const [persons, setPersons] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const personRef = ref(database, 'person');
    onValue(personRef, (snapshot) => {
      const data = snapshot.val();
      const personsList = [];
      for (let id in data) {
        personsList.push({ id, ...data[id] });
      }
      setPersons(personsList);
    });
  }, [team]);
  const filteredPersons = persons.filter((per) => per.groub == Grop_type && (per.groub_type == team || per.team_name == team));
  var name;
  var type;
  team == 1 ? type = "ا" : (team == 2 ? type = "ب" : (team == 3 ? type = "ج" : type = ""));
  Grop_type == 1 ? name = `زهرات ${type}` : (Grop_type == 2 ? name = `مرشدات ${type}` : name = "عشيرة");

console.log(filteredPersons)
console.log(Grop_type,"Grop_type")
console.log(team,"team")
  const handleViewClick = (id) => {
    router.push(`/all_person/${Grop_type}/team/${team}/Info/${id}`);
  };
  const handleDelete = (id) => {
    const personRef = ref(database, `person/${id}`);
    remove(personRef)
        .then(() => {
            setPersons(persons.filter(person => person.id !== id));
            Swal.fire({
                text: 'تم حذف البيانات بنجاح',
                icon: 'success',
                confirmButtonText: 'حسنًا'
              });
        })
        .catch(error => {
            console.error("Error deleting person:", error);
        });
};
const handleEditPerson = (person) => {
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
                  <td>
                    <div className='flex justify-center'>
                      <button
                        className="Btn"
                        onClick={() => handleViewClick(person.id)}
                      >
                        عرض
                      </button>
                      <button
                        className="Btn1"
                      >
                        تعديل
                      </button>
                      <button
                        className="Btn2"
                        onClick={() => handleDelete(person.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
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
