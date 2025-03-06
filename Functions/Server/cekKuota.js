const { exec } = require("child_process");

// Fungsi untuk menjalankan cekKuota.sh dan membaca output
const cekKuota = async () => {
  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        "./cekKuota.sh",
        { cwd: "/home/ndeso/vpnmanager/Tools/Xray" },
        (err, stdout, stderr) => {
          if (err) {
            console.error("Error menjalankan cekKuota.sh:", err.message);
            return reject(err);
          }
          resolve({ stdout, stderr });
        }
      );
    });

    // Jika ada stderr tapi bukan error fatal, log sebagai peringatan
    if (stderr) {
      console.warn("Peringatan dari cekKuota.sh:", stderr);
    }

    // Jika output kosong, kembalikan array kosong
    if (!stdout || stdout.trim() === "") {
      console.warn("Tidak ada output dari cekKuota.sh.");
      return [];
    }

    // Parse output sebagai JSON
    const bandwidthStats = JSON.parse(stdout);
    return bandwidthStats;
  } catch (error) {
    console.error(
      "Error saat membaca atau mem-parse output cekKuota.sh:",
      error.message
    );
    return [];
  }
};

module.exports = cekKuota;
