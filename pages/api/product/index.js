import {
  getData,
  addData,
  deleData,
  updateData,
  getItem,
} from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  const name = "products";
  if (method === "POST") {
    try {
      await addData("products", { ...req.body });
      res.status(200).json({ message: "Data added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (method === "GET" && !req.body) {
    try {
      const data = await getData(name);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (method === "DELETE") {
    try {
      await deleData(name, { ...req.body });
      res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "PUT") {
    try {
      const data = req.body;
      await updateData(name, data.id, { ...data });
      res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "GET" && req.body.id) {
    try {
      const data = await getItem(name, req.body.id);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
