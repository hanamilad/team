// pages/userRole.js
'use client';

import React, { createContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase/Firebasepage'; // تأكد من المسار الصحيح
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../loading';

 export const UserContext = createContext();


 const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [semi_role, setsemi_role] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                const userDoc = doc(firestore, 'users', user.uid);
                const userSnap = await getDoc(userDoc);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData && userData.role) {
                        const role = userData.role; // قراءة الحقل role
                        const semi = userData.semi_role; // قراءة الحقل role
                        setUserRole(role);
                        setsemi_role(semi);
                    } else {
                        setUserRole(null);
                        setsemi_role(null);
                    }
                } else {
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div><Loading /></div>;
    }

    return (
        <UserContext.Provider value={{ userRole, loading,semi_role}}>
            {children}
        </UserContext.Provider>
    );
}


export default UserProvider;
