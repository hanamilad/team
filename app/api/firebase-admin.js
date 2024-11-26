import admin from "firebase-admin";

const serviceAccount = require("path/to/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://scout-311f1-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

const adminAuth = admin.auth();
export { adminAuth };
