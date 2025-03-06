const getAllClients = require("getAllClients");
const clients = async (req, res) => {
  try {
    const allClients = await getAllClients();
    return res.json(allClients);
  } catch (error) {
    console.error("Error API Clients :", error.message);
    return [];
  }
};

module.exports = clients;
