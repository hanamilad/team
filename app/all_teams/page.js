"use client";
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/Firebasepage';
import Breadcrumb from '../Breadcrumb/page';
import './stylee.css';
import Link from 'next/link';


const Team = () => {
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


    return (
        <div>
            <Breadcrumb name="الرهوط" />
            <div>
                <Link type="button" class="button"  href="/all_teams/add_team">
                    <span class="button__text">اضاقة رهط</span>
                    <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
                </Link>
            </div>
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">اسم الرهط </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">التسلسل </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {persons.map((person, index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{person.name}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{index + 1}</td>
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
