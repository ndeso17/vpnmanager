const si = require("systeminformation");

const getProcesses = async () => {
  try {
    // Hanya ambil data processes yang dibutuhkan
    const processData = await si.processes();

    // Jika tidak ada data atau list kosong, kembalikan array kosong
    if (!processData || !processData.list || processData.list.length === 0) {
      console.warn("Tidak ada data proses yang tersedia.");
      return [];
    }

    // Petakan data proses
    const processes = processData.list.map((p) => ({
      name: p.name || "N/A",
      pid: p.pid || "N/A",
      status: p.state || "N/A",
      user: p.user || "N/A",
      path: p.path || "N/A",
    }));

    return processes;
  } catch (error) {
    console.error("Error saat mengambil informasi proses:", error.message);
    return [];
  }
};

module.exports = getProcesses;
