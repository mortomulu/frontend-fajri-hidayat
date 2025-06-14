# 🇮🇩 Sistem Informasi Barang Ekspor

Aplikasi ini merupakan sistem pemilihan barang ekspor berdasarkan negara asal, pelabuhan, dan jenis barang. UI menggunakan **Ant Design** agar tampil modern, responsif, dan nyaman digunakan.

🔗 **Live Demo:** [https://frontend-fajri-hidayat.vercel.app/](https://frontend-fajri-hidayat.vercel.app/)

## ✨ Fitur Utama

- Dropdown dinamis berdasarkan negara ➝ pelabuhan ➝ barang.
- Auto-fill deskripsi, diskon, harga, dan total harga.
- Format mata uang IDR (Rupiah) otomatis.
- Modal preview data sebelum dikirim (coming soon).
- UI modern dengan Ant Design + Tailwind CSS.
- Integrasi API dengan proxy backend agar aman di HTTPS (menghindari mixed content).

---

## 🛠 How to Use

1. Pilih Negara
   Dropdown negara akan otomatis menampilkan daftar dari API. Default-nya memilih Indonesia.

2. Pilih Pelabuhan
   Setelah memilih negara, pelabuhan akan muncul sesuai negara tersebut.

3. Pilih Barang
   Barang yang tersedia akan disesuaikan berdasarkan pelabuhan yang dipilih.

4. Isi Diskon (Opsional)
   Kamu dapat mengubah diskon untuk melihat total harga secara otomatis.

5. Total Harga
   Akan terisi otomatis berdasarkan diskon dan harga barang.

6. Preview Modal

## 📦 Tech Stack

- React (Next.js)
- TypeScript
- Ant Design + Tailwind CSS
- Axios
- Vercel (Deployment)
- API Proxying via Next.js API Routes
