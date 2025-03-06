const formatedToken = async (authHeader) => {
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer "
    return token;
  } else {
    return null;
  }
};
module.exports = formatedToken;
