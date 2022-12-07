const initializeApp = require("firebase/app");
const { ref, set, goOffline, getDatabase } = require("firebase/database");
const fs = require("fs");
const { getStokFinal, getStokMentah, getStructured, csvJSON, delay, Barang, ObjStok } = require("./module.js");

const stokMaster = csvJSON(fs.readFileSync("stokMaster.csv", "utf-8"), ",");
const stokSAP = csvJSON(getStructured(fs.readFileSync("stokMentah.csv", "utf-8")), "|");
const stokMentah = getStokMentah(stokSAP)
const stokFinal = getStokFinal(stokMentah, stokMaster)

/** Koneksi Firebase App dan Firebase Database */
const firebaseConfig = {
    apiKey: "AIzaSyC85BGiISzy9fhfvFSxE0tXT8JiD5AYm1M",
    authDomain: "ekad-ptk.firebaseapp.com",
    databaseURL: "https://ekad-ptk-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ekad-ptk",
    storageBucket: "ekad-ptk.appspot.com",
    messagingSenderId: "192931912612",
    appId: "1:192931912612:web:0eb722311035997a15ff31",
    measurementId: "G-JJ9C7YRS8P"
};
const app = initializeApp.initializeApp(firebaseConfig);
const database = getDatabase();

console.log("Loading....");
(async() => {
    await delay(3);
    set(ref(database, "stokFinalx"), stokFinal);
    console.log("Stok Final sedang di Upload....");
    await delay(3);
    console.log("Stok Final berhasil di-Upload ");
    goOffline(database);
})();