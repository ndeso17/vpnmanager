const { exec } = require("child_process");

// Ambil TOTALBW dari environment variable dan konversi ke number
const totalBw = Number(process.env.TOTALBW); // Default ke 1TB jika tidak ada env var

// Fungsi untuk menjalankan cekBandwidth.sh dan mengambil data hanya untuk eth0
const getBandwidth = async () => {
  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        "./cekBandwidth.sh",
        { cwd: "/home/ndeso/vpnmanager/Tools/Xray" },
        (err, stdout, stderr) => {
          if (err) {
            console.error("Error menjalankan cekBandwidth.sh:", err.message);
            return reject(err);
          }
          resolve({ stdout, stderr });
        }
      );
    });

    // Jika ada stderr tapi bukan error fatal, log sebagai peringatan
    if (stderr) {
      console.warn("Peringatan dari cekBandwidth.sh:", stderr);
    }

    // Jika output kosong, kembalikan objek kosong untuk eth0
    if (!stdout || stdout.trim() === "") {
      console.warn("Tidak ada output dari cekBandwidth.sh.");
      return { interface: "eth0", used_bandwidth: 0 };
    }

    // Parse output sebagai JSON
    const bandwidthStats = JSON.parse(stdout);
    const eth0Data = bandwidthStats.find((stat) => stat.interface === "eth0");

    // Jika eth0Data tidak ada, kembalikan default
    if (!eth0Data) {
      console.warn("Data untuk eth0 tidak ditemukan.");
      return { interface: "eth0", used_bandwidth: 0 };
    }

    // Menghitung sisa kuota dalam bytes
    const interface = eth0Data.interface;
    const trafikDownload = eth0Data.download;
    const trafikUpload = eth0Data.upload;
    const totalBandwidth = totalBw; // Sudah number dari awal
    const usedBandwidth = eth0Data.used_bandwidth;
    // const remainingBandwidth = totalBandwidth - usedBandwidth;

    const datas = {
      interface,
      trafikDownload,
      trafikUpload,
      totalBandwidth, // Sekarang number, bukan string
      usedBandwidth,
      // remainingBandwidth,
    };

    return datas;
  } catch (error) {
    console.error(
      "Error saat membaca atau mem-parse output cekBandwidth.sh:",
      error.message
    );
    return { interface: "eth0", used_bandwidth: 0 };
  }
};

module.exports = getBandwidth;
