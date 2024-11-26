import { auth, database } from '../../firebase/Firebasepage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as databaseRef, set } from 'firebase/database';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, role, mini_role } = body;

    // إنشاء مستخدم جديد في Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // حفظ بيانات المستخدم في Firebase Realtime Database
    const userRef = databaseRef(database, `users/${user.uid}`);
    await set(userRef, {
      userId: user.uid,
      email: email,
      username: name,
      role: role,
      semi_role: mini_role
    });

    // العودة برد ناجح مع ID المستخدم
    return new Response(
      JSON.stringify({ success: true, userId: user.uid }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
