"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Section from "./home_section/page";


export default function Home() {
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(false);
    }, 1000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div className="h-screen"> 
  <Image className={`absolute top-[50%] left-[50%]  ${isSpinning ? "animate-spin" : 'hidden'}`} src='/Logo.png' width={130} height={130} alt="hana" />
  <Section />
    </div>

  );
}
