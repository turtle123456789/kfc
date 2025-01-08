import { getItem, updateData } from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  if (method === "POST") {
    try {
      const { id, name } = req.body;
      const data = await getItem(name, id);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "PUT") {
    try {
      const { id, col } = req.body;
      const newData = {
        account: req.body.account,
        phone: req.body.phone,
        name: req.body.name,
      };
      await updateData(col, id, newData);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
