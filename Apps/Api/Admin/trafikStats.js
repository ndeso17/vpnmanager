const getNetworkTraffic = require("getNetworkTraffic");
const getCpuLoad = require("getCpuLoad");
const getDiskUsage = require("getDiskUsage");
const getRamUsage = require("getRamUsage");
const getBandwidth = require("getBandwidth");

const trafikStats = async (req, res) => {
  try {
    const networkTraffic = await getNetworkTraffic();
    const cpuLoad = await getCpuLoad();
    const diskUsage = await getDiskUsage();
    const ramUsage = await getRamUsage();
    const bandwidth = await getBandwidth();

    const datas = {
      networkTraffic,
      cpuLoad,
      diskUsage,
      ramUsage,
      bandwidth,
    };

    res.json(datas);
  } catch (error) {
    console.error("Error API Trafik Stats:", error.message);
    return [];
  }
};

module.exports = trafikStats;
