"use client";
import React, { useState, useEffect } from 'react';
import { ref as databaseRef, onValue, update,remove } from 'firebase/database';
import { database, auth } from '../firebase/Firebasepage';
import { updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';
import Breadcrumb from '../Breadcrumb/page';
import Link from 'next/link';
import './stylee.css';


const Users = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const usersRef = databaseRef(database, 'users');
        onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            const usersList = usersData ? Object.keys(usersData).map(key => ({
                id: key,
                ...usersData[key]
            })) : [];
            setUsers(usersList);
        });
    }, []);

    const handleEdit = async (id, currentName) => {
        if (!newName) {
            Swal.fire({
                text: 'يرجى إدخال اسم جديد',
                icon: 'error',
                confirmButtonText: 'حسنًا'
            });
            return;
        }

        const userRef = databaseRef(database, `users/${id}`);
        try {
            // تحديث الاسم في قاعدة البيانات
            await update(userRef, { username: newName });

            // تحديث الاسم في Firebase Authentication
            const user = auth.currentUser;
            if (user && user.uid === id) {
                await updateProfile(user, { displayName: newName });
            }

            setUsers(users.map(user => user.id === id ? { ...user, username: newName } : user));
            setEditingUser(null);
            setNewName('');

            Swal.fire({
                text: 'تم تعديل الاسم بنجاح',
                icon: 'success',
                confirmButtonText: 'حسنًا'
            });
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                text: 'حدث خطأ أثناء تعديل الاسم',
                icon: 'error',
                confirmButtonText: 'حسنًا'
            });
        }
    };

    const handleDelete = async (id) => {
        const userRef = databaseRef(database, `users/${id}`);
        try {
            await remove(userRef);
            setUsers(users.filter(user => user.id !== id));    
            Swal.fire({
                text: 'تم حذف المستخدم بنجاح',
                icon: 'success',
                confirmButtonText: 'حسنًا'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                text: 'حدث خطأ أثناء حذف المستخدم',
                icon: 'error',
                confirmButtonText: 'حسنًا'
            });
        }
    };
    

    return (
        <div>
            <Breadcrumb name="المستخدمين" />
            <div>
                <Link type="button" className="button" href="/users/add_user">
                    <span className="button__text">اضافة مستخدم</span>
                    <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">اسم المستخدم</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">البريد الإلكتروني</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">الدور</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {editingUser === user.id ? (
                                            <input
                                                type="text"
                                                className="p-3 border"
                                                value={newName}
                                                placeholder={user.username}
                                                onChange={(e) => setNewName(e.target.value)}
                                            />
                                        ) : (
                                            user.username
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{user.email || 'غير متوفر'}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.role}</td>
                                    <td>
                                        <div className="flex justify-center">
                                            {editingUser === user.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(user.id, user.username)}
                                                        className="Btn"
                                                    >
                                                        حفظ
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingUser(null)}
                                                        className="BtnR ml-2"
                                                    >
                                                        إلغاء
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingUser(user.id)}
                                                    className="Btn"
                                                >
                                                    تعديل
                                                </button>
                                            )}
                                            <button className="BtnR ml-2" onClick={() => handleDelete(user.id)}>حذف</button>
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

export default Users;
