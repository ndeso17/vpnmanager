const bcrypt = require("bcrypt");
const compare = async (inputPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat mencocokkan password.",
      data: error,
    };
  }
};

module.exports = compare;
