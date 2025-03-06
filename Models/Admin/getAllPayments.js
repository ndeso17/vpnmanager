const dbPool = require("dbPool");
const getAllPayments = async () => {
  try {
    const queryGetAllPayments = `SELECT * FROM payment`;
    const [rows] = await dbPool.execute(queryGetAllPayments);

    return rows;
  } catch (error) {
    console.error("Error saat menjalankan Query getPayments =>", error);
    throw error;
  }
};

module.exports = getAllPayments;
