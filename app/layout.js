"use client";
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { auth } from './firebase/Firebasepage'; // تأكد من استيراد ملف Firebase بشكل صحيح
import { onAuthStateChanged } from 'firebase/auth';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";
import Loading from "./loading";
import UserProvider from './context/page'; // تأكد من المسار الصحيح

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth is not initialized');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/loginPage');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </UserProvider>
      </body>
    </html>
  );
}
