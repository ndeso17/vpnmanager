const Logs = (req, res, next) => {
  const method = req.method;
  const hostname = req.hostname;
  const protocol = req.protocol;
  const path = req.path;
  let ipClient =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;

  // Hilangkan "::ffff:" jika ada
  if (ipClient.includes("::ffff:")) {
    ipClient = ipClient.replace("::ffff:", "");
  }

  // Get current date and time in the server's timezone
  const currentDate = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZoneName: "short",
  };
  const formattedDateTime = currentDate.toLocaleString("id-ID", options);

  const request = {
    path,
    ipClient,
    hostname,
    protocol,
    method,
    dateTime: formattedDateTime,
  };

  console.log("LOG REQUEST", request);
  req.log = request;
  next();
};

module.exports = Logs;
