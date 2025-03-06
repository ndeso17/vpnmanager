const response = require("../../../Models/response");
const { getExistUsername, authLogin } = require("../../../Models/Admin/auth");
const { tokenAuthPin } = require("../../../Functions/Jwt/createJwt");
const compare = require("./compare");

const login = async (req, res) => {
  try {
    // Destructure dengan nilai default untuk memastikan properti ada
    const { username = null, password = null } = req.body || {};

    // Cek apakah body request ada dan berisi data
    if (!req.body || Object.keys(req.body).length === 0) {
      return response(res, {
        statusCode: 400,
        message: "Body request tidak boleh kosong",
        data: null,
      });
    }

    // Cek apakah username dan password disertakan dan tidak null/undefined
    if (!username || !password) {
      return response(res, {
        statusCode: 400,
        message: "Username dan Password harus diisi",
        data: null,
      });
    }

    // Cek apakah username dan password adalah string dan tidak kosong
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.trim() === "" ||
      password.trim() === ""
    ) {
      return response(res, {
        statusCode: 400,
        message: "Username dan Password harus berupa string yang valid",
        data: null,
      });
    }

    const cariUsername = await getExistUsername(username);
    if (!cariUsername) {
      return response(res, {
        statusCode: 401,
        message: "Login gagal! Username atau Password salah",
        data: null,
      });
    }

    const savedPassword = await authLogin(username);
    const isMatch = await compare(password, savedPassword.password);
    if (isMatch.success === false) {
      return response(res, {
        statusCode: 401,
        message: "Login gagal! Username atau Password salah",
        data: null,
      });
    }
    if (isMatch) {
      const authToken = await tokenAuthPin(username, savedPassword.authPin);
      res.cookie("authToken", authToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 2,
      });
      const authPin = savedPassword.authPin;
      req.session.authSession = { username, authPin };

      const datas = {
        statusCode: 201,
        message: "Login Success",
        data: { authToken: authToken },
      };
      // return response(res, datas);
      return datas;
    }
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan saat login",
      data: null,
    });
  }
};

module.exports = login;
