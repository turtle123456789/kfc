import { getData } from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  const name = "DanhMucMonAn";
  if (method === "GET") {
    try {
      const data = await getData(name);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
