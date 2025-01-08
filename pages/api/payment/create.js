import payOS from "../../../utils/payos";
import { runCors } from "../../../utils/cors";

const createPayOsOrder = async (req, res) => {
  // Apply CORS middleware
  runCors(req, res, async () => {
    const { description, returnUrl, cancelUrl, amount } = req.body;
    const body = {
      orderCode: Number(String(new Date().getTime()).slice(-6)),
      amount,
      description,
      cancelUrl,
      returnUrl,
    };
    console.log(body);

    try {
      // Call the external service to create the payment link
      const paymentLinkRes = await payOS.createPaymentLink(body);

      // Send the payment link response back to the client
      return res.json({
        error: 0,
        message: "Success",
        data: {
          bin: paymentLinkRes.bin,
          checkoutUrl: paymentLinkRes.checkoutUrl,
          accountNumber: paymentLinkRes.accountNumber,
          accountName: paymentLinkRes.accountName,
          amount: paymentLinkRes.amount,
          description: paymentLinkRes.description,
          orderCode: paymentLinkRes.orderCode,
          qrCode: paymentLinkRes.qrCode,
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({
        error: -1,
        message: "fail",
        data: null,
      });
    }
  });
};

export default createPayOsOrder;
