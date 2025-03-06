const { exec } = require("child_process");

const getIptables = async () => {
  try {
    const iptablesOutput = await new Promise((resolve, reject) => {
      exec("iptables -L -n --line-numbers", (err, stdout, stderr) => {
        if (err) {
          console.error("Error menjalankan iptables:", err.message, stderr);
          return resolve([]); // Resolve dengan array kosong agar tetap konsisten
        }
        resolve(stdout);
      });
    });

    // Jika output kosong, kembalikan array kosong
    if (!iptablesOutput || iptablesOutput.trim() === "") {
      console.warn("Tidak ada output dari iptables.");
      return [];
    }

    // Parse output iptables
    const lines = iptablesOutput.split("\n").filter((line) => line.trim());
    const rules = [];
    let currentChain = null;

    lines.forEach((line) => {
      // Deteksi chain (misalnya "Chain INPUT")
      if (line.startsWith("Chain ")) {
        currentChain = line.split(" ")[1];
        return;
      }

      // Parse baris aturan (num, target, prot, opt, source, destination)
      const ruleMatch = line.match(
        /^(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/
      );
      if (ruleMatch && currentChain) {
        const [, num, target, prot, opt, source, destination] = ruleMatch;
        rules.push({
          chain: currentChain,
          num: parseInt(num, 10),
          target,
          protocol: prot,
          opt,
          source,
          destination,
          raw: line.trim(), // Simpan baris asli untuk referensi
        });
      }
    });

    return rules;
  } catch (error) {
    console.error("Error saat mengambil aturan iptables:", error.message);
    return [];
  }
};

module.exports = getIptables;
