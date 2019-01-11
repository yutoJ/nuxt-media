import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
    var config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID
    };
    firebase.initializeApp(config);
    firebase.firestore().settings({
        timestampsInSnapshots: true
    })
}

const db = firebase.firestore();

export default db;
