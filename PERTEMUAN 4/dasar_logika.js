//tipe data
const namaProgrammer = "Budi Santoso";
const tahunMulai = 2022;
const tahunSekarang = new Date().getFullYear();

//Arrow func hitung masa pengalaman
const hitungPengalaman = (mulai, sekarang) => sekarang-mulai;
const masaKerja = hitungPengalaman(tahunMulai, tahunSekarang);

//eval kondisi dgn temary operatir
const statusSenioritas = masaKerja >= 2 ? "Mid-Level Developer" : "Junior Develover";
console.log("===INFORMASI PENGEMBANG===");
console.log(`Nama      : ${namaProgrammer}`);
console.log(`Pegalaman : ${masaKerja}tahun`);
console.log(`Kategori  : ${statusSenioritas}`);

//uji strict equalitiy vs loose equalitiy
console.log("\n===UJI PERBANDINGAN TIPE DATA===");
console.log("10=='10':",10 == '10'); //true(tipe coercion)
console.log("10==='10':",10 === '10'); //false(strict equalitiy)
console.log("Tipe 10 :", typeof 10);
console.log("Tipe '10' :", typeof '10');