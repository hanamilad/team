// pages/personel_info/[id].js

"use client";
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { useRouter } from 'next/navigation'; // للحصول على معلمات URL
import { database } from '../../../../firebase/Firebasepage'; // تأكد من المسار الصحيح
import Breadcrumb from '@/app/Breadcrumb/page';
import Image from 'next/image';

const PersonelInfo = ({ params }) => {
  const { id } = params; 
  const router = useRouter();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    if (id) {
      const personRef = ref(database, `person/${id}`);
      onValue(personRef, (snapshot) => {
        const data = snapshot.val();
        setPerson(data);
      });
    }
  }, [id]);

  if (!person) return <div>تحميل...</div>;
  var groubname;
  if(person.groub == 1 ){
    groubname = "زهرات";
  }
  if(person.groub == 2){
    groubname = "مرشدات";
  }
  if(person.groub == 3){
    groubname = "عشيرة";
  }
  var groub_type;
  if(person.groub_type == 1 ){
    groub_type = "ا";
  }
  if(person.groub_type == 2){
    groub_type = "ب";
  }
  if(person.groub_type == 3){
    groub_type = "ج";
  }

  return (
    <div>
      <Breadcrumb name={person.name} />
      <div className='col-span-2 flex justify-around '>
        <div>
          {person.image ? (
            <Image src={person.image} width={150} height={150} alt={`${person.name}'s image`} />
          ) : (
            <div className='w-[150px] h-[150px] bg-gray-500 rounded-full text-center'><i class="fa-solid fa-user text-[100px]"></i></div>
          )}
        </div>
        <div className='m-3 flex flex-col gap-4 items-end'>
          <p><strong>الاسم:</strong> {person.name}</p>
          <p><strong>رقم الهاتف:</strong> {person.phone}</p>
          <p className='text-end'><strong>العنوان:</strong> {person.address}</p>
          <p><strong>السنة الدراسية:</strong> {person.academic_year}</p>
          <p><strong>فريق:</strong> {groubname} {groub_type ? groub_type : (person.team_name ? person.team_name : "")} </p>
          <p><strong>اعتراف الأب:</strong> {person.Father_confession}</p>
          <p><strong>التاريخ:</strong> {person.date}</p>
        </div>

      </div>


    </div>
  );
};

export default PersonelInfo;
