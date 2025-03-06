const dbPool = require("dbPool");
const getAllClients = async () => {
  try {
    const queyGetClientData = `SELECT DISTINCT email, idTelegram FROM registerVpn`;
    const [rows] = await dbPool.execute(queyGetClientData);
    return rows;
  } catch (error) {
    console.error("Error saat menjalankan Query getClientData =>", error);
    throw error;
  }
};

module.exports = getAllClients;
