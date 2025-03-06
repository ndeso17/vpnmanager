const getIptables = require("getIptables");
const iptable = async (req, res) => {
  try {
    const iptables = await getIptables();

    return res.json(iptables);
  } catch (error) {
    console.error("Error API iptables :", error.message);
    return [];
  }
};

module.exports = iptable;
