// pages/api/payment/index.js
import { addDataWithID, addToFirebaseArray, getItem, deleData } from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  if (method === "POST") {
    try {
      const { id_user, list_item, date, amount, address, payment } = req.body;
      const check = await getItem("previous-order", id_user);
      if (check) {
        await addToFirebaseArray("previous-order", id_user, {
          list_item,
          date,
          amount,
          address,
          payment,
        });
      } else {
        const items = [];
        items.push({ list_item, date, amount, address, payment });
        await addDataWithID("previous-order", id_user, { items });
      }
      await deleData("cart", id_user);
      res.status(200).json({ result: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: null });
    }
  }
}
