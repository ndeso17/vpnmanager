const si = require("systeminformation");

const getNetworkTraffic = async (interfaceName = "eth0") => {
  try {
    // Hanya ambil data networkStats yang dibutuhkan
    const networkStats = await si.networkStats(interfaceName);

    // Jika tidak ada data atau array kosong, kembalikan nilai default
    if (!networkStats || networkStats.length === 0) {
      console.warn(
        `Tidak ada statistik jaringan yang tersedia untuk interface: ${interfaceName}`
      );
      return {
        download: 0,
        upload: 0,
        interface: interfaceName,
      };
    }

    // Ambil interface pertama atau yang sesuai dengan interfaceName
    const selectedInterface = networkStats[0];

    const bandwidth = {
      download: selectedInterface.rx_sec || 0, // Bytes per detik (RX)
      upload: selectedInterface.tx_sec || 0, // Bytes per detik (TX)
      interface: selectedInterface.iface, // Nama interface (misalnya eth0)
    };

    return bandwidth;
  } catch (error) {
    console.error(
      `Error saat merekam Traffic Network untuk interface ${interfaceName}:`,
      error.message
    );
    return {
      download: 0,
      upload: 0,
      interface: interfaceName,
    };
  }
};

module.exports = getNetworkTraffic;
