// pages/api/payment/verify.js
import payOS from "../../../utils/payos";
import { runCors } from "../../../utils/cors";

export const verifyPayOsWebhookData = async function (req, res) {
  // Apply CORS middleware
  runCors(req, res, async () => {
    console.log("payment handler");
    console.log(req.body);
    const webhookData = payOS.verifyPaymentWebhookData(req.body);

    if (["Thanh toan don hanggg", "VQRIO123"].includes(webhookData.description)) {
      return res.json({
        error: 0,
        message: "Ok",
        data: webhookData,
      });
    }

    return res.json({
      error: 0,
      message: "Ok",
      data: webhookData,
    });
  });
};

export default verifyPayOsWebhookData;
