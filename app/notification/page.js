"use client";
import React, { useContext, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { UserContext } from '../context/page';
import { database } from "../firebase/Firebasepage";
import Link from "next/link";

const Notifications = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { userRole, semi_role } = useContext(UserContext);


    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        const personRef = ref(database, "person");
        onValue(personRef, (snapshot) => {
            const data = snapshot.val();
            const filteredNotifications = [];
            for (const key in data) {
                const person = data[key];
                if (userRole == 'admin') {
                    if (calculateAge(person.date) >= 11 && person.groub == '1' ) {
                        filteredNotifications.push(
                            <Link 
                            key={key} 
                            href={`/all_person/${person.groub}/team/${person.groub_type}/edit/${key}`}
                        >
                            {`${person.name} الرجاء نقل إلى مرشدات`}
                        </Link>                    
                        );
                    }
                    if (calculateAge(person.date) >= 16 && person.groub == '2' ) {
                        filteredNotifications.push(
                        <Link 
                            key={key} 
                            href={`/all_person/${person.groub}/team/${person.groub_type}/edit/${key}`}
                        >
                            {`${person.name} الرجاء نقل  الى عشيره`}
                        </Link>  
                        );
                    }
                }
                if (userRole == 'flower') {
                    if (person.groub == '1' && (person.groub_type == semi_role)) {
                        if (calculateAge(person.date) >= 12) {
                            filteredNotifications.push(                           
                            <Link 
                                key={key} 
                                href={`/all_person/${person.groub}/team/${person.groub_type}/edit/${key}`}
                            >
                                {`${person.name} الرجاء نقل إلى مرشدات`}
                            </Link>  );
                        }
                    }
                }
                if (userRole == 'murshidats') {
                    if (person.groub == '2' && (person.groub_type == semi_role)) {
                        if (calculateAge(person.date) >= 16) {
                            filteredNotifications.push(                        
                            <Link 
                                key={key} 
                                href={`/all_person/${person.groub}/team/${person.groub_type}/edit/${key}`}
                            >
                                {`${person.name} الرجاء نقل  الى عشيره`}
                            </Link> );
                        }
                    }
                }

            }
            setNotifications(filteredNotifications);
        });
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="relative inline-block">
            <div
                className="relative cursor-pointer"
                onClick={toggleNotifications}
            >
                <i className="fa-solid fa-bell text-[20px]"></i>
                {notifications.length > 0 && (
                    <span
                        className="absolute top-[-7px] right-[10px] bg-red-500 text-white text-[12px] rounded-full px-[5px] py-[2px]"
                    >
                        {notifications.length}
                    </span>
                )}
            </div>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-[300px] max-h-[300px] bg-white border shadow-lg z-10 rounded-lg overflow-hidden">
                    <div className="p-3 border-b bg-gray-50 text-gray-700 font-bold">
                        الإشعارات
                    </div>
                    <ul className="list-none m-0 p-0 max-h-[250px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <li
                                    key={index}
                                    className="p-3 hover:bg-gray-100 border-b last:border-none flex items-center"
                                >
                                    <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="ml-3 cursor-pointer">
                                    {notification}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="p-3 text-gray-500 text-center">لا توجد إشعارات جديدة</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notifications;
