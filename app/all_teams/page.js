"use client";
import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../firebase/Firebasepage';
import Breadcrumb from '../Breadcrumb/page';
import './stylee.css';
import Link from 'next/link';
import Swal from 'sweetalert2';


const Team = () => {
    const [persons, setPersons] = useState([]);
    const [editingPerson, setEditingPerson] = useState(null);

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

    const handleDelete = (id) => {
       var is_confirm =  confirm("هل انتا متاكد من عملية الحذف؟");
       if(is_confirm){
        const personRef = ref(database, `team/${id}`);
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
        }
        
    };

    const handleEdit = (id, newName) => {
        const personRef = ref(database, `team/${id}`);
        update(personRef, { name: newName })
            .then(() => {
                setPersons(persons.map(person => person.id === id ? { ...person, name: newName } : person));
                setEditingPerson(null);
                Swal.fire({
                    text: 'تم تعديل البيانات بنجاح',
                    icon: 'success',
                    confirmButtonText: 'حسنًا'
                  });
            })
            .catch(error => {
                console.error("Error updating person:", error);
            });
    };

    return (
        <div>
            <Breadcrumb name="الرهوط" />
            <div>
                <Link type="button" className="button" href="/all_teams/add_team">
                    <span className="button__text">اضافة رهط</span>
                    <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
                </Link>
            </div>
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">اسم الرهط </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">الكود </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"> </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {persons.map((person, index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {editingPerson?.id === person.id ? (
                                            <input
                                                type="text"
                                                className='p-3 border' 
                                                value={editingPerson.name}
                                                onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                                            />
                                        ) : (
                                            person.name
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{index + 1}</td>
                                    <td>
                                    <div className='flex justify-center'>

                                        {editingPerson?.id === person.id ? (
                                            <button
                                                className="Btn"
                                                onClick={() => handleEdit(person.id, editingPerson.name)}
                                            >
                                                حفظ
                                            </button>
                                        ) : (
                                            <button
                                                className="Btn"
                                                onClick={() => setEditingPerson(person)}
                                            >
                                                تعديل
                                            </button>
                                        )}
                                        <button className="BtnR" onClick={() => handleDelete(person.id)}>حذف</button>
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

export default Team;
