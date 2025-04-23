import admin from "firebase-admin";

const serviceAccount = require("./service-account.json");

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default firebase;
