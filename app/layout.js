"use client";
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from './firebase/Firebasepage'; // تأكد من استيراد ملف Firebase بشكل صحيح
import { onAuthStateChanged } from 'firebase/auth';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
