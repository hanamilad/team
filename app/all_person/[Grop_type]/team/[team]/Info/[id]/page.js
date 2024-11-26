// pages/personel_info/[id].js

"use client";
import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { database } from '../../../../../../firebase/Firebasepage'; // تأكد من المسار الصحيح
import Breadcrumb from '@/app/Breadcrumb/page';
import Loading from '../../../../../../loading';

const PersonelInfo = ({ params }) => {
  const { id } = params;
  const [person, setPerson] = useState(null);
  const [teams_name, setteams_name] = useState([]);
  const [scoutingMovements, setScoutingMovements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    badgeName: "",
    leaderName: "",
    teamName: "",
    created_at: "",
  });
  const [editId, setEditId] = useState(null);


  useEffect(() => {
    if (id) {
      const personRef = ref(database, `person/${id}`);
      const teamsRef = ref(database, "team");
      const scoutingMovementsRef = ref(database, `Scouting_movements/${id}`);
      
      onValue(personRef, (snapshot) => {
        setPerson(snapshot.val());
      });
      onValue(teamsRef, (snapshot) => {
        setteams_name(snapshot.val() || []);
      });
      onValue(scoutingMovementsRef, (snapshot) => {
        const data = snapshot.val();
        const movements = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
        setScoutingMovements(movements);
      });
    }
  }, [id]);

  if (!person) return <div><Loading /></div>;
  var groubname;
  if (person.groub == 1) {
    groubname = "زهرات";
  }
  if (person.groub == 2) {
    groubname = "مرشدات";
  }
  if (person.groub == 3) {
    groubname = " ";
  }
  var groub_type;
  if (person.groub_type == 1) {
    groub_type = "ا";
  }
  if (person.groub_type == 2) {
    groub_type = "ب";
  }
  if (person.groub_type == 3) {
    groub_type = "ج";
  }
  var team_name;
  if (teams_name && teams_name.length > 0) {
    team_name = teams_name.filter((ele) => ele.id == person.team_name);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const scoutingMovementsRef = ref(database, `Scouting_movements/${id}`);
    const data = {
      ...formData,
      created_at: formData.created_at || new Date().toISOString().split('T')[0],
      };
    if (editId) {
      const entryRef = ref(database, `Scouting_movements/${id}/${editId}`);
      update(entryRef, data);
      setEditId(null);
    } else {
      // Add new entry
      push(scoutingMovementsRef, data);
    }
    setFormData({ badgeName: "", leaderName: "", teamName: "", created_at:"" });
    setIsModalOpen(false);
  };

  const handleEdit = (entryId) => {
    const entry = scoutingMovements.find((item) => item.id === entryId);
    if (entry) {
      setFormData({ badgeName: entry.badgeName, leaderName: entry.leaderName, teamName: entry.teamName,created_at: entry.created_at });
      setEditId(entryId);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (entryId) => {
    const isConfirmed = confirm("هل انت متأكد أنك تريد الحذف؟"); 
    if (isConfirmed) {
    const entryRef = ref(database, `Scouting_movements/${id}/${entryId}`);
    remove(entryRef);
    }
  };




  return (
    <div>
      <Breadcrumb name={person.name} />
      <div className='col-span-2 flex justify-end '>
        <div className='m-3 flex flex-col gap-4 items-end'>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:الاسم</strong> {person.name}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:رقم الهاتف</strong> {person.phone}</p>
          <p className='text-end'><strong style={{ float: 'right', marginRight: '10px' }}>:العنوان</strong> {person.address}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:السنة الدراسية / (اسم المدرسة او الكلية )</strong> {person.academic_year}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:{person.groub == 3 ? "رهط" : "فريق"}</strong> {groubname} {groub_type ? groub_type : (team_name[0].name ? team_name[0].name : "")}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:{person.groub == 2 ? "اسم الطليعه" : (person.groub == 1 ? "اسم السدادسى" : "")}</strong>{person.groub !== 3 ? person.Vanguard_Name : ""}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:تاريخ الانضمام</strong> {person.date_in}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:قائد الفرقة وقت الانضام</strong> {person.leader_name}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:اب الاعتراف</strong> {person.Father_confession}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:التاريخ</strong> {person.date}</p>
          <p><strong style={{ float: 'right', marginRight: '10px' }}>:نوع السكن </strong> {person.type_house == 1 ? "ايجار" : " ملك "}</p>
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
      <div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
        >
          اضافة
        </button>
        <table class="min-w-full border-collapse border border-gray-200 text-center">
          <thead>
            <tr class="bg-gray-100">
              <th></th>
              <th class="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700">التاريخ</th>
              <th class="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700">الفريق</th>
              <th class="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700">اسم القائد</th>
              <th class="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700">البيانات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {scoutingMovements.length > 0 ?
              scoutingMovements.map((item) => (
              <tr key={item.id}>
              <td className="px-4 py-2 border border-gray-300">
                  <button className="text-blue-500 mx-2" onClick={() => handleEdit(item.id)}>تعديل</button>
                  <button className="text-red-500 mx-2" onClick={() => handleDelete(item.id)}>حذف</button>
                </td>
                <td className="px-4 py-2 border border-gray-300">{item.created_at}</td>
                <td className="px-4 py-2 border border-gray-300">{item.teamName}</td>
                <td className="px-4 py-2 border border-gray-300">{item.leaderName}</td>
                <td className="px-4 py-2 border border-gray-300">{item.badgeName}</td>

              </tr>
            )) : 
            <tr><td colSpan='5'>لا توجد بيانات </td></tr>
            }
          </tbody>
        </table>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">إضافة/تعديل حركة كشفية</h2>
            <input
              type="text"
              name="badgeName"
              placeholder="اسم الشارة"
              value={formData.badgeName}
              onChange={handleInputChange}
              className="block w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="leaderName"
              placeholder="اسم القائد"
              value={formData.leaderName}
              onChange={handleInputChange}
              className="block w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="teamName"
              placeholder="اسم الفريق"
              value={formData.teamName}
              onChange={handleInputChange}
              className="block w-full p-2 border mb-4"
            />
            <input
              type="date"
              name="created_at"
              value={formData.created_at}
              onChange={handleInputChange}
              className="block w-full p-2 border mb-4"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleSave}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default PersonelInfo;
