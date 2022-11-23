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

const csv = require('csvtojson');
const fs = require('fs');
const csvStokMentah = 'stokMentah.csv';
csv({ noheader: true })
    .fromFile(csvStokMentah)
    .then((jsonObj) => {
        lastUpdate = jsonObj[0].field3;
        let listBarang = jsonObj.map(value => {
                return new Barang(value.field9, value.field10, value.field12);
            }) //.filter(val => val.sisaStok > 0);
        let dataStok = new ObjStok(lastUpdate, listBarang);

        try {
            fs.writeFileSync('stokMentah.json', JSON.stringify(dataStok, null, 4));
        } catch (err) {
            console.error(err);
        }
    });
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
try {
    const jsonStokMaster = fs.readFileSync("StokMaster.json", { encoding: 'utf8', flag: 'r' });
    const jsonStokMentah = fs.readFileSync("StokMentah.json", { encoding: 'utf8', flag: 'r' });
    var stokFinal = combine(JSON.parse(jsonStokMentah), JSON.parse(jsonStokMaster));
    fs.writeFileSync('stokFinal.json', JSON.stringify(stokFinal, null, 4));
    console.log("STOK SELESAI DIOLAH DAN SIAP DI-UPLOAD")
} catch (error) {
    console.log(error);
}


function combine(stokMentah, stokMaster) {
    var hasil = {};

    for (let i = 0; i < stokMaster.length; i++) {
        for (let j = 0; j < stokMentah.listBarang.length; j++) {
            if (stokMaster[i].kodeBarang === stokMentah.listBarang[j].kodeProduk) {
                let intIsiPerBox = parseInt(stokMaster[i].isiPerBox.replace(/,/g, ''));
                let intSisaStokMentah = parseInt(stokMentah.listBarang[j].sisaStok.replace(/,/g, ''));;
                stokMaster[i].sisaStok = `${Math.floor(intSisaStokMentah / intIsiPerBox)} BOX ${intSisaStokMentah % intIsiPerBox} ROLL`;
            };
        }
        // hasil.push(
        //     [stokMaster[i].kodeBarang]: {
        //         kodeProduk: stokMaster[i].kodeBarang,
        //         namaProduk: stokMaster[i].namaBarang,
        //         sisStok: stokMaster[i].sisaStok
        //     })

        // hasil.push({
        //     kodeProduk: stokMaster[i].kodeBarang,
        //     namaProduk: stokMaster[i].namaBarang,
        //     sisStok: stokMaster[i].sisaStok
        // })

        hasil[i] = {
            kodeProduk: stokMaster[i].kodeBarang,
            namaProduk: stokMaster[i].namaBarang,
            sisaStok: stokMaster[i].sisaStok
        }
    }
    return new ObjStok(stokMentah.lastUpdate, hasil);
}