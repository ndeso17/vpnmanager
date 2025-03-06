const si = require("systeminformation");

const getDiskUsage = async () => {
  try {
    // Hanya ambil data fsSize yang dibutuhkan
    const diskData = await si.fsSize();

    // Jika tidak ada data atau array kosong, kembalikan nilai default
    if (!diskData || diskData.length === 0) {
      console.warn("Tidak ada data disk yang tersedia.");
      return {
        used: 0,
        total: 0,
        mount: "unknown",
      };
    }

    // Ambil disk pertama (atau bisa dimodifikasi untuk disk spesifik)
    const primaryDisk = diskData[0];

    const diskUsage = {
      used: primaryDisk.used / 1024 / 1024 / 1024 || 0, // GB
      total: primaryDisk.size / 1024 / 1024 / 1024 || 0, // GB
      mount: primaryDisk.mount || "unknown", // Titik mount (misalnya /)
    };

    return diskUsage;
  } catch (error) {
    console.error("Error saat mengambil penggunaan disk:", error.message);
    return {
      used: 0,
      total: 0,
      mount: "unknown",
    };
  }
};

module.exports = getDiskUsage;
