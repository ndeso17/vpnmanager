const si = require("systeminformation");

const getCpuLoad = async () => {
  try {
    // Hanya ambil data cpuLoad yang dibutuhkan
    const cpuLoad = await si.currentLoad();

    // Pastikan data ada, jika tidak kembalikan 0
    const load = cpuLoad.currentLoad !== undefined ? cpuLoad.currentLoad : 0;

    return load;
  } catch (error) {
    console.error("Error saat mengambil beban CPU:", error.message);
    return 0;
  }
};

module.exports = getCpuLoad;
