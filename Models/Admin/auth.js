const dbPool = require("../../Configs/database");

const getUserPin = async (username, authPin) => {
  try {
    const queryGetUserPin = `SELECT username, authPin, role FROM siempu WHERE username = ? AND authPin = ?`;
    const [rows] = await dbPool.execute(queryGetUserPin, [username, authPin]);
    const savedUsername = rows.length > 0 ? rows[0].username : null;
    const savedAuthPin = rows.length > 0 ? rows[0].authPin : null;
    return { savedUsername, savedAuthPin };
  } catch (error) {
    console.error("Error saat menjalankan Query getExistUsername =>", error);
    throw error;
  }
};
const getExistUsername = async (username) => {
  try {
    const queryGetExistUsername = `SELECT username FROM siempu WHERE username = ?`;
    const [rows] = await dbPool.execute(queryGetExistUsername, [username]);
    const existUsername = rows.length > 0 ? rows[0].username : null;
    return existUsername;
  } catch (error) {
    console.error("Error saat menjalankan Query getExistUsername =>", error);
    throw error;
  }
};

const authLogin = async (username) => {
  try {
    const queryAuthLogin = `SELECT username, password, authPin, role FROM siempu where username = ?`;
    const [rows] = await dbPool.execute(queryAuthLogin, [username]);
    const savedUsername = rows.length > 0 ? rows[0].username : null;
    const password = rows.length > 0 ? rows[0].password : null;
    const authPin = rows.length > 0 ? rows[0].authPin : null;
    const role = rows.length > 0 ? rows[0].role : null;
    return { savedUsername, password, authPin, role };
  } catch (error) {
    console.error("Error saat menjalankan Query authLogin:", error);
    throw error;
  }
};

module.exports = { getUserPin, getExistUsername, authLogin };
