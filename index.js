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

firebase.initializeApp(firebaseConfig);
firebase.analytics();

fetch('stokFinal.json')
    .then(response => response.json())
    .then(jsonResponse => {
        firebase.database().ref("stokFinal/").set(jsonResponse);
    })
document.getElementById("keterangan").innerHTML = "SELESAI DI UPLOAD"