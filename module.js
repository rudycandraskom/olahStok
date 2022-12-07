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

function csvJSON(csv, spliter) {
    const lines = csv.split('\r\n')
    const result = []
    const headers = lines[0].split(spliter)

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i])
            continue
        const obj = {}
        const currentline = lines[i].split(spliter)
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j]
        }
        result.push(obj)
    }
    return result
}

function getStructured(stringCSV) {
    let header = 'f1|f2|f3|f4|f5|f6|f7|f8|f9|f10|f11|f12|f13'
    stringCSV = stringCSV.replace(/","/g, '|')
    stringCSV = stringCSV.replace(/",/g, '|')
    stringCSV = stringCSV.replace(/,"/g, '|')
    stringCSV = stringCSV.replace(/ "/g, '\r\n')
    stringCSV = stringCSV.replace(/"/g, ``)
    stringCSV = header + '\r\n' + stringCSV;
    return stringCSV;
}

function getStokMentah(stokSAP) {
    let lastUpdate = stokSAP[0].f3;
    let a = []
    let listBarang = stokSAP.map(value => {
        return new Barang(value.f9, value.f10, value.f12);
    })
    return new ObjStok(lastUpdate, listBarang);
}

function getStokFinal(stokMentah, stokMaster) {
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
module.exports = { getStokFinal, getStokMentah, getStructured, csvJSON, delay, Barang, ObjStok }