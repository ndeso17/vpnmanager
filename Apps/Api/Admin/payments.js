const getAllPayments = require("getAllPayments");
const paymentsInterface = require("paymentsInterface");
const payments = async (req, res) => {
  try {
    const rawPayments = await getAllPayments();
    const allpayments = await paymentsInterface(rawPayments);
    return res.json(allpayments);
  } catch (error) {
    console.error("Error API Payments :", error.message);
    return [];
  }
};

module.exports = payments;
