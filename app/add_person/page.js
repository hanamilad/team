"use client"
import React, { useEffect, useState } from 'react';
import { ref as databaseRef, push, set, onValue, ref } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebase/Firebasepage'; // تأكد من استيراد storage بشكل صحيح
import Breadcrumb from '../Breadcrumb/page';
import Loading from '../loading';
import Swal from 'sweetalert2';


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
  const [loading, setLoading] = useState(false);
  const [Teams, setTeams] = useState([]);

  useEffect(() => {
    const teamRef = ref(database, 'team');
    onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      const teamList = [];
      for (let id in data) {
        teamList.push({ id, ...data[id] });
      }
      setTeams(teamList);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setImageError('حجم الصورة يجب أن لا يتجاو  1 ميجا بايت');
        setImageFile(null);
      } else {
        setImageError('');
        setImageFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
      Swal.fire({
        text: 'تم حفظ البيانات بنجاح',
        icon: 'success',
        confirmButtonText: 'حسنًا'
      });

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
      setLoading(false);
      Swal.fire({
        text: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.',
        icon: 'error',
        confirmButtonText: 'حسنًا'
      });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <section className="bg-gray-100">
          <Breadcrumb name="اضافة" />
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
              <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor='name'>الاسم رباعى</label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm border "
                      type="text"
                      id="name"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor='address'>العنوان</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="address"
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='date'>تاريخ الميلاد</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="date"
                        id="date"
                        value={date}
                        required
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='groub'>اختر الفريق</label>
                      <select
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
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
                        <label htmlFor='groub_type'>رقم الفريق</label>
                        <select
                          className="w-full rounded-lg border-gray-200 p-3 text-sm border"
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
                          <label htmlFor='team_name'>اسم الرهط</label>

                          <select
                            className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                            id="team_name"
                            value={team_name}
                            required
                            onChange={(e) => setteam_name(e.target.value)}
                          >
                            <option value="0">اختر الرهط</option>
                            {Teams.map((ele) => {
                              return (
                                <option key={ele.id} value={ele.id}>
                                  {ele.name}
                                </option>
                              );

                            })
                            }
                          </select>
                        </div>
                        :
                        <></>)}
                    <div>
                      <label htmlFor='father'>اب الاعتراف</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="father"
                        value={fatherConfession}
                        required
                        onChange={(e) => setFatherConfession(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='phone'>رقم التليفون</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="tel"
                        id="phone"
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='academic_year'>السنة الدراسية</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="academic_year"
                        value={academicYear}
                        required
                        onChange={(e) => setAcademicYear(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <label
                        htmlFor="picture"
                        className="flex flex-col items-center justify-center w-full max-w-sm p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7h18M4 7l1 10h14l1-10H4z"
                          />
                        </svg>
                        <span className="text-gray-600 text-sm font-medium">اختر صورة</span>
                        <input
                          type="file"
                          accept="image/*"
                          id="picture"
                          required
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
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
    </>
  );
};

export default AddPerson;
