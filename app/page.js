// "use client"
// import Section from "./home_section/page";


// export default function Home() {

//   return (
//     <div className="h-screen"> 
//   <Section />
//     </div>

//   );
// }
"use client"
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import Section from "./home_section/page";

export default function Home() {
  const [lastActive, setLastActive] = useState(Date.now());
  const [remainingTime, setRemainingTime] = useState(3 * 60); // 3 دقائق بالثواني

  // دالة لتحديث آخر نشاط
  const updateLastActive = () => {
    setLastActive(Date.now());
  };

  // دالة لتسجيل الخروج بعد مرور 3 دقائق من آخر نشاط
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActive;

      // التحقق إذا مر 3 دقائق
      if (inactiveTime >= 1 * 60 * 1000) {
        const auth = getAuth();
        signOut(auth).then(() => {
          alert("تم تسجيل الخروج بسبب عدم النشاط لفترة طويلة.");
        }).catch((error) => {
          console.error("حدث خطأ أثناء تسجيل الخروج:", error);
        });
      } else {
        // حساب الوقت المتبقي
        const remaining = Math.ceil((2 * 60 * 1000 - inactiveTime) / 1000); // بالثواني
        setRemainingTime(remaining);
      }
    }, 1000); // كل ثانية نتحقق من الوقت المتبقي

    window.addEventListener("mousemove", updateLastActive);
    window.addEventListener("keydown", updateLastActive);

    // تنظيف المستمعين عند إلغاء التأثير
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", updateLastActive);
      window.removeEventListener("keydown", updateLastActive);
    };
  }, [lastActive]);

  return (
    <div className="h-screen">
      <Section />
    </div>
  );
}
