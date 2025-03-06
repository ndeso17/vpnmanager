// Konfigurasi Axios untuk request ke API
const options = {
  method: "PUT",
  url: "/api/empu/stats",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
};

// Inisialisasi chart dan data
let cpuChart, ramChart, diskChart;
let downloadChartBandwidth, uploadChartBandwidth, kuotaChartBandwidth;
const downloadDataBandwidth = { labels: [], values: [], maxPoints: 10 };
const uploadDataBandwidth = { labels: [], values: [], maxPoints: 10 };
let lastDownload = 0;
let lastUpload = 0;

// Fungsi untuk mengonversi bytes ke unit yang sesuai
function formatKuotaBandwidth(bytes, returnRaw = false) {
  const bytesNum = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (returnRaw) return { value: bytesNum, unit: "Bytes" };

  const kb = bytesNum / 1024;
  if (kb < 1024) return { value: kb.toFixed(2), unit: "KB" };
  const mb = kb / 1024;
  if (mb < 1024) return { value: mb.toFixed(2), unit: "MB" };
  const gb = mb / 1024;
  return { value: gb.toFixed(2), unit: "GB" };
}

// Fungsi untuk menentukan warna berdasarkan persentase penggunaan
function getUsageColor(used, total) {
  const usagePercentage = (used / total) * 100;
  if (usagePercentage < 50) {
    return "#22c55e"; // Hijau untuk < 50%
  } else if (usagePercentage >= 50 && usagePercentage <= 80) {
    return "#f97316"; // Orange untuk 50% - 80%
  } else {
    return "#ef4444"; // Merah untuk > 80%
  }
}

//! Chart Download (Line)
function initDownloadChartBandwidth(initialUnit) {
  downloadChartBandwidth = new Chart(
    document.getElementById("downloadChartBandwidth").getContext("2d"),
    {
      type: "line",
      data: {
        labels: downloadDataBandwidth.labels,
        datasets: [
          {
            label: "Download",
            data: downloadDataBandwidth.values,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: `Download (${initialUnit}/s)` },
          },
          x: { title: { display: true, text: "Time" } },
        },
        animation: { duration: 1000 },
      },
    }
  );
}

function updateDownloadChartBandwidth(download, deltaTime) {
  const timeLabel = new Date().toLocaleTimeString();
  const speed = download.value / deltaTime;

  downloadDataBandwidth.labels.push(timeLabel);
  downloadDataBandwidth.values.push(speed);

  if (downloadDataBandwidth.labels.length > downloadDataBandwidth.maxPoints) {
    downloadDataBandwidth.labels.shift();
    downloadDataBandwidth.values.shift();
  }

  downloadChartBandwidth.data.labels = downloadDataBandwidth.labels;
  downloadChartBandwidth.data.datasets[0].data = downloadDataBandwidth.values;
  downloadChartBandwidth.options.scales.y.title.text = `Download (${download.unit}/s)`;
  downloadChartBandwidth.update();
}

//! Chart Upload (Line)
function initUploadChartBandwidth(initialUnit) {
  uploadChartBandwidth = new Chart(
    document.getElementById("uploadChartBandwidth").getContext("2d"),
    {
      type: "line",
      data: {
        labels: uploadDataBandwidth.labels,
        datasets: [
          {
            label: "Upload",
            data: uploadDataBandwidth.values,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: `Upload (${initialUnit}/s)` },
          },
          x: { title: { display: true, text: "Time" } },
        },
        animation: { duration: 1000 },
      },
    }
  );
}

function updateUploadChartBandwidth(upload, deltaTime) {
  const timeLabel = new Date().toLocaleTimeString();
  const speed = upload.value / deltaTime;

  uploadDataBandwidth.labels.push(timeLabel);
  uploadDataBandwidth.values.push(speed);

  if (uploadDataBandwidth.labels.length > uploadDataBandwidth.maxPoints) {
    uploadDataBandwidth.labels.shift();
    uploadDataBandwidth.values.shift();
  }

  uploadChartBandwidth.data.labels = uploadDataBandwidth.labels;
  uploadChartBandwidth.data.datasets[0].data = uploadDataBandwidth.values;
  uploadChartBandwidth.options.scales.y.title.text = `Upload (${upload.unit}/s)`;
  uploadChartBandwidth.update();
}

//! Chart CPU
function initCpuChart(cpu) {
  const usedColor = getUsageColor(cpu, 100); // Total CPU adalah 100%

  cpuChart = new Chart(document.getElementById("cpuChart").getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Used", "Free"],
      datasets: [
        {
          data: [cpu, 100 - cpu],
          backgroundColor: [usedColor, "#e5e7eb"],
        },
      ],
    },
    options: { animation: { duration: 1000 } },
  });
}

function updateCpuChart(cpu) {
  const usedColor = getUsageColor(cpu, 100); // Total CPU adalah 100%

  cpuChart.data.datasets[0].data = [cpu, 100 - cpu];
  cpuChart.data.datasets[0].backgroundColor = [usedColor, "#e5e7eb"];
  cpuChart.update();
}

//! Chart RAM
function initRamChart(ram) {
  const usedColor = getUsageColor(ram.used, ram.total);

  ramChart = new Chart(document.getElementById("ramChart").getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Used", "Free"],
      datasets: [
        {
          data: [ram.used, ram.total - ram.used],
          backgroundColor: [usedColor, "#e5e7eb"],
        },
      ],
    },
    options: { animation: { duration: 1000 } },
  });
}

function updateRamChart(ram) {
  const usedColor = getUsageColor(ram.used, ram.total);

  ramChart.data.datasets[0].data = [ram.used, ram.total - ram.used];
  ramChart.data.datasets[0].backgroundColor = [usedColor, "#e5e7eb"];
  ramChart.update();
}

//! Chart DISK
function initDiskChart(disk) {
  const usedColor = getUsageColor(disk.used, disk.total);

  diskChart = new Chart(document.getElementById("diskChart").getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Used", "Free"],
      datasets: [
        {
          data: [disk.used, disk.total - disk.used],
          backgroundColor: [usedColor, "#e5e7eb"],
        },
      ],
    },
    options: { animation: { duration: 1000 } },
  });
}

function updateDiskChart(disk) {
  const usedColor = getUsageColor(disk.used, disk.total);

  diskChart.data.datasets[0].data = [disk.used, disk.total - disk.used];
  diskChart.data.datasets[0].backgroundColor = [usedColor, "#e5e7eb"];
  diskChart.update();
}

//! Chart Kuota (Doughnut)
function initKuotaChartBandwidth(usedBytes, totalBytes) {
  const usedRaw = Number(usedBytes); // Pastikan dalam bytes
  const totalRaw = Number(totalBytes); // Pastikan dalam bytes

  // Konversi ke GB untuk chart
  const usedGB = usedRaw / (1024 * 1024 * 1024);
  const totalGB = totalRaw / (1024 * 1024 * 1024);
  const remainingGB = totalGB - usedGB;

  const usedColor = getUsageColor(usedGB, totalGB);

  kuotaChartBandwidth = new Chart(
    document.getElementById("kuotaChartBandwidth").getContext("2d"),
    {
      type: "doughnut",
      data: {
        labels: ["Used", "Free"],
        datasets: [
          {
            data: [usedGB, remainingGB],
            backgroundColor: [usedColor, "#e5e7eb"],
          },
        ],
      },
      options: {
        animation: { duration: 1000 },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    }
  );
}

function updateKuotaChartBandwidth(usedBytes, totalBytes) {
  const usedRaw = Number(usedBytes); // Pastikan dalam bytes
  const totalRaw = Number(totalBytes); // Pastikan dalam bytes

  // Konversi ke GB untuk chart
  const usedGB = usedRaw / (1024 * 1024 * 1024);
  const remainingGB = (totalRaw - usedRaw) / (1024 * 1024 * 1024);

  const usedColor = getUsageColor(usedGB, totalRaw / (1024 * 1024 * 1024));

  kuotaChartBandwidth.data.datasets[0].data = [usedGB, remainingGB];
  kuotaChartBandwidth.data.datasets[0].backgroundColor = [usedColor, "#e5e7eb"];
  kuotaChartBandwidth.update();
}

//! Request dan Update Data
const getBcdr = async () => {
  try {
    const response = await axios.request(options); // Menggunakan axios untuk request
    const datas = response.data;
    const cpu = datas.cpuLoad;
    const ram = datas.ramUsage;
    const disk = datas.diskUsage;
    const bandwidth = datas.bandwidth;

    const currentDownload = Number(bandwidth.trafikDownload);
    const currentUpload = Number(bandwidth.trafikUpload);
    const totalBandwidth = Number(bandwidth.totalBandwidth); // Pastikan number
    const usedBandwidth = Number(bandwidth.usedBandwidth);
    const remainingBandwidth = Number(bandwidth.remainingBandwidth);

    const downloadDelta =
      lastDownload === 0 ? 0 : currentDownload - lastDownload;
    const uploadDelta = lastUpload === 0 ? 0 : currentUpload - lastUpload;

    lastDownload = currentDownload;
    lastUpload = currentUpload;

    const downloadBandwidth = formatKuotaBandwidth(downloadDelta);
    const uploadBandwidth = formatKuotaBandwidth(uploadDelta);

    // Jika chart belum diinisialisasi, buat chart baru
    if (
      !cpuChart ||
      !ramChart ||
      !diskChart ||
      !downloadChartBandwidth ||
      !uploadChartBandwidth ||
      !kuotaChartBandwidth
    ) {
      initCpuChart(cpu);
      initRamChart(ram);
      initDiskChart(disk);
      initDownloadChartBandwidth(downloadBandwidth.unit);
      initUploadChartBandwidth(uploadBandwidth.unit);
      initKuotaChartBandwidth(usedBandwidth, totalBandwidth); // Gunakan bytes mentah
    }

    // Perbarui data chart
    updateCpuChart(cpu);
    updateRamChart(ram);
    updateDiskChart(disk);
    updateDownloadChartBandwidth(downloadBandwidth, 5); // DeltaTime 5 detik
    updateUploadChartBandwidth(uploadBandwidth, 5); // DeltaTime 5 detik
    updateKuotaChartBandwidth(usedBandwidth, totalBandwidth); // Gunakan bytes mentah
  } catch (error) {
    // Error handling tanpa console.log
  }
};

// Jalankan getBcdr pertama kali
getBcdr();

// Perbarui data setiap 5 detik
setInterval(async () => {
  await getBcdr();
}, 5000);
