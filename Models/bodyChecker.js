const response = require("response");

const bodyChecker = (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    return response(res, {
      statusCode: 500,
      message:
        "Internal Server Error, terjadi kesalahan saat memeriksa input body.",
      data: null,
    });
  }
};

module.exports = bodyChecker;
