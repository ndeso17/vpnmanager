const si = require("systeminformation");

const getNetworkPorts = async () => {
  try {
    // Hanya ambil data networkConnections yang dibutuhkan
    const netstat = await si.networkConnections();

    // Jika tidak ada data atau array kosong, kembalikan array kosong
    if (!netstat || netstat.length === 0) {
      console.warn("Tidak ada koneksi jaringan yang tersedia.");
      return [];
    }

    // Petakan data port
    const ports = netstat.map((p) => ({
      localAddress: p.localAddress || "N/A",
      port: p.localPort || "N/A",
      protocol: p.protocol || "N/A",
      status: p.state || "N/A",
      pid: p.pid || "N/A",
      process: p.process || "N/A",
    }));

    return ports;
  } catch (error) {
    console.error(
      "Error saat mengambil informasi port jaringan:",
      error.message
    );
    return [];
  }
};

module.exports = getNetworkPorts;
