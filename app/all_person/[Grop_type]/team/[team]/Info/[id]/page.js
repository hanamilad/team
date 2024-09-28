// pages/personel_info/[id].js

"use client";
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../../firebase/Firebasepage'; // تأكد من المسار الصحيح
import Breadcrumb from '@/app/Breadcrumb/page';
import Image from 'next/image';
import Loading from '../../../../../../loading';

const PersonelInfo = ({ params }) => {
  const { id } = params; 
  const [person, setPerson] = useState(null);
  const [teams_name,setteams_name]=useState([])

  useEffect(() => {
    if (id) {
      const personRef = ref(database, `person/${id}`);
      const teamsRef = ref(database,"team")
      onValue(personRef, (snapshot) => {
        const data = snapshot.val();
        setPerson(data);
      });
      onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();
        setteams_name(data)});
    }
  }, [id]);

  if (!person) return <div><Loading /></div>;
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
  var team_name ;
if (teams_name && teams_name.length > 0) {
  team_name = teams_name.filter((ele) => ele.id == person.team_name);
}
console.log(team_name,"team_name")


  return (
    <div>
      <Breadcrumb name={person.name} />
      <div className='col-span-2 flex justify-around '>
        <div>
          {person.image ? (
            <Image src={person.image} width={150}  height={150} alt={`${person.name}'s image`} />
          ) : (
            <div className='w-[150px] h-[150px] bg-gray-500 rounded-full text-center'><i className="fa-solid fa-user text-[100px]"></i></div>
          )}
        </div>
        <div className='m-3 flex flex-col gap-4 items-end'>
        <p><strong style={{ float: 'right', marginRight: '10px' }}>:الاسم</strong> {person.name}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:رقم الهاتف</strong> {person.phone}</p>
<p className='text-end'><strong style={{ float: 'right', marginRight: '10px' }}>:العنوان</strong> {person.address}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:السنة الدراسية</strong> {person.academic_year}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:فريق</strong> {groubname} {groub_type ? groub_type : (team_name[0].name ? team_name[0].name : "")}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:اب الاعتراف</strong> {person.Father_confession}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:التاريخ</strong> {person.date}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:نوع السكن </strong> {person.type_house == 1  ? "ايجار" : " ملك "}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:الكنيسة التابعة لها </strong> {person.Church}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:(الاب)تلفون ولى الامر</strong> {person.father_number}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:(الام)تلفون ولى الامر</strong> {person.mather_number}</p>
<p><strong style={{ float: 'right', marginRight: '10px' }}>:عدد الاخوات</strong> {person.brothers_num}</p>
{
  person.medication_name !== "" ? 
  <p><strong style={{ float: 'right', marginRight: '10px' }}>:اسم الدواء</strong> {person.medication_name}</p>
  :
""
}
<p><strong style={{ float: 'right', marginRight: '10px' }}>:الهوايات</strong> {person.hope}</p>


        </div>

      </div>


    </div>
  );
};

export default PersonelInfo;
