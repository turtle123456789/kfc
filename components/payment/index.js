import GooglePayButton from "@google-pay/button-react";

export default function Payment({ value = 0, callback }) {
  return (
    <GooglePayButton
      className="my-2 w-[100%]"
      environment="TEST"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "example",
                gatewayMerchantId: "exampleGatewayMerchantId",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "12345678901234567890",
          merchantName: "Demo Merchant",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: value.toString(),
          currencyCode: "VND",
          countryCode: "VN",
        },
        shippingAddressRequired: true,
        callbackIntents: ["SHIPPING_ADDRESS", "PAYMENT_AUTHORIZATION"],
      }}
      onLoadPaymentData={(paymentRequest) => {
        console.log("load payment data", paymentRequest);
      }}
      onPaymentAuthorized={callback}
      onPaymentDataChanged={(paymentdata) => {
        console.log(paymentdata);
      }}
    />
  );
}
