const fs = require("fs");
const path = require("path");
const axios = require("axios");

const payments = async (datas) => {
  try {
    const formatTanggal = (tanggal) => {
      if (!tanggal) return null;

      const date = new Date(tanggal);
      const hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ][date.getDay()];
      const tanggalNum = date.getDate();
      const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ][date.getMonth()];
      const tahun = date.getFullYear();
      const jam = date.getHours().toString().padStart(2, "0");
      const menit = date.getMinutes().toString().padStart(2, "0");

      return `${hari}, ${tanggalNum} ${bulan} ${tahun} - ${jam}:${menit}`;
    };

    // Fungsi untuk mendownload file jika belum ada
    const downloadFile = async (url, filePath) => {
      const writer = fs.createWriteStream(filePath);
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    };

    // Path untuk file JSON yang menyimpan list 404
    const error404FilePath = path.join(__dirname, "../../404paymentsfile.json");

    // Membaca atau membuat file JSON untuk list 404
    let error404List = [];
    if (fs.existsSync(error404FilePath)) {
      try {
        const fileContent = fs.readFileSync(error404FilePath, "utf8");
        if (fileContent.trim() === "") {
          // Jika file kosong, inisialisasi sebagai array kosong
          error404List = [];
          fs.writeFileSync(
            error404FilePath,
            JSON.stringify(error404List, null, 2)
          );
        } else {
          error404List = JSON.parse(fileContent);
          if (!Array.isArray(error404List)) {
            // Jika bukan array, reset ke array kosong
            error404List = [];
            fs.writeFileSync(
              error404FilePath,
              JSON.stringify(error404List, null, 2)
            );
          }
        }
      } catch (parseError) {
        console.error(
          "Error parsing 404paymentsfile.json, resetting to empty list:",
          parseError
        );
        error404List = [];
        fs.writeFileSync(
          error404FilePath,
          JSON.stringify(error404List, null, 2)
        );
      }
    } else {
      // Jika file tidak ada, buat file baru dengan array kosong
      fs.writeFileSync(error404FilePath, JSON.stringify(error404List, null, 2));
    }

    const formattedPayments = await Promise.all(
      datas.map(async (data) => {
        const tanggalRegister = formatTanggal(data.created_at);
        const tanggalPembayaran = formatTanggal(data.update_at);
        const acc = Boolean(data.acc);
        let buktiPembayaran = data.buktiPembayaran || "";
        const username = data.username || "";

        let statusPembayaran;
        if (acc && buktiPembayaran !== "" && tanggalPembayaran !== null) {
          statusPembayaran = "accepted";
        } else if (
          !acc &&
          buktiPembayaran !== "" &&
          tanggalPembayaran !== null
        ) {
          statusPembayaran = "review";
        } else if (
          !acc &&
          buktiPembayaran === "" &&
          tanggalPembayaran === null
        ) {
          statusPembayaran = "pending";
        } else {
          statusPembayaran = "unknown";
        }

        // Cek pada folder /Apps/Web/Assets/img/payments
        const paymentDir = path.join(
          __dirname,
          "../../Apps/Web/Assets/img/payments"
        );
        if (!fs.existsSync(paymentDir)) {
          fs.mkdirSync(paymentDir, { recursive: true });
        }

        let fileName = "";
        if (buktiPembayaran) {
          fileName = path.basename(buktiPembayaran);
          const filePath = path.join(paymentDir, fileName);

          // Cek apakah link ada di list 404
          const isLinkIn404List = error404List.some(
            (item) => item.link === buktiPembayaran
          );

          if (!isLinkIn404List && !fs.existsSync(filePath)) {
            try {
              await downloadFile(buktiPembayaran, filePath);
            } catch (err) {
              if (err.response && err.response.status === 404) {
                console.error(`File ${fileName} tidak ditemukan (404)`);
                // Tambahkan ke list 404
                error404List.push({ username, link: buktiPembayaran });
                // Simpan ke file JSON
                fs.writeFileSync(
                  error404FilePath,
                  JSON.stringify(error404List, null, 2)
                );
              } else {
                console.error(`Gagal mengunduh file ${fileName}:`, err);
              }
            }
          }
          // else if (isLinkIn404List) {
          //   console.log(
          //     `File ${fileName} dilewati karena terdaftar di 404 list`
          //   );
          // } else {
          //   console.log(`File ${fileName} sudah ada di ${filePath}`);
          // }

          // Ganti buktiPembayaran dengan fileName
          buktiPembayaran = fileName;
        }

        return {
          username,
          idTelegram: parseInt(data.idTelegram) || 0,
          kodePembayaran: data.kodePembayaran || "",
          buktiPembayaran,
          statusPembayaran,
          tanggalRegister,
          tanggalPembayaran,
        };
      })
    );

    return formattedPayments;
  } catch (error) {
    console.error("Error Interface Payments =>", error);
    throw error;
  }
};

module.exports = payments;
