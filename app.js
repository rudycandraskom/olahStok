/**Import Modules */
const fs = require("fs");
const initializeApp = require("firebase/app");
const getDatabase = require("firebase/database");
const { ref, set, goOffline } = require("firebase/database");
const csv = require('csvtojson');

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
const database = getDatabase.getDatabase();

/**Class ObjStok dan Barang */
class ObjStok {
    constructor(lastUpdate, listBarang) {
        this.lastUpdate = lastUpdate;
        this.listBarang = listBarang;
    }
}
class Barang {
    constructor(kodeProduk, namaProduk, sisaStok) {
        this.kodeProduk = kodeProduk;
        this.namaProduk = namaProduk;
        this.sisaStok = sisaStok;
    }
}

/** Fungsi Delay */
function delay(detik) {
    return new Promise(resolve => setTimeout(resolve, detik * 1000 || DEF_DELAY));
}

/** Konversi stokMentah.csv jadi stokMentah.json */
function konversiStokMentahCSVtoJSON() {
    const csvStokMentah = 'stokMentah.csv';
    csv({ noheader: true })
        .fromFile(csvStokMentah)
        .then((jsonObj) => {
            lastUpdate = jsonObj[0].field3;
            let listBarang = jsonObj.map(value => {
                return new Barang(value.field9, value.field10, value.field12);
            })
            let dataStok = new ObjStok(lastUpdate, listBarang);

            try {
                fs.writeFileSync('stokMentah.json', JSON.stringify(dataStok, null, 4));
            } catch (err) {
                console.error(err);
            }
        });
};

/** Konversi stokMaster.csv menjadi stokMaster.json */
function konversiStokMasterCSVtoJSON() {
    const csvStokMaster = "StokMaster.csv";
    csv()
        .fromFile(csvStokMaster)
        .then((jsonObj) => {
            let objStokMaster = jsonObj.map(value => {
                return value;
            });
            try {
                fs.writeFileSync('stokMaster.json', JSON.stringify(objStokMaster, null, 4));
            } catch (err) {
                console.error(err);
            }
        });
};

/** Proses stokMaster combine StokMentah menjadi stokFinal */
function combine(stokMentah, stokMaster) {
    var hasil = {};
    for (let i = 0; i < stokMaster.length; i++) {
        for (let j = 0; j < stokMentah.listBarang.length; j++) {
            if (stokMaster[i].kodeBarang === stokMentah.listBarang[j].kodeProduk) {
                let intIsiPerBox = parseInt(stokMaster[i].isiPerBox.replace(/,/g, ''));
                let intSisaStokMentah = parseInt(stokMentah.listBarang[j].sisaStok.replace(/,/g, ''));;
                stokMaster[i].sisaStok = `${Math.floor(intSisaStokMentah / intIsiPerBox)} BOX\n${intSisaStokMentah % intIsiPerBox} ROLL`;
            };
        }

        hasil[i] = {
            kodeProduk: stokMaster[i].kodeBarang,
            namaProduk: stokMaster[i].namaBarang,
            sisaStok: stokMaster[i].sisaStok
        }
    }
    return new ObjStok(stokMentah.lastUpdate, hasil);
}

(async() => {
    konversiStokMentahCSVtoJSON();
    console.log("stokMentah.json (1of4)");
    await delay(3);
    konversiStokMasterCSVtoJSON();
    console.log("stokMaster.json (2of4)");
    await delay(3);
    try {
        const jsonStokMaster = fs.readFileSync("StokMaster.json", { encoding: 'utf8', flag: 'r' });
        const jsonStokMentah = fs.readFileSync("StokMentah.json", { encoding: 'utf8', flag: 'r' });
        var stokFinal = combine(JSON.parse(jsonStokMentah), JSON.parse(jsonStokMaster));
        fs.writeFileSync('stokFinal.json', JSON.stringify(stokFinal, null, 4));
        console.log("stokFinal.json (3of4)");
    } catch (error) {
        console.log(error);
    }
    await delay(3)
    stokFinal = fs.readFileSync('../olahStok/stokFinal.json', { encoding: 'utf8', flag: 'r' });
    set(ref(database, "stokFinal"), JSON.parse(stokFinal));
    console.log("Stok Final sedang di Upload....");
    await delay(5);
    console.log("Stok Final berhasil di-Upload (4/4)");
    goOffline(database);
})();