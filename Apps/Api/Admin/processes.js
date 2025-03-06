const getProcesses = require("getProcesses");
const process = async (req, res) => {
  try {
    const processes = await getProcesses();

    return res.json(processes);
  } catch (error) {
    console.error("Error API processes :", error.message);
    return [];
  }
};

module.exports = process;
