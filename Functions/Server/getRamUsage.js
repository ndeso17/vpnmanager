const si = require("systeminformation");

const getRamUsage = async () => {
  try {
    // Hanya ambil data mem yang dibutuhkan
    const mem = await si.mem();

    // Jika data tidak valid, kembalikan nilai default
    if (!mem || typeof mem.used !== "number" || typeof mem.total !== "number") {
      console.warn("Data RAM tidak tersedia atau tidak valid.");
      return {
        used: 0,
        total: 0,
      };
    }

    const ramUsage = {
      used: mem.used / 1024 / 1024 / 1024 || 0, // GB
      total: mem.total / 1024 / 1024 / 1024 || 0, // GB
    };

    return ramUsage;
  } catch (error) {
    console.error("Error saat mengambil penggunaan RAM:", error.message);
    return {
      used: 0,
      total: 0,
    };
  }
};

module.exports = getRamUsage;
