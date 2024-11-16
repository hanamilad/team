import React, { createContext, useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../firebase/Firebasepage'; // تأكد من المسار الصحيح
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../loading';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [semi_role, setsemi_role] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const db = getDatabase(); // استخدام Realtime Database
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);

                // مسار المستخدم في Realtime Database
                const userRef = ref(db, `users/${user.uid}`);

                try {
                    const userSnap = await get(userRef);
                    console.log(userSnap, "User Snapshot"); // طباعة البيانات

                    if (userSnap.exists()) {
                        console.log("User data found:", userSnap.val());
                        const userData = userSnap.val();

                        setUserRole(userData.role || null);
                        setsemi_role(userData.semi_role || null);
                    } else {
                        console.log("User data does not exist in Realtime Database.");
                        setUserRole(null);
                        setsemi_role(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserRole(null);
                    setsemi_role(null);
                }
            } else {
                setUserRole(null);
                setsemi_role(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div><Loading /></div>;
    }

    return (
        <UserContext.Provider value={{ userRole, loading, semi_role }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
