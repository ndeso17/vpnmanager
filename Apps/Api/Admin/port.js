const getNetworkPorts = require("getNetworkPorts");
const port = async (req, res) => {
  try {
    const ports = await getNetworkPorts();

    return res.json(ports);
  } catch (error) {
    console.error("Error API port :", error.message);
    return [];
  }
};

module.exports = port;
