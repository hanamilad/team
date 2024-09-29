"use client"
import React, { useContext, useEffect, useState } from 'react';
import { ref as databaseRef, set, onValue, get } from 'firebase/database';
import { database } from '../../../../../../firebase/Firebasepage';
import Breadcrumb from '../../../../../../Breadcrumb/page';
import Loading from '../../../../../../loading';
import Swal from 'sweetalert2';
import { UserContext } from '../../../../../../context/page';
import { useRouter } from 'next/navigation';

const Edit = ({ params }) => {
  const { editid } = params;
  const { team } = params;
  const { Grop_type } = params;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [type_house, settype_house] = useState('');
  const [Church, setChurch] = useState('');
  const [father_number, setfather_number] = useState('');
  const [mather_number, setmather_number] = useState('');
  const [brothers_num, setbrothers_num] = useState('');
  const [medication_name, setmedication_name] = useState('');
  const [hope, sethope] = useState('');
  const [medication, setMedication] = useState('');
  const [address, setAddress] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [fatherConfession, setFatherConfession] = useState('');
  const [groub, setIgroub] = useState('');
  const [groub_type, setgroub_type] = useState('');
  const [team_name, setteam_name] = useState('');
  const [loading, setLoading] = useState(false);
  const [Teams, setTeams] = useState([]);
  const { userRole, semi_role } = useContext(UserContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const teamRef = databaseRef(database, 'team');
    onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      const teamList = [];
      for (let id in data) {
        teamList.push({ id, ...data[id] });
      }
      setTeams(teamList);
    });

    if (editid) {
      const personRef = databaseRef(database, `person/${editid}`);
      get(personRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || '');
          setPhone(data.phone || '');
          setDate(data.date || '');
          setAddress(data.address || '');
          setAcademicYear(data.academic_year || '');
          setFatherConfession(data.Father_confession || '');
          setIgroub(data.groub || '');
          setgroub_type(data.groub_type || '');
          setteam_name(data.team_name || '');
          settype_house(data.type_house || '');
          setChurch(data.Church || '');
          setfather_number(data.father_number || '');
          setmather_number(data.mather_number || '');
          setbrothers_num(data.brothers_num || '');
          setmedication_name(data.medication_name || '');
          sethope(data.hope || '');
          setMedication(data.medication || '');
        }
      }).catch((error) => {
        console.error("Error fetching person data:", error);
      });
    }

    switch (userRole) {
      case 'admin':
        setIgroub("");
        setIsDisabled(false);
        break;
      case 'flower':
        setIgroub("1");
        setIsDisabled(true);
        break;
      case 'murshidats':
        setIgroub("2");
        setIsDisabled(true);
        break;
      case 'Clan':
        setIgroub("3");
        setIsDisabled(true);
        break;
      default:
        setIgroub("");
        setIsDisabled(false);
        break;
    }

    switch (semi_role) {
      case 'admin':
        setgroub_type("");
        setIsDisabled(false);
        break;
      case '1':
        setgroub_type("1");
        setIsDisabled(true);
        break;
      case '2':
        setgroub_type("2");
        setIsDisabled(true);
        break;
      case '3':
        setgroub_type("3");
        setIsDisabled(true);
        break;
      default:
        setgroub_type("");
        setIsDisabled(false);
        break;
    }
  }, [userRole, semi_role, editid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const personRef = databaseRef(database, `person/${editid}`);
      await set(personRef, {
        name,
        phone,
        date,
        address,
        academic_year: academicYear,
        Father_confession: fatherConfession,
        groub,
        groub_type,
        team_name,
        type_house,
        Church,
        father_number,
        mather_number,
        brothers_num,
        medication_name,
        hope,
        medication
      });

      setLoading(false);
      Swal.fire({
        text: 'تم تحديث البيانات بنجاح',
        icon: 'success',
        confirmButtonText: 'حسنًا'
      });
      router.push(`/all_person/${Grop_type}/team/${team}`);

      setName('');
      setPhone('');
      setDate('');
      setAddress('');
      setAcademicYear('');
      setFatherConfession('');
      setIgroub('');
      setgroub_type('');
      setteam_name('');
      settype_house('');
      setChurch('');
      setmedication_name('');
      setfather_number('');
      setmather_number('');
      setbrothers_num('');
      sethope('');
      setMedication('');
    } catch (error) {
      setLoading(false);
      Swal.fire({
        text: 'حدث خطأ أثناء تحديث البيانات. يرجى المحاولة مرة أخرى.',
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
          <Breadcrumb name="تعديل" />
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
                        disabled={isDisabled}
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
                          disabled={isDisabled}
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
                            {Teams.map((ele) => (
                              <option key={ele.id} value={ele.id}>
                                {ele.name}
                              </option>
                            ))}
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
                        type="text"
                        id="phone"
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='academic_year'>السنة الدراسية / (اسم المدرسة او الكلية )</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="academic_year"
                        value={academicYear}
                        required
                        onChange={(e) => setAcademicYear(e.target.value)}
                      />
                    </div>


                    <div>
                      <label htmlFor='type_house'>نوع السكن</label>
                      <select className="w-full rounded-lg border-gray-200 p-3 text-sm border" required id='type_house' value={type_house} onChange={(e) => settype_house(e.target.value)}>
                        <option value="1">ايجار</option>
                        <option value="2">تمليك</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor='Church'>الكنيسة التابعة لها </label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="Church"
                        value={Church}
                        onChange={(e) => setChurch(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='father_number'>(الاب)تلفون ولى الامر</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="father_number"
                        value={father_number}
                        required
                        onChange={(e) => setfather_number(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='mather_number'>(الام)تلفون ولى الامر</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="mather_number"
                        value={mather_number}
                        required
                        onChange={(e) => setmather_number(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='brothers_num'>عدد الاخوات / اسمائهم</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="brothers_num"
                        value={brothers_num}
                        required
                        onChange={(e) => setbrothers_num(e.target.value)}
                      />
                    </div>
                    <div className='flex items-center space-x-4'>
                      <label>هل تأخذ أي نوع من الأدوية باستمرار؟</label>

                      <select
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        id="medication"
                        value={medication}
                        required
                        onChange={(e) => setMedication(e.target.value)}
                      >
                        <option value="">برجاء الاختيار</option>
                        <option value="1">نعم</option>
                        <option value="2">لا</option>
                      </select>
                    </div>
                    {medication == "1" && medication !== "" ?
                      <div>
                        <label htmlFor='medication_name'>رجاء ذكر الدواء</label>
                        <input
                          className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                          type="text"
                          id="medication_name"
                          value={medication_name}
                          onChange={(e) => setmedication_name(e.target.value)}
                        />
                      </div>
                      :
                      ""
                    }
                    <div>
                      <label htmlFor='hope'>الهوايات</label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border"
                        type="text"
                        id="hope"
                        value={hope}
                        onChange={(e) => sethope(e.target.value)}
                      />
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

export default Edit;
