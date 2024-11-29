// firebase-admin.js
import admin from "firebase-admin";

// الحصول على بيانات الاعتماد من المتغير البيئي
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://scout-311f1-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

console.log("Firebase Admin SDK initialized");


export { admin };
