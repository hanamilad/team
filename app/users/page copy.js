"use client";
import React, { useState, useEffect } from "react";
import { ref as databaseRef, onValue, remove } from 'firebase/database';
import { database } from "../firebase/Firebasepage";
import Swal from "sweetalert2";
import Breadcrumb from "../Breadcrumb/page";
import Link from "next/link";
import "./stylee.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [mini_role, setmini_role] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const usersRef = databaseRef(database, "users");
        onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            const usersList = usersData
                ? Object.keys(usersData).map((key) => ({
                    id: key,
                    ...usersData[key],
                }))
                : [];
            setUsers(usersList);
        });
    }, []);

    const handleUpdate = async (id) => {
        if (!newName && !newEmail && !newPassword) {
            Swal.fire({
                text: "يرجى إدخال بيانات جديدة للتعديل",
                icon: "error",
                confirmButtonText: "حسنًا",
            });
            return;
        }

        try {
            const response = await fetch("/api/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: id,
                    newName,
                    newEmail,
                    newPassword: newPassword || undefined,
                }),
            });

            const textResponse = await response.text();
            console.log("Response text:", textResponse);
            const result = JSON.parse(textResponse);

            if (response.ok) {
                Swal.fire({
                    text: result.message,
                    icon: "success",
                    confirmButtonText: "حسنًا",
                });

                setEditingUser(null);
                setNewName("");
                setNewEmail("");
                setNewPassword("");
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Swal.fire({
                text: error.message || "حدث خطأ أثناء تعديل البيانات",
                icon: "error",
                confirmButtonText: "حسنًا",
            });
        }

    };


    const handleDelete = async (id) => {
        const is_confirm = confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟");

        if (is_confirm) {
            try {
                const response = await fetch("/api/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: id }),
                });

                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        text: result.message,
                        icon: "success",
                        confirmButtonText: "حسنًا",
                    });
                    // تحديث الواجهة بعد حذف المستخدم
                    setUsers(users.filter(user => user.id !== id));
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire({
                    text: error.message || "حدث خطأ أثناء حذف المستخدم",
                    icon: "error",
                    confirmButtonText: "حسنًا",
                });
            }
        }
    };

    return (
        <div>
            <Breadcrumb name="المستخدمين" />
            <div>
                <Link type="button" className="button" href="/users/add_user">
                    <span className="button__text">اضافة مستخدم</span>
                    <span className="button__icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            stroke="currentColor"
                            height="24"
                            fill="none"
                            className="svg"
                        >
                            <line y2="19" y1="5" x2="12" x1="12"></line>
                            <line y2="12" y1="12" x2="19" x1="5"></line>
                        </svg>
                    </span>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    اسم المستخدم
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    البريد الإلكتروني
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    كلمة المرور
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    الدور
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {editingUser === user.id ? (
                                            <input
                                                type="text"
                                                className="p-3 border"
                                                value={newName}
                                                placeholder={user.username}
                                                onChange={(e) =>
                                                    setNewName(e.target.value)
                                                }
                                            />
                                        ) : (
                                            user.username
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        {editingUser === user.id ? (
                                            <input
                                                type="email"
                                                className="p-3 border"
                                                value={newEmail}
                                                placeholder={user.email}
                                                onChange={(e) =>
                                                    setNewEmail(e.target.value)
                                                }
                                            />
                                        ) : (
                                            user.email || "غير متوفر"
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        {editingUser === user.id ? (
                                            <input
                                                type="password"
                                                className="p-3 border"
                                                value={newPassword}
                                                placeholder="كلمة مرور جديدة"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        ) : (
                                            "******"
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {editingUser === user.id ? (
                                            <>
                                               <div className="w-full rounded-lg border-gray-200 p-3 text-sm border">
                                                <select
                                                 value={user.role} onChange={(e) => setRole(e.target.value)}>
                                                    <option value="flower">زهرات</option>
                                                    <option value="murshidats">مرشدات</option>
                                                    <option value="Clan">عشيرة</option>
                                                    <option value="admin">ادمن</option>
                                                </select>
                                                {role !== 'admin' && (
                                                    <select
                                                        id="mini_role"
                                                        value={user.semi_role}
                                                        onChange={(e) => setmini_role(e.target.value)}
                                                    >
                                                        <option value="1">ا</option>
                                                        <option value="2">ب</option>
                                                        <option value="3">ج</option>
                                                    </select>
                                                    
                                                )}
                                                </div>
                                            </>
                                        ) : (
                                            user.role
                                        )}

                                    </td>
                                    <td>
                                        <div className="flex justify-center">
                                            {editingUser === user.id ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdate(user.id)
                                                        }
                                                        className="Btn"
                                                    >
                                                        حفظ
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setEditingUser(null)
                                                        }
                                                        className="BtnR ml-2"
                                                    >
                                                        إلغاء
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        setEditingUser(user.id)
                                                    }
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
