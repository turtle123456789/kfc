import {
  addDataWithID,
  getItem,
  deleData,
  deleteElementArray,
} from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  if (method === "POST") {
    const { uid } = req.body;
    let add = false;
    const data = req.body;
    let arrayCart = [];
    try{
      const listCart = await getItem("cart", uid);
      if (listCart) {
        arrayCart = listCart.arrayCart;
        for (const key in arrayCart) {
          if (arrayCart[key].id === data.id) {
            arrayCart[key].quantity = arrayCart[key].quantity + data.quantity;
            add = true;
            break;
          }
        }
        if (add === false) {
          arrayCart.push({ ...data });
        }
      } else {
        arrayCart.push({ ...data });
      }
    }catch{
      res.status(500).json({ message: "Error" });
    }
    
    try {
      await addDataWithID("cart", uid, { arrayCart });
      res.status(200).json({ result: "success", output: arrayCart });
    } catch (error) {
      console.error(error);
      res.status(500).json(arrayCart, { message: "Something went wrong" });
    }
  }
  if (method === "GET") {
    try {
      const { uid } = req.body;
      const data = await getItem("cart", uid);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "DELETE") {
    try {
      const { uid } = req.query;
      console.log('first', uid)
      const data = await deleData("cart", uid);
      console.log('data', data)
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "PUT") {
    try {
      const { uid, id } = req.body;
      await deleteElementArray("cart", uid, id, "arrayCart");
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
