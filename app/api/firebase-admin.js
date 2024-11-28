// firebase-admin.js
import admin from "firebase-admin";

const serviceAccount = require("./service_account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://scout-311f1-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

export { admin }; 
