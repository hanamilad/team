"use client"
import React, { useState } from 'react';
import { ref as databaseRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebase/Firebasepage'; // تأكد من استيراد storage بشكل صحيح
import Breadcrumb from '../Breadcrumb/page';

const AddPerson = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [fatherConfession, setFatherConfession] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [groub, setIgroub] = useState('');
  const [groub_type, setgroub_type] = useState('');
  const [team_name, setteam_name] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) {
        setImageError('حجم الصورة يجب أن لا يتجاو  50 كيلو بايت');
        setImageFile(null);
      } else {
        setImageError('');
        setImageFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';

      if (imageFile) {
        const imageRef = storageRef(storage, `person/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const personRef = databaseRef(database, 'person');
      const newPersonRef = push(personRef);
      await set(newPersonRef, {
        name,
        phone,
        date,
        address,
        academic_year: academicYear,
        Father_confession: fatherConfession,
        image: imageUrl,
        groub: groub,
        groub_type: groub_type,
        team_name: team_name

      });

      alert('تم حفظ البيانات بنجاح');
      setName('');
      setPhone('');
      setDate('');
      setAddress('');
      setAcademicYear('');
      setFatherConfession('');
      setImageFile(null);
      setIgroub('');
      setgroub_type('');
      setteam_name('');
    } catch (error) {
      console.error('Error saving data: ', error);
    }
  };

  return (
    <div>
      <section className="bg-gray-100">
        <Breadcrumb name="اضافة" />
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="الاسم رباعى"
                    type="text"
                    id="name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      placeholder="العنوان"
                      type="text"
                      id="address"
                      value={address}
                      required
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      placeholder="تاريخ الميلاد"
                      type="date"
                      id="date"
                      value={date}
                      required
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <select
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      id="groub"
                      value={groub}
                      required
                      onChange={(e) => setIgroub(e.target.value)}
                    >
                      <option value="0">الفريق</option>
                      <option value="1">زهرات</option>
                      <option value="2">مرشدات</option>
                      <option value="3">عشيرة</option>
                    </select>
                  </div>
                  {groub == 1 || groub == 2 ?
                    <div>
                      <select
                        className="w-full rounded-lg border-gray-200 p-3 text-sm"
                        id="groub_type"
                        value={groub_type}
                        required
                        onChange={(e) => setgroub_type(e.target.value)}
                      >
                        <option value="1">ا</option>
                        <option value="2">ب</option>
                        <option value="3">ج</option>
                      </select>
                    </div> : (groub == 3 ? 
                      <div>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      placeholder="اسم الرهط"
                      type="text"
                      id="team_name"
                      value={team_name}
                      required
                      onChange={(e) => setteam_name(e.target.value)}
                    />
                  </div>
                    :
                     <></>)}
                  <div>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      placeholder="اب الاعتراف"
                      type="text"
                      id="father"
                      value={fatherConfession}
                      required
                      onChange={(e) => setFatherConfession(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      placeholder="رقم التليفون"
                      type="tel"
                      id="phone"
                      value={phone}
                      required
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      placeholder="السنة الدراسية"
                      type="text"
                      id="academic_year"
                      value={academicYear}
                      required
                      onChange={(e) => setAcademicYear(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    />
                    {imageError && <p className="text-red-500">{imageError}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddPerson;
